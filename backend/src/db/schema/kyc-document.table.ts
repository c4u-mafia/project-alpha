import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';
import { property } from './property.table';

export const kycDocumentTypeEnum = pgEnum('kyc_document_type', [
  'nin',
  'bvn',
  'certificate_of_occupancy',
  'deed_of_assignment',
  'utility_bill',
  'employment_letter',
  'guarantor_letter',
  'government_id',
  'passport',
]);

export const kycDocumentStatusEnum = pgEnum('kyc_document_status', [
  'submitted',
  'under_review',
  'approved',
  'rejected',
]);

export const kycDocument = pgTable(
  'kyc_document',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    documentType: kycDocumentTypeEnum('document_type').notNull(),
    documentUrl: text('document_url').notNull(), // S3/Cloudinary URL
    status: kycDocumentStatusEnum('status').notNull().default('submitted'),
    rejectionReason: text('rejection_reason'),

    // Admin who reviewed this document
    reviewedBy: text('reviewed_by').references(() => user.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),

    // For property-linked documents (C of O, deed) — nullable for personal docs (NIN, BVN)
    propertyId: text('property_id').references(() => property.id, { onDelete: 'set null' }),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('kyc_document_user_id_idx').on(table.userId),
    index('kyc_document_status_idx').on(table.status),
    index('kyc_document_type_idx').on(table.documentType),
    index('kyc_document_property_id_idx').on(table.propertyId),
  ],
);

export type KycDocument = typeof kycDocument.$inferSelect;
export type NewKycDocument = typeof kycDocument.$inferInsert;
