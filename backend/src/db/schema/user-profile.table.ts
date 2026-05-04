import {
  boolean,
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';

export const ninStatusEnum = pgEnum('nin_status', [
  'not_submitted',
  'pending',
  'verified',
  'failed',
]);

export const genderEnum = pgEnum('gender', [
  'male',
  'female',
  'other',
  'prefer_not_to_say',
]);

export const userProfile = pgTable(
  'user_profile',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    phone: text('phone'),
    phoneVerified: boolean('phone_verified').notNull().default(false),
    dateOfBirth: date('date_of_birth'),
    gender: genderEnum('gender'),
    city: text('city'),
    ninStatus: ninStatusEnum('nin_status').notNull().default('not_submitted'),
    // Store encrypted in production — never return raw value in API responses
    ninNumber: text('nin_number'),
    onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('user_profile_user_id_unique').on(table.userId),
    uniqueIndex('user_profile_phone_unique').on(table.phone),
    index('user_profile_nin_status_idx').on(table.ninStatus),
  ],
);

export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
