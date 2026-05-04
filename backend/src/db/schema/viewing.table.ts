import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';
import { property } from './property.table';

export const viewingSlotStatusEnum = pgEnum('viewing_slot_status', [
  'available',
  'fully_booked',
  'cancelled',
]);

export const viewingRequestStatusEnum = pgEnum('viewing_request_status', [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show',
]);

export const viewingSlot = pgTable(
  'viewing_slot',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    landlordId: text('landlord_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    maxAttendees: integer('max_attendees').notNull().default(1),
    currentAttendees: integer('current_attendees').notNull().default(0),
    status: viewingSlotStatusEnum('status').notNull().default('available'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('viewing_slot_property_id_idx').on(table.propertyId),
    index('viewing_slot_date_idx').on(table.date),
    index('viewing_slot_status_idx').on(table.status),
  ],
);

export const viewingRequest = pgTable(
  'viewing_request',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    slotId: text('slot_id')
      .notNull()
      .references(() => viewingSlot.id, { onDelete: 'cascade' }),
    status: viewingRequestStatusEnum('status').notNull().default('pending'),
    tenantMessage: text('tenant_message'),

    // Address only exposed after landlord confirms
    addressRevealed: boolean('address_revealed').notNull().default(false),

    // Post-viewing ratings (1–5)
    landlordRating: integer('landlord_rating'),  // tenant rates landlord
    tenantRating: integer('tenant_rating'),       // landlord rates tenant
    landlordRatingNote: text('landlord_rating_note'),
    tenantRatingNote: text('tenant_rating_note'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // One booking per tenant per slot
    uniqueIndex('viewing_request_tenant_slot_unique').on(table.tenantId, table.slotId),
    index('viewing_request_tenant_id_idx').on(table.tenantId),
    index('viewing_request_property_id_idx').on(table.propertyId),
    index('viewing_request_status_idx').on(table.status),
  ],
);

export type ViewingSlot = typeof viewingSlot.$inferSelect;
export type NewViewingSlot = typeof viewingSlot.$inferInsert;
export type ViewingRequest = typeof viewingRequest.$inferSelect;
export type NewViewingRequest = typeof viewingRequest.$inferInsert;
