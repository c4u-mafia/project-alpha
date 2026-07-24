import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from './auth.table';
import { tenancy } from './tenancy.table';

export const paymentTypeEnum = pgEnum('payment_type', [
  'rent_payment',
  'wallet_funding',
  'withdrawal',
  'sponsorship_contribution',
  'verification_fee',
  'listing_boost',
  'refund',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
]);

export const paymentProviderEnum = pgEnum('payment_provider', [
  'paystack',
  'flutterwave',
  'wallet',
  'bank_transfer',
]);

export const escrowStatusEnum = pgEnum('escrow_status', [
  'held',
  'released',
  'refunded',
]);

export const walletTransactionTypeEnum = pgEnum('wallet_transaction_type', [
  'credit',
  'debit',
]);

export const payment = pgTable(
  'payment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Nullable for guest sponsorship payments.
    payerId: text('payer_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    // Null when the money is a fee going to Homelyn (not to another user)
    payeeId: text('payee_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    amount: integer('amount').notNull(), // kobo
    currency: text('currency').notNull().default('NGN'),
    type: paymentTypeEnum('type').notNull(),
    status: paymentStatusEnum('status').notNull().default('pending'),
    provider: paymentProviderEnum('provider').notNull(),
    providerReference: text('provider_reference'),
    providerResponse: jsonb('provider_response'), // raw webhook/callback payload
    metadata: jsonb('metadata'), // flexible extra data (e.g. boostDuration)
    tenancyId: text('tenancy_id').references(() => tenancy.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('payment_payer_id_idx').on(table.payerId),
    index('payment_payee_id_idx').on(table.payeeId),
    index('payment_status_idx').on(table.status),
    index('payment_type_idx').on(table.type),
    // For webhook lookup by provider reference
    index('payment_provider_reference_idx').on(table.providerReference),
  ],
);

export const escrowHold = pgTable(
  'escrow_hold',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    paymentId: text('payment_id')
      .notNull()
      .references(() => payment.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(), // kobo
    status: escrowStatusEnum('status').notNull().default('held'),
    // Cron job releases funds to landlord wallet after this timestamp
    releaseScheduledAt: timestamp('release_scheduled_at', {
      withTimezone: true,
    }).notNull(),
    releasedAt: timestamp('released_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('escrow_hold_payment_id_unique').on(table.paymentId),
    index('escrow_hold_status_idx').on(table.status),
    index('escrow_hold_release_scheduled_at_idx').on(table.releaseScheduledAt),
  ],
);

export const wallet = pgTable(
  'wallet',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    balance: integer('balance').notNull().default(0), // kobo — available
    pendingBalance: integer('pending_balance').notNull().default(0), // kobo — in escrow
    currency: text('currency').notNull().default('NGN'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex('wallet_user_id_unique').on(table.userId)],
);

export const walletTransaction = pgTable(
  'wallet_transaction',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    walletId: text('wallet_id')
      .notNull()
      .references(() => wallet.id, { onDelete: 'cascade' }),
    paymentId: text('payment_id').references(() => payment.id, {
      onDelete: 'set null',
    }),
    type: walletTransactionTypeEnum('type').notNull(),
    amount: integer('amount').notNull(), // kobo
    balanceAfter: integer('balance_after').notNull(), // kobo snapshot after this tx
    description: text('description').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('wallet_transaction_wallet_id_idx').on(table.walletId),
    index('wallet_transaction_created_at_idx').on(table.createdAt),
    uniqueIndex('wallet_transaction_payment_id_unique').on(table.paymentId),
  ],
);

export type Payment = typeof payment.$inferSelect;
export type NewPayment = typeof payment.$inferInsert;
export type EscrowHold = typeof escrowHold.$inferSelect;
export type Wallet = typeof wallet.$inferSelect;
export type WalletTransaction = typeof walletTransaction.$inferSelect;
