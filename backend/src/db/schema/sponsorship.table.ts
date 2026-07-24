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
import { property } from './property.table';
import { tenancy } from './tenancy.table';
import { payment } from './payment.table';

export const rentGoalStatusEnum = pgEnum('rent_goal_status', [
  'active',
  'completed',
  'expired',
  'cancelled',
]);

export const rentGoal = pgTable(
  'rent_goal',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // If tenant is already in a tenancy, link to it
    tenancyId: text('tenancy_id').references(() => tenancy.id, {
      onDelete: 'set null',
    }),
    // If goal is for a specific listing they haven't moved into yet
    propertyId: text('property_id').references(() => property.id, {
      onDelete: 'set null',
    }),
    targetAmount: integer('target_amount').notNull(), // kobo
    currentAmount: integer('current_amount').notNull().default(0), // kobo — auto-updated
    deadline: timestamp('deadline', { withTimezone: true }).notNull(),
    message: text('message'), // shown on the public goal page
    shareToken: text('share_token').notNull(), // random token in the shareable link
    status: rentGoalStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('rent_goal_tenant_id_idx').on(table.tenantId),
    uniqueIndex('rent_goal_share_token_unique').on(table.shareToken),
    index('rent_goal_status_idx').on(table.status),
  ],
);

export const sponsorshipContribution = pgTable(
  'sponsorship_contribution',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    goalId: text('goal_id')
      .notNull()
      .references(() => rentGoal.id, { onDelete: 'cascade' }),
    // Null for guest sponsors (no Homelyn account required)
    sponsorId: text('sponsor_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    sponsorName: text('sponsor_name'), // required for guest sponsors
    sponsorEmail: text('sponsor_email'), // required for guest sponsors
    amount: integer('amount').notNull(), // kobo
    isAnonymous: boolean('is_anonymous').notNull().default(false),
    paymentId: text('payment_id')
      .notNull()
      .references(() => payment.id, { onDelete: 'cascade' }),
    message: text('message'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('sponsorship_contribution_goal_id_idx').on(table.goalId),
    index('sponsorship_contribution_sponsor_id_idx').on(table.sponsorId),
    uniqueIndex('sponsorship_contribution_payment_id_unique').on(
      table.paymentId,
    ),
  ],
);

export type RentGoal = typeof rentGoal.$inferSelect;
export type NewRentGoal = typeof rentGoal.$inferInsert;
export type SponsorshipContribution =
  typeof sponsorshipContribution.$inferSelect;
export type NewSponsorshipContribution =
  typeof sponsorshipContribution.$inferInsert;
