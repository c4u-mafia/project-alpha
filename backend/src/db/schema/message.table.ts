import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';
import { property } from './property.table';

export const conversationStatusEnum = pgEnum('conversation_status', [
  'active',
  'archived',
]);

export const conversation = pgTable(
  'conversation',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    landlordId: text('landlord_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // Updated on each new message for inbox ordering
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
    status: conversationStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // One conversation per tenant+property pair
    uniqueIndex('conversation_tenant_property_unique').on(table.tenantId, table.propertyId),
    index('conversation_tenant_id_idx').on(table.tenantId),
    index('conversation_landlord_id_idx').on(table.landlordId),
    index('conversation_last_message_at_idx').on(table.lastMessageAt),
  ],
);

export const message = pgTable(
  'message',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
    senderId: text('sender_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('message_conversation_id_idx').on(table.conversationId),
    index('message_created_at_idx').on(table.conversationId, table.createdAt),
  ],
);

export type Conversation = typeof conversation.$inferSelect;
export type NewConversation = typeof conversation.$inferInsert;
export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;
