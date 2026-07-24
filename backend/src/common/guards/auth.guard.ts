import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { IncomingHttpHeaders } from 'http';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { auth } from '../../auth';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { user } from '../../db/schema';

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

// Lazily initialized JWKS — reused across requests
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJWKS() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${BETTER_AUTH_URL}/api/auth/jwks`));
  }
  return jwks;
}

function toWebHeaders(incoming: IncomingHttpHeaders): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }
  return headers;
}

function extractBearer(headers: IncomingHttpHeaders): string | null {
  const auth = headers['authorization'];
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

function looksLikeJWT(token: string): boolean {
  return token.startsWith('eyJ') && token.split('.').length === 3;
}

async function assertAccountActive(userId: unknown): Promise<void> {
  if (typeof userId !== 'string') {
    throw new UnauthorizedException('Invalid session user.');
  }
  const [account] = await db
    .select({ status: user.status })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!account)
    throw new UnauthorizedException('User account no longer exists.');
  if (account.status !== 'active') {
    throw new ForbiddenException(
      account.status === 'banned'
        ? 'This account has been banned.'
        : 'This account is currently suspended.',
    );
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{
      headers: IncomingHttpHeaders;
      path: string;
      user: unknown;
      session: unknown;
    }>();

    if (request.path?.startsWith('/api/auth')) return true;

    const token = extractBearer(request.headers);

    // --- Path 1: JWT (stateless) ---
    if (token && looksLikeJWT(token)) {
      try {
        const { payload } = await jwtVerify(token, getJWKS(), {
          issuer: BETTER_AUTH_URL,
          audience: BETTER_AUTH_URL,
        });
        request.user = {
          id: payload['id'] ?? payload.sub,
          email: payload['email'],
          role: payload['role'] ?? null,
        };
        await assertAccountActive(payload['id'] ?? payload.sub);
        return true;
      } catch {
        throw new UnauthorizedException(
          'Invalid or expired JWT. Please sign in again.',
        );
      }
    }

    // --- Path 2: Session token (via bearer() plugin) ---
    const session = await auth.api.getSession({
      headers: toWebHeaders(request.headers),
    });

    if (!session?.user) {
      throw new UnauthorizedException(
        'No valid session. Sign in and include your token as: Authorization: Bearer <token>',
      );
    }

    request.user = session.user;
    request.session = session.session;
    await assertAccountActive(session.user.id);
    return true;
  }
}
