import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export type EnrichState = "queued" | "running" | "ready" | "error";
export type CreditKind = "cast" | "crew";
export type OutboxStatus = "pending" | "running" | "done" | "error";
export type WatchStatus =
  | "plan_to_watch"
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped";

export default defineSchema({
  ...authTables,
  // Custom users table definition with required auth fields
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),

  show: defineTable({
    tmdbId: v.number(),
    name: v.string(),
    overview: v.optional(v.string()),
    posterPath: v.optional(v.string()),
    enrichState: v.string(),
    enrichError: v.optional(v.string()),
    enrichedAt: v.optional(v.number()),
  }),

  userShow: defineTable({
    userId: v.id("users"),
    showId: v.id("show"),
    addedAt: v.number(),
    watchStatus: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    currentSeason: v.optional(v.number()),
    currentEpisode: v.optional(v.number()),
    targetFinishAt: v.optional(v.number()),
    rating: v.optional(v.number()),
    isFavorite: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    setupStep: v.optional(v.number()),
    setupCompletedAt: v.optional(v.number()),
  }),

  season: defineTable({
    showId: v.id("show"),
    seasonNumber: v.number(),
    name: v.string(),
    overview: v.optional(v.string()),
    posterPath: v.optional(v.string()),
    episodeCount: v.optional(v.number()),
    airDate: v.optional(v.string()),
  }),

  person: defineTable({
    tmdbPersonId: v.number(),
    name: v.string(),
    profilePath: v.optional(v.string()),
  }),

  episode: defineTable({
    seasonId: v.id("season"),
    episodeNumber: v.number(),
    name: v.string(),
    overview: v.optional(v.string()),
    stillPath: v.optional(v.string()),
    airDate: v.optional(v.string()),
    runtime: v.optional(v.number()),
  }),

  credit: defineTable({
    showId: v.id("show"),
    personId: v.id("person"),
    kind: v.string(),
    character: v.optional(v.string()),
    job: v.optional(v.string()),
    department: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
  }),

  outbox: defineTable({
    topic: v.string(),
    showId: v.id("show"),
    tmdbId: v.number(),
    status: v.string(),
    attempts: v.number(),
    lockedAt: v.optional(v.number()),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
