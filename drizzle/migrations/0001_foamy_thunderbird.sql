CREATE TABLE "bet" (
	"id" text PRIMARY KEY NOT NULL,
	"prediction_id" text NOT NULL,
	"side" varchar NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prediction" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"user_id" text NOT NULL,
	"expiry" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bet" ADD CONSTRAINT "bet_prediction_id_prediction_id_fk" FOREIGN KEY ("prediction_id") REFERENCES "public"."prediction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bet" ADD CONSTRAINT "bet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prediction" ADD CONSTRAINT "prediction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "prediction_user_id_user_id_idx" ON "prediction" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_provider_account_id_idx" ON "account" USING btree ("provider_account_id");