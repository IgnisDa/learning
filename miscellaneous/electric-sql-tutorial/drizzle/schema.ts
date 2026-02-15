import { pgTable, text, uuid, timestamp, integer, jsonb, index, unique } from "drizzle-orm/pg-core";

// Type definitions for JSONB fields
export type CastCredit = {
  personName: string;
  personTmdbId: number;
  orderIndex?: number;
  character?: string;
  profilePath?: string;
};

export type CrewCredit = {
  personTmdbId: number;
  personName: string;
  job?: string;
  department?: string;
  profilePath?: string;
};

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sessions table
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    tokenIdx: index("sessions_token_idx").on(table.token),
  })
);

// Shows table
export const shows = pgTable(
  "shows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    tmdbId: integer("tmdb_id").notNull().unique(),
    overview: text("overview"),
    posterPath: text("poster_path"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tmdbIdIdx: index("shows_tmdb_id_idx").on(table.tmdbId),
  })
);

// User Shows junction table
export const userShows = pgTable(
  "user_shows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    showId: uuid("show_id")
      .references(() => shows.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_shows_user_id_idx").on(table.userId),
    showIdIdx: index("user_shows_show_id_idx").on(table.showId),
    uniqueUserShow: unique("user_show_unique").on(table.userId, table.showId),
  })
);

// Seasons table
export const seasons = pgTable(
  "seasons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id")
      .references(() => shows.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    seasonNumber: integer("season_number").notNull(),
    airDate: text("air_date"),
    overview: text("overview"),
    posterPath: text("poster_path"),
    episodeCount: integer("episode_count"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    showIdIdx: index("seasons_show_id_idx").on(table.showId),
    uniqueShowSeason: unique("show_season_unique").on(table.showId, table.seasonNumber),
  })
);

// Episodes table
export const episodes = pgTable(
  "episodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonId: uuid("season_id")
      .references(() => seasons.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    episodeNumber: integer("episode_number").notNull(),
    airDate: text("air_date"),
    runtime: integer("runtime"),
    overview: text("overview"),
    stillPath: text("still_path"),
    castCredits: jsonb("cast_credits").$type<CastCredit[]>(),
    crewCredits: jsonb("crew_credits").$type<CrewCredit[]>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    seasonIdIdx: index("episodes_season_id_idx").on(table.seasonId),
    uniqueSeasonEpisode: unique("season_episode_unique").on(
      table.seasonId,
      table.episodeNumber
    ),
  })
);

// Persons table
export const persons = pgTable(
  "persons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    tmdbPersonId: integer("tmdb_person_id").notNull().unique(),
    profilePath: text("profile_path"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    tmdbPersonIdIdx: index("persons_tmdb_person_id_idx").on(table.tmdbPersonId),
  })
);

// Credits table
export const credits = pgTable(
  "credits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id")
      .references(() => shows.id, { onDelete: "cascade" })
      .notNull(),
    personId: uuid("person_id")
      .references(() => persons.id, { onDelete: "cascade" })
      .notNull(),
    kind: text("kind").notNull(), // 'cast' or 'crew'
    character: text("character"),
    job: text("job"),
    department: text("department"),
    orderIndex: integer("order_index"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    showIdIdx: index("credits_show_id_idx").on(table.showId),
  })
);

// Export types for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Show = typeof shows.$inferSelect;
export type NewShow = typeof shows.$inferInsert;

export type UserShow = typeof userShows.$inferSelect;
export type NewUserShow = typeof userShows.$inferInsert;

export type Season = typeof seasons.$inferSelect;
export type NewSeason = typeof seasons.$inferInsert;

export type Episode = typeof episodes.$inferSelect;
export type NewEpisode = typeof episodes.$inferInsert;

export type Person = typeof persons.$inferSelect;
export type NewPerson = typeof persons.$inferInsert;

export type Credit = typeof credits.$inferSelect;
export type NewCredit = typeof credits.$inferInsert;
