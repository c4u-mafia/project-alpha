import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { IncomingHttpHeaders } from 'http';
import { auth } from '../../auth';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Converts Node.js IncomingHttpHeaders (plain object) to the Web API Headers
 * object that better-auth's getSession() expects.
 * Preserves the Authorization header so bearer() and jwt() plugins can read it.
 */
function toWebHeaders(incoming: IncomingHttpHeaders): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }
  return headers;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Routes/controllers decorated with @Public() bypass this guard entirely
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

    // better-auth manages its own /api/auth/* routes — don't block them
    if (request.path?.startsWith('/api/auth')) return true;

    // getSession() checks (in order, with our plugins):
    //   1. Cookie header         — web / browser sessions
    //   2. Authorization: Bearer — mobile sessions (via bearer() plugin)
    //   3. Bearer JWT            — stateless JWT from /api/auth/token (via jwt() plugin)
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
    return true;
  }
}
