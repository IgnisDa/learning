import {
  table,
  string,
  number,
  boolean,
  enumeration,
  relationships,
  createSchema,
  createBuilder,
} from "@rocicorp/zero";

export type EnrichState = "queued" | "running" | "ready" | "error";
export type CreditKind = "cast" | "crew";
export type OutboxStatus = "pending" | "running" | "done" | "error";
export type WatchStatus =
  | "plan_to_watch"
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped";
export type ZeroContext = { userID: string };

const show = table("show")
  .columns({
    id: string(),
    name: string(),
    overview: string().optional(),
    tmdbId: number().from("tmdb_id"),
    posterPath: string().optional().from("poster_path"),
    enrichedAt: number().optional().from("enriched_at"),
    enrichError: string().optional().from("enrich_error"),
    enrichState: enumeration<EnrichState>().from("enrich_state"),
  })
  .primaryKey("id");

const userShow = table("userShow")
  .from("user_show")
  .columns({
    notes: string().optional(),
    rating: number().optional(),
    userId: string().from("user_id"),
    showId: string().from("show_id"),
    addedAt: number().from("added_at"),
    startedAt: number().optional().from("started_at"),
    setupStep: number().optional().from("setup_step"),
    isFavorite: boolean().optional().from("is_favorite"),
    currentSeason: number().optional().from("current_season"),
    currentEpisode: number().optional().from("current_episode"),
    targetFinishAt: number().optional().from("target_finish_at"),
    setupCompletedAt: number().optional().from("setup_completed_at"),
    watchStatus: enumeration<WatchStatus>().optional().from("watch_status"),
  })
  .primaryKey("userId", "showId");

const season = table("season")
  .columns({
    id: string(),
    name: string(),
    overview: string().optional(),
    showId: string().from("show_id"),
    seasonNumber: number().from("season_number"),
    airDate: string().optional().from("air_date"),
    posterPath: string().optional().from("poster_path"),
    episodeCount: number().optional().from("episode_count"),
  })
  .primaryKey("id");

const person = table("person")
  .columns({
    id: string(),
    name: string(),
    tmdbPersonId: number().from("tmdb_person_id"),
    profilePath: string().optional().from("profile_path"),
  })
  .primaryKey("id");

const episode = table("episode")
  .columns({
    id: string(),
    name: string(),
    runtime: number().optional(),
    overview: string().optional(),
    seasonId: string().from("season_id"),
    airDate: string().optional().from("air_date"),
    episodeNumber: number().from("episode_number"),
    stillPath: string().optional().from("still_path"),
  })
  .primaryKey("id");

const credit = table("credit")
  .columns({
    id: string(),
    job: string().optional(),
    character: string().optional(),
    kind: enumeration<CreditKind>(),
    department: string().optional(),
    showId: string().from("show_id"),
    personId: string().from("person_id"),
    orderIndex: number().optional().from("order_index"),
  })
  .primaryKey("id");

const outbox = table("outbox")
  .columns({
    id: string(),
    topic: string(),
    attempts: number(),
    status: enumeration<OutboxStatus>(),
    showId: string().from("show_id"),
    tmdbId: number().from("tmdb_id"),
    createdAt: number().from("created_at"),
    lockedAt: number().optional().from("locked_at"),
    lastError: string().optional().from("last_error"),
  })
  .primaryKey("id");

const showRelationships = relationships(show, ({ many }) => ({
  seasons: many({
    destSchema: season,
    sourceField: ["id"],
    destField: ["showId"],
  }),
  credits: many({
    destSchema: credit,
    sourceField: ["id"],
    destField: ["showId"],
  }),
  userShows: many({
    sourceField: ["id"],
    destField: ["showId"],
    destSchema: userShow,
  }),
}));

const userShowRelationships = relationships(userShow, ({ one }) => ({
  show: one({
    destSchema: show,
    destField: ["id"],
    sourceField: ["showId"],
  }),
}));

const seasonRelationships = relationships(season, ({ one, many }) => ({
  show: one({
    destSchema: show,
    destField: ["id"],
    sourceField: ["showId"],
  }),
  episodes: many({
    destSchema: episode,
    sourceField: ["id"],
    destField: ["seasonId"],
  }),
}));

const episodeRelationships = relationships(episode, ({ one }) => ({
  season: one({
    destField: ["id"],
    destSchema: season,
    sourceField: ["seasonId"],
  }),
}));

const personRelationships = relationships(person, ({ many }) => ({
  credits: many({
    destSchema: credit,
    sourceField: ["id"],
    destField: ["personId"],
  }),
}));

const creditRelationships = relationships(credit, ({ one }) => ({
  show: one({
    destSchema: show,
    destField: ["id"],
    sourceField: ["showId"],
  }),
  person: one({
    destField: ["id"],
    destSchema: person,
    sourceField: ["personId"],
  }),
}));

export const schema = createSchema({
  tables: [show, userShow, season, episode, person, credit, outbox],
  relationships: [
    showRelationships,
    seasonRelationships,
    personRelationships,
    creditRelationships,
    episodeRelationships,
    userShowRelationships,
  ],
});

export type Schema = typeof schema;

export const zql = createBuilder(schema);

declare module "@rocicorp/zero" {
  interface DefaultTypes {
    schema: Schema;
    context: ZeroContext;
  }
}
