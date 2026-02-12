import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    phoneVerificationTime: v.optional(v.number()),
    emailVerificationTime: v.optional(v.number()),
  }).index("email", ["email"]),

  shows: defineTable({
    name: v.string(),
    tmdbId: v.number(),
    overview: v.optional(v.string()),
    posterPath: v.optional(v.string()),
  }).index("tmdbId", ["tmdbId"]),

  userShows: defineTable({
    userId: v.id("users"),
    showId: v.id("shows"),
  })
    .index("userId", ["userId"])
    .index("showId", ["showId"])
    .index("userIdShowId", ["userId", "showId"]),

  seasons: defineTable({
    name: v.string(),
    seasonNumber: v.number(),
    showId: v.id("shows"),
    airDate: v.optional(v.string()),
    overview: v.optional(v.string()),
    posterPath: v.optional(v.string()),
    episodeCount: v.optional(v.number()),
  })
    .index("showId", ["showId"])
    .index("showIdSeasonNumber", ["showId", "seasonNumber"]),

  persons: defineTable({
    name: v.string(),
    tmdbPersonId: v.number(),
    profilePath: v.optional(v.string()),
  }).index("tmdbPersonId", ["tmdbPersonId"]),

  episodes: defineTable({
    name: v.string(),
    episodeNumber: v.number(),
    seasonId: v.id("seasons"),
    airDate: v.optional(v.string()),
    runtime: v.optional(v.number()),
    overview: v.optional(v.string()),
    stillPath: v.optional(v.string()),
  })
    .index("seasonId", ["seasonId"])
    .index("seasonIdEpisodeNumber", ["seasonId", "episodeNumber"]),

  credits: defineTable({
    kind: v.string(),
    showId: v.id("shows"),
    job: v.optional(v.string()),
    personId: v.id("persons"),
    character: v.optional(v.string()),
    department: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
  }).index("showId", ["showId"]),

  workPoolResults: defineTable({
    workId: v.string(),
    jobType: v.string(),
    poolName: v.string(),
    result: v.optional(v.any()),
    context: v.optional(v.any()),
    error: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("complete")),
  }).index("workId", ["workId"]),
});
