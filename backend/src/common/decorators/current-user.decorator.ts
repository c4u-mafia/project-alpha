import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { SessionUser } from '../types/session-user.type';

/**
 * Injects the authenticated user from the request into a route handler param.
 * Only available on routes protected by AuthGuard.
 * @example async getMe(@CurrentUser() user: SessionUser)
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionUser => {
    return ctx.switchToHttp().getRequest().user;
  },
);
