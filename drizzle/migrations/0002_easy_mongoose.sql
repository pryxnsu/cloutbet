CREATE TYPE "public"."bet_side" AS ENUM('in', 'out');--> statement-breakpoint
ALTER TABLE "prediction" ADD COLUMN "status" varchar DEFAULT 'open' NOT NULL;--> statement-breakpoint
CREATE INDEX "bet_prediction_id_idx" ON "bet" USING btree ("prediction_id");--> statement-breakpoint
CREATE INDEX "bet_user_id_idx" ON "bet" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bet_unique_user_prediction" ON "bet" USING btree ("prediction_id","user_id");