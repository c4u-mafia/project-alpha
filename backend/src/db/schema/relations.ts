import { relations } from 'drizzle-orm';

import { user, session, account } from './auth.table';
import { userProfile } from './user-profile.table';
import { tenantProfile } from './tenant.table';
import { landlordProfile } from './landlord.table';
import { kycDocument } from './kyc-document.table';
import { property, propertyPhoto } from './property.table';
import { viewingSlot, viewingRequest } from './viewing.table';
import { rentalApplication, leaseAgreement } from './application.table';
import { tenancy } from './tenancy.table';
import { payment, escrowHold, wallet, walletTransaction } from './payment.table';
import { rentGoal, sponsorshipContribution } from './sponsorship.table';
import { conversation, message } from './message.table';
import { notification } from './notification.table';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ one, many }) => ({
  accounts: many(account),
  sessions: many(session),
  profile: one(userProfile, {
    fields: [user.id],
    references: [userProfile.userId],
  }),
  tenantProfile: one(tenantProfile, {
    fields: [user.id],
    references: [tenantProfile.userId],
  }),
  landlordProfile: one(landlordProfile, {
    fields: [user.id],
    references: [landlordProfile.userId],
  }),
  kycDocuments: many(kycDocument, { relationName: 'kycDocument_subject' }),
  properties: many(property),
  wallet: one(wallet, {
    fields: [user.id],
    references: [wallet.userId],
  }),
  notifications: many(notification),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// ─── Profiles ────────────────────────────────────────────────────────────────

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, { fields: [userProfile.userId], references: [user.id] }),
}));

export const tenantProfileRelations = relations(tenantProfile, ({ one }) => ({
  user: one(user, { fields: [tenantProfile.userId], references: [user.id] }),
}));

export const landlordProfileRelations = relations(landlordProfile, ({ one }) => ({
  user: one(user, { fields: [landlordProfile.userId], references: [user.id] }),
}));

// ─── KYC ─────────────────────────────────────────────────────────────────────

export const kycDocumentRelations = relations(kycDocument, ({ one }) => ({
  // relationName disambiguates: kycDocument has two FKs pointing at user
  user: one(user, {
    fields: [kycDocument.userId],
    references: [user.id],
    relationName: 'kycDocument_subject',
  }),
  reviewer: one(user, {
    fields: [kycDocument.reviewedBy],
    references: [user.id],
    relationName: 'kycDocument_reviewer',
  }),
  property: one(property, {
    fields: [kycDocument.propertyId],
    references: [property.id],
  }),
}));

// ─── Property ────────────────────────────────────────────────────────────────

export const propertyRelations = relations(property, ({ one, many }) => ({
  landlord: one(user, { fields: [property.landlordId], references: [user.id] }),
  photos: many(propertyPhoto),
  viewingSlots: many(viewingSlot),
  viewingRequests: many(viewingRequest),
  applications: many(rentalApplication),
  tenancies: many(tenancy),
  conversations: many(conversation),
  kycDocuments: many(kycDocument),
  rentGoals: many(rentGoal),
}));

export const propertyPhotoRelations = relations(propertyPhoto, ({ one }) => ({
  property: one(property, { fields: [propertyPhoto.propertyId], references: [property.id] }),
}));

// ─── Viewings ────────────────────────────────────────────────────────────────

export const viewingSlotRelations = relations(viewingSlot, ({ one, many }) => ({
  property: one(property, { fields: [viewingSlot.propertyId], references: [property.id] }),
  landlord: one(user, { fields: [viewingSlot.landlordId], references: [user.id] }),
  requests: many(viewingRequest),
}));

export const viewingRequestRelations = relations(viewingRequest, ({ one }) => ({
  tenant: one(user, { fields: [viewingRequest.tenantId], references: [user.id] }),
  property: one(property, { fields: [viewingRequest.propertyId], references: [property.id] }),
  slot: one(viewingSlot, { fields: [viewingRequest.slotId], references: [viewingSlot.id] }),
}));

// ─── Applications & Lease ────────────────────────────────────────────────────

export const rentalApplicationRelations = relations(rentalApplication, ({ one }) => ({
  // Two FKs to user — disambiguate with relationName
  tenant: one(user, {
    fields: [rentalApplication.tenantId],
    references: [user.id],
    relationName: 'application_tenant',
  }),
  landlord: one(user, {
    fields: [rentalApplication.landlordId],
    references: [user.id],
    relationName: 'application_landlord',
  }),
  property: one(property, {
    fields: [rentalApplication.propertyId],
    references: [property.id],
  }),
  viewingRequest: one(viewingRequest, {
    fields: [rentalApplication.viewingRequestId],
    references: [viewingRequest.id],
  }),
  lease: one(leaseAgreement, {
    fields: [rentalApplication.id],
    references: [leaseAgreement.applicationId],
  }),
}));

