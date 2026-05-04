import 'dotenv/config';

import { APIError, createAuthMiddleware } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { bearer, emailOTP, jwt, openAPI } from 'better-auth/plugins';
import { expo } from '@better-auth/expo';
import { Resend } from 'resend';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { SELF_SERVE_ROLES, type AppRole, authSchema, user } from '../db/schema';
import { otpTemplate } from '../email/templates/otp.template';
import { welcomeTemplate } from '../email/templates/welcome.template';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM =
  process.env.EMAIL_FROM ?? 'Homelyn <noreply@koanprotocol.com>';

const trustedOrigins = [
  'Homelyn://',
  'Homelyn-staging://',
  'Homelyn://*',
  'Homelyn-staging://*',
  'exp://',
  'exp://**',
  'exp://192.168.*.*:*/**',
  process.env.WEB_ORIGIN,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:8081',
  'http://localhost:19006',
].filter((origin): origin is string => Boolean(origin));

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

function isSelfServeRole(
  role: unknown,
): role is (typeof SELF_SERVE_ROLES)[number] {
  return (
    typeof role === 'string' &&
    (SELF_SERVE_ROLES as readonly string[]).includes(role)
  );
}

function assertSelfServeRole(
  role: unknown,
  message = 'Role must be tenant or landlord.',
) {
  if (!isSelfServeRole(role)) {
    throw new APIError('BAD_REQUEST', { message });
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

async function findUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: eq(user.email, email),
  });
}

function normalizeRole(role: unknown): AppRole | null {
  return typeof role === 'string' &&
    (['tenant', 'landlord', 'admin'] as readonly string[]).includes(role)
    ? (role as AppRole)
    : null;
}

async function sendWelcomeEmailOnce(createdUser: Record<string, unknown>) {
  const userId = typeof createdUser.id === 'string' ? createdUser.id : null;
  if (!userId) return;

  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!foundUser?.email || foundUser.welcomeEmailSentAt) return;

  const { subject, html } = welcomeTemplate({
    name: foundUser.name,
    role: normalizeRole(foundUser.role),
  });

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: foundUser.email,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }

  await db
    .update(user)
    .set({ welcomeEmailSentAt: new Date(), updatedAt: new Date() })
    .where(eq(user.id, userId));
}

const authConfig: BetterAuthOptions = {
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  experimental: {
    joins: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ['tenant', 'landlord', 'admin'],
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : undefined,
  plugins: [
    expo(),

    // bearer() — makes auth.api.getSession() accept "Authorization: Bearer <token>"
    // This is what enables JWT-based auth for mobile. Without this, only cookies work.
    bearer(),

    // jwt() — exposes GET /api/auth/token (returns a signed JWT from an active session)
    //          and GET /api/auth/jwks (public key set for stateless verification).
    // Mobile flow: sign-in → call /api/auth/token → store JWT → send as Bearer on every request.
    // Swagger flow: sign-in via /api/auth/reference → GET /api/auth/token → paste JWT in Authorize.
    jwt({
      jwt: {
        // 7 days is appropriate for mobile — avoids constant re-auth friction.
        // Shorten to 1h + implement refresh if you add refresh token support later.
        expirationTime: '7d',
        // Only embed what the server actually needs — keeps token small for mobile bandwidth.
        definePayload: ({ user: u }) => {
          const sessionUser = asRecord(u);
          return {
            id: sessionUser.id,
            email: sessionUser.email,
            role: sessionUser.role ?? null,
          };
        },
      },
    }),

    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        const { subject, html } = otpTemplate(otp, type);
        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject,
          html,
        });
      },
    }),
    openAPI(),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const body = asRecord(ctx.body as unknown);

      if (ctx.path === '/sign-up/email') {
        assertSelfServeRole(
          body.role,
          'Choose either tenant or landlord when signing up.',
        );
      }

      if (ctx.path === '/sign-in/email-otp') {
        const email = body.email;
        if (typeof email !== 'string') {
          throw new APIError('BAD_REQUEST', { message: 'Email is required.' });
        }

        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
          assertSelfServeRole(
            body.role,
            'Choose either tenant or landlord before completing OTP signup.',
          );
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: (newUser) => {
          const nextUser = asRecord(newUser);
          const nextRole =
            typeof nextUser.role === 'string'
              ? (nextUser.role as AppRole)
              : null;

          if (nextRole === 'admin') {
            throw new APIError('FORBIDDEN', {
              message:
                'Admin accounts cannot be created from public signup flows.',
            });
          }

          if (nextRole && !isSelfServeRole(nextRole)) {
            throw new APIError('BAD_REQUEST', {
              message: 'Role must be tenant or landlord.',
            });
          }

          return Promise.resolve({
            data: {
              ...nextUser,
              role: nextRole,
            },
          });
        },
        after: (createdUser) => {
          void sendWelcomeEmailOnce(createdUser).catch((error: unknown) => {
            console.error('Failed to send welcome email', error);
          });

          return Promise.resolve();
        },
      },
      update: {
        before: async (userData, ctx) => {
          if ('role' in userData) {
            if (!isSelfServeRole(userData.role)) {
              throw new APIError('BAD_REQUEST', {
                message: 'Role must be tenant or landlord.',
              });
            }

            const sessionUserId = ctx?.context.session?.user.id;
            if (!sessionUserId) {
              throw new APIError('UNAUTHORIZED', {
                message: 'You must be signed in to choose a role.',
              });
            }

            const currentUser = await db.query.user.findFirst({
              where: eq(user.id, sessionUserId),
            });

            if (!currentUser) {
              throw new APIError('NOT_FOUND', {
                message: 'User not found.',
              });
            }

            if (currentUser.role && currentUser.role !== userData.role) {
              throw new APIError('FORBIDDEN', {
                message: 'Role is already set and cannot be changed.',
              });
            }

            return {
              data: {
                ...userData,
                role: userData.role,
              },
            };
          }

          return {
            data: userData,
          };
        },
      },
    },
  },
};

export const auth = betterAuth(authConfig);
