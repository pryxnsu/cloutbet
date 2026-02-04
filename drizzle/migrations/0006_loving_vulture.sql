DROP INDEX "prediction_expiry_created_at_idx";--> statement-breakpoint
CREATE INDEX "prediction_created_at_idx" ON "prediction" USING btree ("created_at");