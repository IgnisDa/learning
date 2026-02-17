import { serve } from "@hono/node-server";
import { mustGetMutator, mustGetQuery } from "@rocicorp/zero";
import { handleMutateRequest, handleQueryRequest } from "@rocicorp/zero/server";
import { zeroPostgresJS } from "@rocicorp/zero/server/adapters/postgresjs";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { Hono } from "hono";
import { Redis } from "ioredis";
import { resolve } from "node:path";
import { queries } from "../src/zero/queries";
import { schema } from "../src/zero/schema";
import { auth } from "./auth";
import { tmdbKey } from "./lib/common";
import { sql } from "./lib/db";
import { requireAuth } from "./middleware/auth";
import { startWorker } from "./worker";
import { serverMutators } from "./zero/server-mutators";

type TmdbSearchTvResponse = {
  results?: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    first_air_date: string | undefined;
  }>;
};

const WORKER_PORT = 8080;

const db = drizzle(sql);
const redis = new Redis(process.env.REDIS_URL!, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});
const dbProvider = zeroPostgresJS(schema, sql);
const migrationsFolder = resolve(process.cwd(), "drizzle");

function toAuthRequest(request: Request) {
  const url = new URL(request.url);
  if (url.pathname === "/auth" || url.pathname.startsWith("/auth/")) {
    url.pathname = `/api${url.pathname}`;
    return new Request(url, request);
  }
  return request;
}

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

app.on(["GET", "POST"], "/auth", (c) => {
  return auth.handler(toAuthRequest(c.req.raw));
});

app.on(["GET", "POST"], "/auth/*", (c) => {
  return auth.handler(toAuthRequest(c.req.raw));
});

app.get("/tmdb/search", async (c) => {
  const q = c.req.query("q")?.trim() ?? "";
  if (q.length < 2) {
    return Response.json([]);
  }

  const tmdbURL = new URL("https://api.themoviedb.org/3/search/tv");
  tmdbURL.searchParams.set("query", q);
  tmdbURL.searchParams.set("include_adult", "false");
  tmdbURL.searchParams.set("language", "en-US");

  const baseHeaders = {
    Accept: "application/json",
  };

  const trimmedKey = tmdbKey.trim();
  const isV3ApiKey = /^[a-f0-9]{32}$/i.test(trimmedKey);
  const headers = isV3ApiKey
    ? baseHeaders
    : {
        ...baseHeaders,
        Authorization: trimmedKey.toLowerCase().startsWith("bearer ")
          ? trimmedKey
          : `Bearer ${trimmedKey}`,
      };

  if (isV3ApiKey) {
    tmdbURL.searchParams.set("api_key", trimmedKey);
  }

  const fetchResult = await (async () => {
    try {
      return {
        ok: true as const,
        response: await fetch(tmdbURL, { headers }),
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const cause = e instanceof Error ? e.cause : undefined;
      return {
        ok: false as const,
        response: Response.json(
          {
            error: "TMDB search failed",
            status: "fetch",
            details:
              cause && typeof cause === "object" && "code" in cause
                ? `${message} (cause=${String((cause as Record<string, unknown>).code)})`
                : message,
          },
          { status: 502 },
        ),
      };
    }
  })();

  if (!fetchResult.ok) {
    return fetchResult.response;
  }

  const res = fetchResult.response;

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      {
        error: "TMDB search failed",
        status: res.status,
        details: text.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const data = (await res.json()) as TmdbSearchTvResponse;

  return Response.json(
    (data.results ?? []).map((r) => ({
      tmdbId: r.id,
      name: r.name,
      overview: r.overview,
      posterPath: r.poster_path,
      firstAirDate: r.first_air_date,
    })),
  );
});

app.post("/zero/query", async (c) => {
  const request = c.req.raw;
  const session = await requireAuth(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await handleQueryRequest(
    (name, args) => {
      const query = mustGetQuery(queries, name);
      return query.fn({
        args,
        ctx: { userID: session.userID },
      });
    },
    schema,
    request,
  );

  return Response.json(result);
});

app.post("/zero/mutate", async (c) => {
  const request = c.req.raw;
  const session = await requireAuth(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await handleMutateRequest(
    dbProvider,
    async (transact) =>
      await transact(async (tx, name, args) => {
        const mutator = mustGetMutator(serverMutators, name);
        return await mutator.fn({
          tx,
          args,
          ctx: { userID: session.userID },
        });
      }),
    request,
  );

  return Response.json(result);
});

serve({ fetch: app.fetch, port: WORKER_PORT }, () => {
  console.info(`Server listening on port ${WORKER_PORT}`);
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
