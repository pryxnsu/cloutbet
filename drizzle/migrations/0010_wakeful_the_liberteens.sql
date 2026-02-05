DROP INDEX "bet_user_id_idx";--> statement-breakpoint
DROP INDEX "bet_created_at_idx";--> statement-breakpoint
DROP INDEX "bet_unique_user_prediction";--> statement-breakpoint
CREATE INDEX "bet_user_created_idx" ON "bet" USING btree ("user_id","created_at");