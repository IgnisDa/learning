export const isProd = process.env.NODE_ENV === "production";

export const databaseURL = process.env.DATABASE_URL || "";
if (!databaseURL) throw new Error("DATABASE_URL is required");

export const redisURL = process.env.REDIS_URL || "";
if (!redisURL) throw new Error("REDIS_URL is required");

const tmdbApiKey = process.env.TMDB_API_KEY || "";
if (!tmdbApiKey) throw new Error("TMDB_API_KEY is required");
export const tmdbKey = tmdbApiKey;
