import { defineConfig } from "drizzle-kit";

const databaseURL =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/postgres";

export default defineConfig({
  strict: true,
  verbose: true,
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  dbCredentials: { url: databaseURL },
});
