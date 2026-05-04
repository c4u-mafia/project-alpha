import { SetMetadata } from '@nestjs/common';
import type { AppRole } from '../../db/schema';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to one or more roles. Must be used alongside AuthGuard.
 * @example @Roles('landlord') or @Roles('admin')
 */
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
