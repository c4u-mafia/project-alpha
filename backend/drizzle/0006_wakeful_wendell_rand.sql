CREATE TYPE "public"."account_status" AS ENUM('active', 'suspended', 'banned');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status" "account_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status_changed_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "user_status_idx" ON "user" USING btree ("status");