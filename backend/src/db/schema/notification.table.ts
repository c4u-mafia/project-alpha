import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';

export const notificationTypeEnum = pgEnum('notification_type', [
  // Viewings
  'viewing_confirmed',
  'viewing_cancelled',
  // Rent health reminders
  'rent_due_90d',
  'rent_due_30d',
  'rent_due_14d',
  'rent_due_7d',
  'rent_due_1d',
  'rent_overdue',
  // Payments
  'payment_received',
  'payment_failed',
  'withdrawal_processed',
  // Applications
  'application_submitted',
  'application_approved',
  'application_declined',
  // KYC / verification
  'kyc_approved',
  'kyc_rejected',
  // Lease
  'lease_ready_to_sign',
  'lease_signed',
  // Tenancy
  'tenancy_created',
  // Listings
  'listing_approved',
  'listing_rejected',
  // Sponsorship
  'sponsorship_received',
  // Messaging
  'message_received',
]);

export const notification = pgTable(
  'notification',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    // Deep link params, relevant entity IDs for navigation
    data: jsonb('data'),
    readAt: timestamp('read_at', { withTimezone: true }),
    // When the push/SMS was actually dispatched
    sentAt: timestamp('sent_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('notification_user_id_idx').on(table.userId),
    // Unread query: WHERE read_at IS NULL
    index('notification_unread_idx').on(table.userId, table.readAt),
    index('notification_created_at_idx').on(table.createdAt),
  ],
);

export type Notification = typeof notification.$inferSelect;
export type NewNotification = typeof notification.$inferInsert;
