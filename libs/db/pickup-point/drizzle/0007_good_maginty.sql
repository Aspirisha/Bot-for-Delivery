ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "user_shifts_table" DROP CONSTRAINT "user_shifts_table_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_shifts_table" ADD CONSTRAINT "user_shifts_table_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;