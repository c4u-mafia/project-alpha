import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AppRole } from '../../db/schema';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { SessionUser } from '../types/session-user.type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator — any authenticated user is allowed
    if (!requiredRoles?.length) return true;

    const user = context.switchToHttp().getRequest<{ user: SessionUser }>().user;
    if (!user?.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have access to this resource.');
    }
    return true;
  }
}
