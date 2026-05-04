import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';

export const monthlyIncomeRangeEnum = pgEnum('monthly_income_range', [
  'under_50k',
  '50k_100k',
  '100k_200k',
  '200k_500k',
  'above_500k',
]);

export const moveInTimelineEnum = pgEnum('move_in_timeline', [
  'immediately',
  'within_1_month',
  'within_3_months',
  'within_6_months',
  'flexible',
]);

export const tenantProfile = pgTable(
  'tenant_profile',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    // Employment info
    employerName: text('employer_name'),
    jobRole: text('job_role'),
    monthlyIncomeRange: monthlyIncomeRangeEnum('monthly_income_range'),

    // Guarantor
    guarantorName: text('guarantor_name'),
    guarantorPhone: text('guarantor_phone'),
    guarantorConfirmed: boolean('guarantor_confirmed').notNull().default(false),

    // Move-in preferences (kobo)
    preferredBudgetMin: integer('preferred_budget_min'),
    preferredBudgetMax: integer('preferred_budget_max'),
    preferredAreas: text('preferred_areas').array(),
    preferredBedrooms: integer('preferred_bedrooms').array(),
    moveInTimeline: moveInTimelineEnum('move_in_timeline'),

    // Onboarding step flags
    employmentStepCompleted: boolean('employment_step_completed').notNull().default(false),
    preferencesStepCompleted: boolean('preferences_step_completed').notNull().default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('tenant_profile_user_id_unique').on(table.userId),
    index('tenant_profile_budget_idx').on(table.preferredBudgetMin, table.preferredBudgetMax),
  ],
);

export type TenantProfile = typeof tenantProfile.$inferSelect;
export type NewTenantProfile = typeof tenantProfile.$inferInsert;
