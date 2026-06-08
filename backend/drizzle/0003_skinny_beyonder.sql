CREATE TABLE "saved_listing" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"property_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_listing" ADD CONSTRAINT "saved_listing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_listing" ADD CONSTRAINT "saved_listing_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "saved_listing_user_id_idx" ON "saved_listing" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_listing_property_id_idx" ON "saved_listing" USING btree ("property_id");