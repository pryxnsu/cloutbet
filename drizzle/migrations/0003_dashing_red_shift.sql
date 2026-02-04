DROP INDEX "prediction_user_id_user_id_idx";--> statement-breakpoint
CREATE INDEX "prediction_user_id_idx" ON "prediction" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "prediction_expiry_idx" ON "prediction" USING btree ("expiry");