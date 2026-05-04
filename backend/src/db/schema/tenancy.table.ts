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
import { property } from './property.table';
import { leaseAgreement } from './application.table';

export const tenancyStatusEnum = pgEnum('tenancy_status', [
  'active',
  'expired',
  'terminated',
  'renewed',
]);

export const tenancy = pgTable(
  'tenancy',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    leaseId: text('lease_id')
      .notNull()
      .references(() => leaseAgreement.id, { onDelete: 'cascade' }),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    landlordId: text('landlord_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),

    // Overall tenancy window
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),

    // Current billing period (updates on each renewal)
    currentPeriodStart: date('current_period_start').notNull(),
    currentPeriodEnd: date('current_period_end').notNull(),

    status: tenancyStatusEnum('status').notNull().default('active'),
    autoRenew: boolean('auto_renew').notNull().default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('tenancy_lease_id_unique').on(table.leaseId),
    index('tenancy_tenant_id_idx').on(table.tenantId),
    index('tenancy_landlord_id_idx').on(table.landlordId),
    index('tenancy_property_id_idx').on(table.propertyId),
    index('tenancy_status_idx').on(table.status),
    // Queried often to find expiring tenancies
    index('tenancy_end_date_idx').on(table.endDate),
  ],
);

export type Tenancy = typeof tenancy.$inferSelect;
export type NewTenancy = typeof tenancy.$inferInsert;
