import {
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
export * from "./auth-schema";

export const appUser = pgTable("app_user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const show = pgTable("show", {
  id: text("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  name: text("name").notNull(),
  overview: text("overview"),
  posterPath: text("poster_path"),
  enrichState: text("enrich_state").notNull(),
  enrichError: text("enrich_error"),
  enrichedAt: bigint("enriched_at", { mode: "number" }),
});

export const userShow = pgTable(
  "user_show",
  {
    userId: text("user_id")
      .notNull()
      .references(() => appUser.id, { onDelete: "cascade" }),
    showId: text("show_id")
      .notNull()
      .references(() => show.id, { onDelete: "cascade" }),
    addedAt: bigint("added_at", { mode: "number" }).notNull(),
    watchStatus: text("watch_status"),
    startedAt: bigint("started_at", { mode: "number" }),
    currentSeason: integer("current_season"),
    currentEpisode: integer("current_episode"),
    targetFinishAt: bigint("target_finish_at", { mode: "number" }),
    rating: integer("rating"),
    isFavorite: boolean("is_favorite").default(false),
    notes: text("notes"),
    setupStep: integer("setup_step").default(1),
    setupCompletedAt: bigint("setup_completed_at", { mode: "number" }),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.showId] }),
    index("user_show_user_idx").on(table.userId),
  ],
);

export const season = pgTable(
  "season",
  {
    id: text("id").primaryKey(),
    showId: text("show_id")
      .notNull()
      .references(() => show.id, { onDelete: "cascade" }),
    seasonNumber: integer("season_number").notNull(),
    name: text("name").notNull(),
    overview: text("overview"),
    posterPath: text("poster_path"),
    episodeCount: integer("episode_count"),
    airDate: text("air_date"),
  },
  (table) => [
    uniqueIndex("season_show_number_idx").on(table.showId, table.seasonNumber),
  ],
);

export const episode = pgTable(
  "episode",
  {
    id: text("id").primaryKey(),
    seasonId: text("season_id")
      .notNull()
      .references(() => season.id, { onDelete: "cascade" }),
    episodeNumber: integer("episode_number").notNull(),
    name: text("name").notNull(),
    overview: text("overview"),
    stillPath: text("still_path"),
    airDate: text("air_date"),
    runtime: integer("runtime"),
  },
  (table) => [
    uniqueIndex("episode_season_number_idx").on(
      table.seasonId,
      table.episodeNumber,
    ),
    index("episode_season_idx").on(table.seasonId),
  ],
);

export const person = pgTable("person", {
  id: text("id").primaryKey(),
  tmdbPersonId: integer("tmdb_person_id").notNull().unique(),
  name: text("name").notNull(),
  profilePath: text("profile_path"),
});

export const credit = pgTable(
  "credit",
  {
    id: text("id").primaryKey(),
    showId: text("show_id")
      .notNull()
      .references(() => show.id, { onDelete: "cascade" }),
    personId: text("person_id")
      .notNull()
      .references(() => person.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    character: text("character"),
    job: text("job"),
    department: text("department"),
    orderIndex: integer("order_index"),
  },
  (table) => [
    index("credit_show_kind_order_idx").on(
      table.showId,
      table.kind,
      table.orderIndex,
    ),
    index("credit_person_idx").on(table.personId),
  ],
);
