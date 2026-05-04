import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route or controller as publicly accessible — skips AuthGuard.
 * Use on routes like feed browsing, public sponsorship goal pages, webhooks.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
