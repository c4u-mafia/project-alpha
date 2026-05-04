CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other', 'prefer_not_to_say');--> statement-breakpoint
CREATE TYPE "public"."nin_status" AS ENUM('not_submitted', 'pending', 'verified', 'failed');--> statement-breakpoint
CREATE TYPE "public"."monthly_income_range" AS ENUM('under_50k', '50k_100k', '100k_200k', '200k_500k', 'above_500k');--> statement-breakpoint
CREATE TYPE "public"."move_in_timeline" AS ENUM('immediately', 'within_1_month', 'within_3_months', 'within_6_months', 'flexible');--> statement-breakpoint
CREATE TYPE "public"."landlord_verification_status" AS ENUM('unverified', 'documents_submitted', 'under_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_frequency" AS ENUM('yearly', 'biannual', 'quarterly', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."property_photo_type" AS ENUM('living_room', 'kitchen', 'bedroom', 'bathroom', 'exterior', 'surroundings', 'other');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('draft', 'submitted_for_review', 'verified', 'listed', 'occupied', 'paused', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('apartment', 'duplex', 'bungalow', 'self_contained', 'mini_flat', 'room', 'studio', 'compound');--> statement-breakpoint
CREATE TYPE "public"."kyc_document_status" AS ENUM('submitted', 'under_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."kyc_document_type" AS ENUM('nin', 'bvn', 'certificate_of_occupancy', 'deed_of_assignment', 'utility_bill', 'employment_letter', 'guarantor_letter', 'government_id', 'passport');--> statement-breakpoint
CREATE TYPE "public"."viewing_request_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."viewing_slot_status" AS ENUM('available', 'fully_booked', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('submitted', 'under_review', 'approved', 'declined', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."lease_status" AS ENUM('draft', 'pending_signatures', 'active', 'expired', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."tenancy_status" AS ENUM('active', 'expired', 'terminated', 'renewed');--> statement-breakpoint
CREATE TYPE "public"."escrow_status" AS ENUM('held', 'released', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('paystack', 'flutterwave', 'wallet', 'bank_transfer');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('rent_payment', 'wallet_funding', 'withdrawal', 'sponsorship_contribution', 'verification_fee', 'listing_boost', 'refund');--> statement-breakpoint
CREATE TYPE "public"."wallet_transaction_type" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "public"."rent_goal_status" AS ENUM('active', 'completed', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."conversation_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('viewing_confirmed', 'viewing_cancelled', 'rent_due_90d', 'rent_due_30d', 'rent_due_14d', 'rent_due_7d', 'rent_due_1d', 'rent_overdue', 'payment_received', 'payment_failed', 'withdrawal_processed', 'application_submitted', 'application_approved', 'application_declined', 'kyc_approved', 'kyc_rejected', 'lease_ready_to_sign', 'lease_signed', 'tenancy_created', 'listing_approved', 'listing_rejected', 'sponsorship_received', 'message_received');--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"phone" text,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"date_of_birth" date,
	"gender" "gender",
	"city" text,
	"nin_status" "nin_status" DEFAULT 'not_submitted' NOT NULL,
	"nin_number" text,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"employer_name" text,
	"job_role" text,
	"monthly_income_range" "monthly_income_range",
	"guarantor_name" text,
	"guarantor_phone" text,
	"guarantor_confirmed" boolean DEFAULT false NOT NULL,
	"preferred_budget_min" integer,
	"preferred_budget_max" integer,
	"preferred_areas" text[],
	"preferred_bedrooms" integer[],
	"move_in_timeline" "move_in_timeline",
	"employment_step_completed" boolean DEFAULT false NOT NULL,
	"preferences_step_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landlord_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"is_company" boolean DEFAULT false NOT NULL,
	"company_name" text,
	"is_diaspora" boolean DEFAULT false NOT NULL,
	"verification_status" "landlord_verification_status" DEFAULT 'unverified' NOT NULL,
	"verification_notes" text,
	"bank_account_name" text,
	"bank_account_number" text,
	"bank_code" text,
	"bank_name" text,
	"bank_step_completed" boolean DEFAULT false NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property" (
	"id" text PRIMARY KEY NOT NULL,
	"landlord_id" text NOT NULL,
	"title" text NOT NULL,
	"type" "property_type" NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"toilets" integer NOT NULL,
	"square_footage" integer,
	"year_built" integer,
	"description" text DEFAULT '' NOT NULL,
	"annual_rent" integer NOT NULL,
	"service_charge" integer DEFAULT 0 NOT NULL,
	"caution_deposit" integer DEFAULT 0 NOT NULL,
	"agency_fee" integer DEFAULT 0 NOT NULL,
	"accepted_payment_frequencies" "payment_frequency"[],
	"amenities" text[] DEFAULT '{}' NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"area" text NOT NULL,
	"address" text NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"status" "property_status" DEFAULT 'draft' NOT NULL,
	"rejection_reason" text,
	"is_boosted" boolean DEFAULT false NOT NULL,
	"boost_expires_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_photo" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"photo_type" "property_photo_type" DEFAULT 'other' NOT NULL,
	"is_video_tour" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kyc_document" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"document_type" "kyc_document_type" NOT NULL,
	"document_url" text NOT NULL,
	"status" "kyc_document_status" DEFAULT 'submitted' NOT NULL,
	"rejection_reason" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"property_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "viewing_request" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"property_id" text NOT NULL,
	"slot_id" text NOT NULL,
	"status" "viewing_request_status" DEFAULT 'pending' NOT NULL,
	"tenant_message" text,
	"address_revealed" boolean DEFAULT false NOT NULL,
	"landlord_rating" integer,
	"tenant_rating" integer,
	"landlord_rating_note" text,
	"tenant_rating_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "viewing_slot" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"landlord_id" text NOT NULL,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"max_attendees" integer DEFAULT 1 NOT NULL,
	"current_attendees" integer DEFAULT 0 NOT NULL,
	"status" "viewing_slot_status" DEFAULT 'available' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lease_agreement" (
	"id" text PRIMARY KEY NOT NULL,
	"application_id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"landlord_id" text NOT NULL,
	"property_id" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"annual_rent" integer NOT NULL,
	"payment_frequency" "payment_frequency" NOT NULL,
	"lease_terms" text DEFAULT '' NOT NULL,
	"tenant_signed_at" timestamp with time zone,
	"landlord_signed_at" timestamp with time zone,
	"status" "lease_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental_application" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"landlord_id" text NOT NULL,
	"property_id" text NOT NULL,
	"viewing_request_id" text,
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"move_in_date" date NOT NULL,
	"employment_proof_url" text,
	"personal_message" text,
	"landlord_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenancy" (
	"id" text PRIMARY KEY NOT NULL,
	"lease_id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"landlord_id" text NOT NULL,
	"property_id" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"current_period_start" date NOT NULL,
	"current_period_end" date NOT NULL,
	"status" "tenancy_status" DEFAULT 'active' NOT NULL,
	"auto_renew" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escrow_hold" (
	"id" text PRIMARY KEY NOT NULL,
	"payment_id" text NOT NULL,
	"amount" integer NOT NULL,
	"status" "escrow_status" DEFAULT 'held' NOT NULL,
	"release_scheduled_at" timestamp with time zone NOT NULL,
	"released_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"payer_id" text NOT NULL,
	"payee_id" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"type" "payment_type" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"provider_reference" text,
	"provider_response" jsonb,
	"metadata" jsonb,
	"tenancy_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"pending_balance" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_id" text NOT NULL,
	"payment_id" text,
	"type" "wallet_transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rent_goal" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"tenancy_id" text,
	"property_id" text,
	"target_amount" integer NOT NULL,
	"current_amount" integer DEFAULT 0 NOT NULL,
	"deadline" timestamp with time zone NOT NULL,
	"message" text,
	"share_token" text NOT NULL,
	"status" "rent_goal_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsorship_contribution" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"sponsor_id" text,
	"sponsor_name" text,
	"sponsor_email" text,
	"amount" integer NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"payment_id" text NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"landlord_id" text NOT NULL,
	"last_message_at" timestamp with time zone,
	"status" "conversation_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"data" jsonb,
	"read_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_profile" ADD CONSTRAINT "tenant_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landlord_profile" ADD CONSTRAINT "landlord_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_landlord_id_user_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_photo" ADD CONSTRAINT "property_photo_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_document" ADD CONSTRAINT "kyc_document_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_document" ADD CONSTRAINT "kyc_document_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_document" ADD CONSTRAINT "kyc_document_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viewing_request" ADD CONSTRAINT "viewing_request_tenant_id_user_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viewing_request" ADD CONSTRAINT "viewing_request_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viewing_request" ADD CONSTRAINT "viewing_request_slot_id_viewing_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."viewing_slot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viewing_slot" ADD CONSTRAINT "viewing_slot_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viewing_slot" ADD CONSTRAINT "viewing_slot_landlord_id_user_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lease_agreement" ADD CONSTRAINT "lease_agreement_application_id_rental_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."rental_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lease_agreement" ADD CONSTRAINT "lease_agreement_tenant_id_user_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lease_agreement" ADD CONSTRAINT "lease_agreement_landlord_id_user_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lease_agreement" ADD CONSTRAINT "lease_agreement_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_application" ADD CONSTRAINT "rental_application_tenant_id_user_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_application" ADD CONSTRAINT "rental_application_landlord_id_user_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_application" ADD CONSTRAINT "rental_application_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_application" ADD CONSTRAINT "rental_application_viewing_request_id_viewing_request_id_fk" FOREIGN KEY ("viewing_request_id") REFERENCES "public"."viewing_request"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenancy" ADD CONSTRAINT "tenancy_lease_id_lease_agreement_id_fk" FOREIGN KEY ("lease_id") REFERENCES "public"."lease_agreement"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenancy" ADD CONSTRAINT "tenancy_tenant_id_user_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenancy" ADD CONSTRAINT "tenancy_landlord_id_user_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenancy" ADD CONSTRAINT "tenancy_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_hold" ADD CONSTRAINT "escrow_hold_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_payer_id_user_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_payee_id_user_id_fk" FOREIGN KEY ("payee_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_tenancy_id_tenancy_id_fk" FOREIGN KEY ("tenancy_id") REFERENCES "public"."tenancy"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_goal" ADD CONSTRAINT "rent_goal_tenant_id_user_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_goal" ADD CONSTRAINT "rent_goal_tenancy_id_tenancy_id_fk" FOREIGN KEY ("tenancy_id") REFERENCES "public"."tenancy"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_goal" ADD CONSTRAINT "rent_goal_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_contribution" ADD CONSTRAINT "sponsorship_contribution_goal_id_rent_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."rent_goal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_contribution" ADD CONSTRAINT "sponsorship_contribution_sponsor_id_user_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_contribution" ADD CONSTRAINT "sponsorship_contribution_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_tenant_id_user_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_landlord_id_user_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_profile_user_id_unique" ON "user_profile" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_profile_phone_unique" ON "user_profile" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "user_profile_nin_status_idx" ON "user_profile" USING btree ("nin_status");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_profile_user_id_unique" ON "tenant_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tenant_profile_budget_idx" ON "tenant_profile" USING btree ("preferred_budget_min","preferred_budget_max");--> statement-breakpoint
CREATE UNIQUE INDEX "landlord_profile_user_id_unique" ON "landlord_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "landlord_verification_status_idx" ON "landlord_profile" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "property_landlord_id_idx" ON "property" USING btree ("landlord_id");--> statement-breakpoint
CREATE INDEX "property_status_idx" ON "property" USING btree ("status");--> statement-breakpoint
CREATE INDEX "property_city_idx" ON "property" USING btree ("city");--> statement-breakpoint
CREATE INDEX "property_area_idx" ON "property" USING btree ("area");--> statement-breakpoint
CREATE INDEX "property_bedrooms_idx" ON "property" USING btree ("bedrooms");--> statement-breakpoint
CREATE INDEX "property_annual_rent_idx" ON "property" USING btree ("annual_rent");--> statement-breakpoint
CREATE INDEX "property_photo_property_id_idx" ON "property_photo" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_photo_order_idx" ON "property_photo" USING btree ("property_id","display_order");--> statement-breakpoint
CREATE INDEX "kyc_document_user_id_idx" ON "kyc_document" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "kyc_document_status_idx" ON "kyc_document" USING btree ("status");--> statement-breakpoint
CREATE INDEX "kyc_document_type_idx" ON "kyc_document" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "kyc_document_property_id_idx" ON "kyc_document" USING btree ("property_id");--> statement-breakpoint
CREATE UNIQUE INDEX "viewing_request_tenant_slot_unique" ON "viewing_request" USING btree ("tenant_id","slot_id");--> statement-breakpoint
CREATE INDEX "viewing_request_tenant_id_idx" ON "viewing_request" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "viewing_request_property_id_idx" ON "viewing_request" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "viewing_request_status_idx" ON "viewing_request" USING btree ("status");--> statement-breakpoint
CREATE INDEX "viewing_slot_property_id_idx" ON "viewing_slot" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "viewing_slot_date_idx" ON "viewing_slot" USING btree ("date");--> statement-breakpoint
CREATE INDEX "viewing_slot_status_idx" ON "viewing_slot" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "lease_agreement_application_id_unique" ON "lease_agreement" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "lease_agreement_tenant_id_idx" ON "lease_agreement" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "lease_agreement_property_id_idx" ON "lease_agreement" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "lease_agreement_status_idx" ON "lease_agreement" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rental_application_tenant_id_idx" ON "rental_application" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "rental_application_landlord_id_idx" ON "rental_application" USING btree ("landlord_id");--> statement-breakpoint
CREATE INDEX "rental_application_property_id_idx" ON "rental_application" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "rental_application_status_idx" ON "rental_application" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "tenancy_lease_id_unique" ON "tenancy" USING btree ("lease_id");--> statement-breakpoint
CREATE INDEX "tenancy_tenant_id_idx" ON "tenancy" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenancy_landlord_id_idx" ON "tenancy" USING btree ("landlord_id");--> statement-breakpoint
CREATE INDEX "tenancy_property_id_idx" ON "tenancy" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "tenancy_status_idx" ON "tenancy" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tenancy_end_date_idx" ON "tenancy" USING btree ("end_date");--> statement-breakpoint
CREATE UNIQUE INDEX "escrow_hold_payment_id_unique" ON "escrow_hold" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "escrow_hold_status_idx" ON "escrow_hold" USING btree ("status");--> statement-breakpoint
CREATE INDEX "escrow_hold_release_scheduled_at_idx" ON "escrow_hold" USING btree ("release_scheduled_at");--> statement-breakpoint
CREATE INDEX "payment_payer_id_idx" ON "payment" USING btree ("payer_id");--> statement-breakpoint
CREATE INDEX "payment_payee_id_idx" ON "payment" USING btree ("payee_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_type_idx" ON "payment" USING btree ("type");--> statement-breakpoint
CREATE INDEX "payment_provider_reference_idx" ON "payment" USING btree ("provider_reference");--> statement-breakpoint
CREATE UNIQUE INDEX "wallet_user_id_unique" ON "wallet" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wallet_transaction_wallet_id_idx" ON "wallet_transaction" USING btree ("wallet_id");--> statement-breakpoint
CREATE INDEX "wallet_transaction_created_at_idx" ON "wallet_transaction" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "rent_goal_tenant_id_idx" ON "rent_goal" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rent_goal_share_token_unique" ON "rent_goal" USING btree ("share_token");--> statement-breakpoint
CREATE INDEX "rent_goal_status_idx" ON "rent_goal" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sponsorship_contribution_goal_id_idx" ON "sponsorship_contribution" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "sponsorship_contribution_sponsor_id_idx" ON "sponsorship_contribution" USING btree ("sponsor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_tenant_property_unique" ON "conversation" USING btree ("tenant_id","property_id");--> statement-breakpoint
CREATE INDEX "conversation_tenant_id_idx" ON "conversation" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "conversation_landlord_id_idx" ON "conversation" USING btree ("landlord_id");--> statement-breakpoint
CREATE INDEX "conversation_last_message_at_idx" ON "conversation" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "message_conversation_id_idx" ON "message" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_created_at_idx" ON "message" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_unread_idx" ON "notification" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "notification" USING btree ("created_at");