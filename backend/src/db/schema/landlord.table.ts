import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';

export const landlordVerificationStatusEnum = pgEnum('landlord_verification_status', [
  'unverified',
  'documents_submitted',
  'under_review',
  'approved',
  'rejected',
]);

export const landlordProfile = pgTable(
  'landlord_profile',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    isCompany: boolean('is_company').notNull().default(false),
    companyName: text('company_name'),
    isDiaspora: boolean('is_diaspora').notNull().default(false),

    // Admin-managed verification
    verificationStatus: landlordVerificationStatusEnum('verification_status')
      .notNull()
      .default('unverified'),
    verificationNotes: text('verification_notes'), // internal admin notes

    // Bank account for rent payouts
    bankAccountName: text('bank_account_name'),
    bankAccountNumber: text('bank_account_number'),
    bankCode: text('bank_code'),
    bankName: text('bank_name'),

    // Onboarding step flags
    bankStepCompleted: boolean('bank_step_completed').notNull().default(false),
    onboardingCompleted: boolean('onboarding_completed').notNull().default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('landlord_profile_user_id_unique').on(table.userId),
    index('landlord_verification_status_idx').on(table.verificationStatus),
  ],
);

export type LandlordProfile = typeof landlordProfile.$inferSelect;
export type NewLandlordProfile = typeof landlordProfile.$inferInsert;
