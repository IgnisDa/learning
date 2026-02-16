export const isProd = process.env.NODE_ENV === "production";

export const databaseURL = process.env.DATABASE_URL || "";

if (!databaseURL)
  throw new Error("DATABASE_URL (or ZERO_UPSTREAM_DB) is required");
