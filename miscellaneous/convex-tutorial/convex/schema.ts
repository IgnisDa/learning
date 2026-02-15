import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
  }).index("username", ["username"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("token", ["token"]),

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
});
