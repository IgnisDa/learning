CREATE TABLE "app_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "app_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "credit" (
	"id" text PRIMARY KEY NOT NULL,
	"show_id" text NOT NULL,
	"person_id" text NOT NULL,
	"kind" text NOT NULL,
	"character" text,
	"job" text,
	"department" text,
	"order_index" integer
);
--> statement-breakpoint
CREATE TABLE "episode" (
	"id" text PRIMARY KEY NOT NULL,
	"season_id" text NOT NULL,
	"episode_number" integer NOT NULL,
	"name" text NOT NULL,
	"overview" text,
	"still_path" text,
	"air_date" text,
	"runtime" integer
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" text PRIMARY KEY NOT NULL,
	"tmdb_person_id" integer NOT NULL,
	"name" text NOT NULL,
	"profile_path" text,
	CONSTRAINT "person_tmdb_person_id_unique" UNIQUE("tmdb_person_id")
);
--> statement-breakpoint
CREATE TABLE "season" (
	"id" text PRIMARY KEY NOT NULL,
	"show_id" text NOT NULL,
	"season_number" integer NOT NULL,
	"name" text NOT NULL,
	"overview" text,
	"poster_path" text,
	"episode_count" integer,
	"air_date" text
);
--> statement-breakpoint
CREATE TABLE "show" (
	"id" text PRIMARY KEY NOT NULL,
	"tmdb_id" integer NOT NULL,
	"name" text NOT NULL,
	"overview" text,
	"poster_path" text,
	"enrich_state" text NOT NULL,
	"enrich_error" text,
	"enriched_at" bigint,
	CONSTRAINT "show_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE "user_show" (
	"user_id" text NOT NULL,
	"show_id" text NOT NULL,
	"added_at" bigint NOT NULL,
	"watch_status" text,
	"started_at" bigint,
	"current_season" integer,
	"current_episode" integer,
	"target_finish_at" bigint,
	"rating" integer,
	"is_favorite" boolean DEFAULT false,
	"notes" text,
	"setup_step" integer DEFAULT 1,
	"setup_completed_at" bigint,
	CONSTRAINT "user_show_user_id_show_id_pk" PRIMARY KEY("user_id","show_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "credit" ADD CONSTRAINT "credit_show_id_show_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."show"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit" ADD CONSTRAINT "credit_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "episode" ADD CONSTRAINT "episode_season_id_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."season"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season" ADD CONSTRAINT "season_show_id_show_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."show"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_show" ADD CONSTRAINT "user_show_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_show" ADD CONSTRAINT "user_show_show_id_show_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."show"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "credit_show_kind_order_idx" ON "credit" USING btree ("show_id","kind","order_index");--> statement-breakpoint
CREATE INDEX "credit_person_idx" ON "credit" USING btree ("person_id");--> statement-breakpoint
CREATE UNIQUE INDEX "episode_season_number_idx" ON "episode" USING btree ("season_id","episode_number");--> statement-breakpoint
CREATE INDEX "episode_season_idx" ON "episode" USING btree ("season_id");--> statement-breakpoint
CREATE UNIQUE INDEX "season_show_number_idx" ON "season" USING btree ("show_id","season_number");--> statement-breakpoint
CREATE INDEX "user_show_user_idx" ON "user_show" USING btree ("user_id");