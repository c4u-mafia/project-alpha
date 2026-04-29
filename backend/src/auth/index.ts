import 'dotenv/config';

import { APIError, createAuthMiddleware } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { emailOTP, openAPI, jwt } from 'better-auth/plugins';
import { expo } from '@better-auth/expo';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { SELF_SERVE_ROLES, type AppRole, authSchema, user } from '../db/schema';

const trustedOrigins = [
  "Homelyn://",
  "Homelyn-staging://",
  "Homelyn://*",
  "Homelyn-staging://*",
  "exp://",
  "exp://**",
  "exp://192.168.*.*:*/**",
  process.env.WEB_ORIGIN,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:8081',
  'http://localhost:19006',
].filter((origin): origin is string => Boolean(origin));

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

function isSelfServeRole(role: unknown): role is (typeof SELF_SERVE_ROLES)[number] {
  return (
    typeof role === 'string' &&
    (SELF_SERVE_ROLES as readonly string[]).includes(role)
  );
}

function assertSelfServeRole(role: unknown, message = 'Role must be tenant or landlord.') {
  if (!isSelfServeRole(role)) {
    throw new APIError('BAD_REQUEST', { message });
  }
}

async function findUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: eq(user.email, email),
  });
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
    jwt(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        // TODO: plug your email provider in here.
        // Example payload:
        //   email -> recipient address
        //   otp -> one-time passcode to deliver
        //   type -> "sign-in" | "email-verification" | "forget-password" | "change-email"
        console.log(`[auth:email-otp:${type}] send OTP ${otp} to ${email}`);
      },
    }),
    openAPI(),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        assertSelfServeRole(
          ctx.body?.role,
          'Choose either tenant or landlord when signing up.',
        );
      }

      if (ctx.path === '/sign-in/email-otp') {
        const email = ctx.body?.email;
        if (typeof email !== 'string') {
          throw new APIError('BAD_REQUEST', { message: 'Email is required.' });
        }

        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
          assertSelfServeRole(
            ctx.body?.role,
            'Choose either tenant or landlord before completing OTP signup.',
          );
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          const nextRole =
            typeof newUser.role === 'string' ? (newUser.role as AppRole) : null;

          if (nextRole === 'admin') {
            throw new APIError('FORBIDDEN', {
              message: 'Admin accounts cannot be created from public signup flows.',
            });
          }

          if (nextRole && !isSelfServeRole(nextRole)) {
            throw new APIError('BAD_REQUEST', {
              message: 'Role must be tenant or landlord.',
            });
          }

          return {
            data: {
              ...newUser,
              role: nextRole,
            },
          };
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