export const leaseAgreementRelations = relations(leaseAgreement, ({ one }) => ({
  application: one(rentalApplication, {
    fields: [leaseAgreement.applicationId],
    references: [rentalApplication.id],
  }),
  tenant: one(user, {
    fields: [leaseAgreement.tenantId],
    references: [user.id],
    relationName: 'lease_tenant',
  }),
  landlord: one(user, {
    fields: [leaseAgreement.landlordId],
    references: [user.id],
    relationName: 'lease_landlord',
  }),
  property: one(property, {
    fields: [leaseAgreement.propertyId],
    references: [property.id],
  }),
  tenancy: one(tenancy, {
    fields: [leaseAgreement.id],
    references: [tenancy.leaseId],
  }),
}));

// ─── Tenancy ─────────────────────────────────────────────────────────────────

export const tenancyRelations = relations(tenancy, ({ one, many }) => ({
  lease: one(leaseAgreement, { fields: [tenancy.leaseId], references: [leaseAgreement.id] }),
  tenant: one(user, {
    fields: [tenancy.tenantId],
    references: [user.id],
    relationName: 'tenancy_tenant',
  }),
  landlord: one(user, {
    fields: [tenancy.landlordId],
    references: [user.id],
    relationName: 'tenancy_landlord',
  }),
  property: one(property, { fields: [tenancy.propertyId], references: [property.id] }),
  payments: many(payment),
  rentGoals: many(rentGoal),
}));

// ─── Payments ────────────────────────────────────────────────────────────────

export const paymentRelations = relations(payment, ({ one }) => ({
  payer: one(user, {
    fields: [payment.payerId],
    references: [user.id],
    relationName: 'payment_payer',
  }),
  payee: one(user, {
    fields: [payment.payeeId],
    references: [user.id],
    relationName: 'payment_payee',
  }),
  tenancy: one(tenancy, { fields: [payment.tenancyId], references: [tenancy.id] }),
  escrowHold: one(escrowHold, {
    fields: [payment.id],
    references: [escrowHold.paymentId],
  }),
}));

export const escrowHoldRelations = relations(escrowHold, ({ one }) => ({
  payment: one(payment, { fields: [escrowHold.paymentId], references: [payment.id] }),
}));

export const walletRelations = relations(wallet, ({ one, many }) => ({
  user: one(user, { fields: [wallet.userId], references: [user.id] }),
  transactions: many(walletTransaction),
}));

export const walletTransactionRelations = relations(walletTransaction, ({ one }) => ({
  wallet: one(wallet, { fields: [walletTransaction.walletId], references: [wallet.id] }),
  payment: one(payment, { fields: [walletTransaction.paymentId], references: [payment.id] }),
}));

// ─── Sponsorship ─────────────────────────────────────────────────────────────

export const rentGoalRelations = relations(rentGoal, ({ one, many }) => ({
  tenant: one(user, { fields: [rentGoal.tenantId], references: [user.id] }),
  tenancy: one(tenancy, { fields: [rentGoal.tenancyId], references: [tenancy.id] }),
  property: one(property, { fields: [rentGoal.propertyId], references: [property.id] }),
  contributions: many(sponsorshipContribution),
}));

export const sponsorshipContributionRelations = relations(sponsorshipContribution, ({ one }) => ({
  goal: one(rentGoal, {
    fields: [sponsorshipContribution.goalId],
    references: [rentGoal.id],
  }),
  sponsor: one(user, {
    fields: [sponsorshipContribution.sponsorId],
    references: [user.id],
  }),
  payment: one(payment, {
    fields: [sponsorshipContribution.paymentId],
    references: [payment.id],
  }),
}));

// ─── Messaging ───────────────────────────────────────────────────────────────

export const conversationRelations = relations(conversation, ({ one, many }) => ({
  property: one(property, { fields: [conversation.propertyId], references: [property.id] }),
  tenant: one(user, {
    fields: [conversation.tenantId],
    references: [user.id],
    relationName: 'conversation_tenant',
  }),
  landlord: one(user, {
    fields: [conversation.landlordId],
    references: [user.id],
    relationName: 'conversation_landlord',
  }),
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  sender: one(user, { fields: [message.senderId], references: [user.id] }),
}));

// ─── Notifications ───────────────────────────────────────────────────────────

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, { fields: [notification.userId], references: [user.id] }),
}));
