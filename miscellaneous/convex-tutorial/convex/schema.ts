import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // Custom users table definition with required auth fields
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
  }),

  seasons: defineTable({
    name: v.string(),
    seasonNumber: v.number(),
    showId: v.id("shows"),
    airDate: v.optional(v.string()),
    overview: v.optional(v.string()),
    posterPath: v.optional(v.string()),
    episodeCount: v.optional(v.number()),
  }),

  persons: defineTable({
    name: v.string(),
    tmdbPersonId: v.number(),
    profilePath: v.optional(v.string()),
  }),

  episodes: defineTable({
    name: v.string(),
    episodeNumber: v.number(),
    seasonId: v.id("seasons"),
    airDate: v.optional(v.string()),
    runtime: v.optional(v.number()),
    overview: v.optional(v.string()),
    stillPath: v.optional(v.string()),
  }),

  credits: defineTable({
    kind: v.string(),
    showId: v.id("shows"),
    job: v.optional(v.string()),
    personId: v.id("persons"),
    character: v.optional(v.string()),
    department: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
  }),
});
