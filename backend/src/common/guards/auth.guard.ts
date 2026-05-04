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
    // Skip guard for routes/controllers decorated with @Public()
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

    // better-auth handles its own routes — don't block them with our guard
    if (request.path?.startsWith('/api/auth')) return true;

    const session = await auth.api.getSession({
      headers: toWebHeaders(request.headers),
    });

    if (!session?.user) throw new UnauthorizedException('Sign in to continue.');

    // Attach to request for @CurrentUser() and RoleGuard to consume
    request.user = session.user;
    request.session = session.session;
    return true;
  }
}
