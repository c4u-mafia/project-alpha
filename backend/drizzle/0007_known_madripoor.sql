ALTER TABLE "payment" DROP CONSTRAINT "payment_payer_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "payer_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_payer_id_user_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;