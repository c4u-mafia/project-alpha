import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';

export const propertyTypeEnum = pgEnum('property_type', [
  'apartment',
  'duplex',
  'bungalow',
  'self_contained',
  'mini_flat',
  'room',
  'studio',
  'compound',
]);

export const propertyStatusEnum = pgEnum('property_status', [
  'draft',
  'submitted_for_review',
  'verified',
  'listed',
  'occupied',
  'paused',
  'rejected',
]);

// Shared enum also used by lease_agreement
export const paymentFrequencyEnum = pgEnum('payment_frequency', [
  'yearly',
  'biannual',
  'quarterly',
  'monthly',
]);

export const propertyPhotoTypeEnum = pgEnum('property_photo_type', [
  'living_room',
  'kitchen',
  'bedroom',
  'bathroom',
  'exterior',
  'surroundings',
  'other',
]);

export const property = pgTable(
  'property',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    landlordId: text('landlord_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    title: text('title').notNull(),
    type: propertyTypeEnum('type').notNull(),
    bedrooms: integer('bedrooms').notNull(),
    bathrooms: integer('bathrooms').notNull(),
    toilets: integer('toilets').notNull(),
    squareFootage: integer('square_footage'),
    yearBuilt: integer('year_built'),
    description: text('description').notNull().default(''),

    // Pricing (all in kobo — ₦1 = 100 kobo)
    annualRent: integer('annual_rent').notNull(),
    serviceCharge: integer('service_charge').notNull().default(0),
    cautionDeposit: integer('caution_deposit').notNull().default(0),
    agencyFee: integer('agency_fee').notNull().default(0),
    acceptedPaymentFrequencies: paymentFrequencyEnum('accepted_payment_frequencies').array(),

    // Amenities as a flat array e.g. ['parking', 'generator', 'security']
    amenities: text('amenities').array().notNull().default([]),

    // Location — area is public; address is private until viewing confirmed
    state: text('state').notNull(),
    city: text('city').notNull(),
    area: text('area').notNull(),
    address: text('address').notNull(),
    // precision 10 scale 7: handles lat (-90 to 90) and lon (-180 to 180)
    latitude: numeric('latitude', { precision: 10, scale: 7 }),
    longitude: numeric('longitude', { precision: 10, scale: 7 }),

    // Lifecycle
    status: propertyStatusEnum('status').notNull().default('draft'),
    rejectionReason: text('rejection_reason'),
    isBoosted: boolean('is_boosted').notNull().default(false),
    boostExpiresAt: timestamp('boost_expires_at', { withTimezone: true }),
    publishedAt: timestamp('published_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('property_landlord_id_idx').on(table.landlordId),
    index('property_status_idx').on(table.status),
    index('property_city_idx').on(table.city),
    index('property_area_idx').on(table.area),
    index('property_bedrooms_idx').on(table.bedrooms),
    index('property_annual_rent_idx').on(table.annualRent),
  ],
);

export const propertyPhoto = pgTable(
  'property_photo',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    propertyId: text('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    caption: text('caption'),
    displayOrder: integer('display_order').notNull().default(0),
    photoType: propertyPhotoTypeEnum('photo_type').notNull().default('other'),
    isVideoTour: boolean('is_video_tour').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('property_photo_property_id_idx').on(table.propertyId),
    index('property_photo_order_idx').on(table.propertyId, table.displayOrder),
  ],
);

export type Property = typeof property.$inferSelect;
export type NewProperty = typeof property.$inferInsert;
export type PropertyPhoto = typeof propertyPhoto.$inferSelect;
export type NewPropertyPhoto = typeof propertyPhoto.$inferInsert;
