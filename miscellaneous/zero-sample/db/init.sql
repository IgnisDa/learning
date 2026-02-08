-- Run this once against your Postgres database (DATABASE_URL).
--
-- Notes
-- - zero-cache requires logical replication; ensure `wal_level=logical`.
-- - This is a POC schema (no down migrations / no fancy constraints).

CREATE TABLE IF NOT EXISTS app_user (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS user_session (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at bigint NOT NULL,
  created_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS "show" (
  id text PRIMARY KEY,
  tmdb_id integer NOT NULL UNIQUE,
  name text NOT NULL,
  overview text,
  poster_path text,
  enrich_state text NOT NULL,
  enrich_error text,
  enriched_at bigint
);

CREATE TABLE IF NOT EXISTS user_show (
  user_id text NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
  show_id text NOT NULL REFERENCES "show" (id) ON DELETE CASCADE,
  added_at bigint NOT NULL,
  PRIMARY KEY (user_id, show_id)
);

CREATE INDEX IF NOT EXISTS user_show_user_idx
  ON user_show (user_id);

CREATE TABLE IF NOT EXISTS season (
  id text PRIMARY KEY,
  show_id text NOT NULL REFERENCES "show" (id) ON DELETE CASCADE,
  season_number integer NOT NULL,
  name text NOT NULL,
  overview text,
  poster_path text,
  episode_count integer,
  air_date text,
  UNIQUE (show_id, season_number)
);

CREATE TABLE IF NOT EXISTS episode (
  id text PRIMARY KEY,
  season_id text NOT NULL REFERENCES season (id) ON DELETE CASCADE,
  episode_number integer NOT NULL,
  name text NOT NULL,
  overview text,
  still_path text,
  air_date text,
  runtime integer,
  UNIQUE (season_id, episode_number)
);

CREATE INDEX IF NOT EXISTS episode_season_idx
  ON episode (season_id);

CREATE TABLE IF NOT EXISTS person (
  id text PRIMARY KEY,
  tmdb_person_id integer NOT NULL UNIQUE,
  name text NOT NULL,
  profile_path text
);

CREATE TABLE IF NOT EXISTS credit (
  id text PRIMARY KEY,
  show_id text NOT NULL REFERENCES "show" (id) ON DELETE CASCADE,
  person_id text NOT NULL REFERENCES person (id) ON DELETE CASCADE,
  kind text NOT NULL,
  character text,
  job text,
  department text,
  order_index integer
);

CREATE INDEX IF NOT EXISTS credit_show_kind_order_idx
  ON credit (show_id, kind, order_index);

CREATE INDEX IF NOT EXISTS credit_person_idx
  ON credit (person_id);

CREATE TABLE IF NOT EXISTS outbox (
  id text PRIMARY KEY,
  topic text NOT NULL,
  show_id text NOT NULL REFERENCES "show" (id) ON DELETE CASCADE,
  tmdb_id integer NOT NULL,
  status text NOT NULL,
  attempts integer NOT NULL,
  locked_at bigint,
  last_error text,
  created_at bigint NOT NULL
);

CREATE INDEX IF NOT EXISTS outbox_topic_status_idx
  ON outbox (topic, status);

CREATE INDEX IF NOT EXISTS outbox_status_idx
  ON outbox (status);

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS watch_status text;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS started_at bigint;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS current_season integer;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS current_episode integer;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS target_finish_at bigint;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS rating integer;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS setup_step integer DEFAULT 1;

ALTER TABLE IF EXISTS user_show
  ADD COLUMN IF NOT EXISTS setup_completed_at bigint;
