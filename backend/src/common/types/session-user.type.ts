import type { AppRole } from '../../db/schema';

/**
 * Shape of the user object attached to request.user by AuthGuard.
 * Mirrors better-auth's session user, extended with our role field.
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null | undefined;
  role: AppRole | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}
