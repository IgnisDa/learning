import { serve } from "@hono/node-server";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { Hono } from "hono";
import { Redis } from "ioredis";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { startWorker } from "./worker";

const WORKER_PORT = 8080;

const REDIS_URL = process.env.REDIS_URL;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!REDIS_URL) throw new Error("REDIS_URL is required");
if (!process.env.TMDB_API_KEY) throw new Error("TMDB_API_KEY is required");

const sql = postgres(DATABASE_URL);
const db = drizzle(sql);
const redis = new Redis(REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});
const migrationsFolder = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../drizzle",
);

const app = new Hono();

app.get("/healthz", async (c) => {
  const checks: Record<string, boolean> = {};

  try {
    await sql`SELECT 1`;
    checks.db = true;
  } catch {
    checks.db = false;
  }

  try {
    await redis.ping();
    checks.redis = true;
  } catch {
    checks.redis = false;
  }

  const ok = checks.db && checks.redis;
  return c.json({ status: ok, checks }, ok ? 200 : 503);
});

serve({ fetch: app.fetch, port: WORKER_PORT }, () => {
  console.info(`Health server listening on port ${WORKER_PORT}`);
});

const worker = await startWorker({ sql, db, migrationsFolder });

async function shutdown() {
  console.info("Shutting down...");
  await worker.close();
  await redis.quit();
  await sql.end({ timeout: 5 });
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
