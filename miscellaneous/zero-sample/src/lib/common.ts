export const isProd = process.env.NODE_ENV === "production";

export const databaseURL = process.env.DATABASE_URL || "";
if (!databaseURL)
  throw new Error("DATABASE_URL (or ZERO_UPSTREAM_DB) is required");

export const tmdbKey = process.env.TMDB_API_KEY;
if (!tmdbKey) throw new Error("TMDB_API_KEY is required");
