import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';
import { property, paymentFrequencyEnum } from './property.table';
import { viewingRequest } from './viewing.table';

export const applicationStatusEnum = pgEnum('application_status', [
  'submitted',
  'under_review',
  'approved',
  'declined',
  'withdrawn',
]);

export const leaseStatusEnum = pgEnum('lease_status', [
  'draft',
  'pending_signatures',
  'active',
  'expired',
  'terminated',
]);

export const rentalApplication = pgTable(
  'rental_application',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    landlordId: text('landlord_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    viewingRequestId: text('viewing_request_id').references(() => viewingRequest.id, {
      onDelete: 'set null',
    }),
    status: applicationStatusEnum('status').notNull().default('submitted'),
    moveInDate: date('move_in_date').notNull(),
    employmentProofUrl: text('employment_proof_url'),
    personalMessage: text('personal_message'),
    landlordNote: text('landlord_note'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('rental_application_tenant_id_idx').on(table.tenantId),
    index('rental_application_landlord_id_idx').on(table.landlordId),
    index('rental_application_property_id_idx').on(table.propertyId),
    index('rental_application_status_idx').on(table.status),
  ],
);

export const leaseAgreement = pgTable(
  'lease_agreement',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    applicationId: text('application_id')
      .notNull()
      .references(() => rentalApplication.id, { onDelete: 'cascade' }),
    tenantId: text('tenant_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    landlordId: text('landlord_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    annualRent: integer('annual_rent').notNull(), // kobo
    paymentFrequency: paymentFrequencyEnum('payment_frequency').notNull(),
    leaseTerms: text('lease_terms').notNull().default(''),
    tenantSignedAt: timestamp('tenant_signed_at', { withTimezone: true }),
    landlordSignedAt: timestamp('landlord_signed_at', { withTimezone: true }),
    status: leaseStatusEnum('status').notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('lease_agreement_application_id_unique').on(table.applicationId),
    index('lease_agreement_tenant_id_idx').on(table.tenantId),
    index('lease_agreement_property_id_idx').on(table.propertyId),
    index('lease_agreement_status_idx').on(table.status),
  ],
);

export type RentalApplication = typeof rentalApplication.$inferSelect;
export type NewRentalApplication = typeof rentalApplication.$inferInsert;
export type LeaseAgreement = typeof leaseAgreement.$inferSelect;
export type NewLeaseAgreement = typeof leaseAgreement.$inferInsert;
