import "dotenv/config";
import { readFile } from "node:fs/promises";
import postgres from "postgres";
import { Worker, Job } from "bullmq";
import type { TmdbEnrichJobData } from "../src/lib/queue";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is required");
}

type TmdbTvDetails = {
  name: string;
  overview: string;
  poster_path: string | null;
  seasons: Array<{
    season_number: number;
  }>;
};

type TmdbTvSeasonDetails = {
  season_number: number;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  episode_count?: number | null;
  episodes?: Array<{
    episode_number: number;
    name: string;
    overview?: string;
    still_path?: string | null;
    air_date?: string | null;
    runtime?: number | null;
  }>;
  air_date?: string | null;
};

type TmdbTvCredits = {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    order: number;
    profile_path: string | null;
  }>;
  crew: Array<{
    id: number;
    name: string;
    department: string;
    job: string;
    profile_path: string | null;
  }>;
};

const DATABASE_URL = process.env.DATABASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!DATABASE_URL)
  throw new Error("DATABASE_URL (or ZERO_UPSTREAM_DB) is required");

if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is required");

const sql = postgres(DATABASE_URL);

await ensureSchemaInitialized();

console.info(`TMDB worker started (node ${process.version})`);

const worker = new Worker<TmdbEnrichJobData>(
  "tmdb.enrich_show",
  async (job: Job<TmdbEnrichJobData>) => {
    console.info(
      `Job ${job.id}: enriching show_id=${job.data.showId} tmdb_id=${job.data.tmdbId}`,
    );
    await enrichShow(job.data);
    console.info(`Job ${job.id}: done`);
  },
  { concurrency: 5, connection: { url: REDIS_URL } },
);

worker.on("completed", (job) => {
  console.info(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
  if (job) {
    void markShowError(job.data.showId, truncate(err.message, 1000));
  }
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

process.on("SIGINT", async () => {
  console.info("Shutting down worker...");
  await worker.close();
  await sql.end({ timeout: 5 });
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.info("Shutting down worker...");
  await worker.close();
  await sql.end({ timeout: 5 });
  process.exit(0);
});

console.info("Worker is ready to process jobs...");

async function enrichShow(jobData: TmdbEnrichJobData) {
  const { showId, tmdbId } = jobData;

  await sql`
    UPDATE "show"
    SET enrich_state = 'running',
        enrich_error = NULL
    WHERE id = ${showId}
  `;

  const tv = await tmdb<TmdbTvDetails>(`/tv/${tmdbId}`);
  const credits = await tmdb<TmdbTvCredits>(`/tv/${tmdbId}/credits`);

  const seasonNumbers = (tv.seasons ?? [])
    .map((s) => s.season_number)
    .filter((n) => typeof n === "number");

  const seasonDetails: Array<TmdbTvSeasonDetails> = [];
  for (const n of seasonNumbers) {
    seasonDetails.push(await tmdb(`/tv/${tmdbId}/season/${n}`));
  }

  const now = Date.now();

  await sql.begin(async (txRaw) => {
    const tx = txRaw as unknown as postgres.Sql;

    await tx`
      DELETE FROM episode
      WHERE season_id IN (
        SELECT id FROM season WHERE show_id = ${showId}
      )
    `;

    await tx`
      DELETE FROM season
      WHERE show_id = ${showId}
    `;

    await tx`
      DELETE FROM credit
      WHERE show_id = ${showId}
    `;

    for (const s of seasonDetails) {
      const seasonName = s.name ?? `Season ${s.season_number}`;
      const episodeCount =
        typeof s.episode_count === "number"
          ? s.episode_count
          : Array.isArray(s.episodes)
            ? s.episodes.length
            : null;

      console.log(
        `Season ${s.season_number}: ${s.episodes?.length ?? 0} episodes found`,
      );

      const seasonId = `season_${showId}_${s.season_number}`;
      await tx`
        INSERT INTO season (
          id,
          show_id,
          season_number,
          name,
          overview,
          poster_path,
          episode_count,
          air_date
        )
        VALUES (
          ${seasonId},
          ${showId},
          ${s.season_number},
					${seasonName},
					${s.overview ?? null},
					${s.poster_path ?? null},
					${episodeCount},
					${s.air_date ?? null}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          overview = EXCLUDED.overview,
          poster_path = EXCLUDED.poster_path,
          episode_count = EXCLUDED.episode_count,
          air_date = EXCLUDED.air_date
      `;

      if (Array.isArray(s.episodes)) {
        console.log(
          `Inserting ${s.episodes.length} episodes for season ${s.season_number}`,
        );
        for (const ep of s.episodes) {
          const episodeId = `episode_${seasonId}_${ep.episode_number}`;
          await tx`
            INSERT INTO episode (
              id,
              season_id,
              episode_number,
              name,
              overview,
              still_path,
              air_date,
              runtime
            )
            VALUES (
              ${episodeId},
              ${seasonId},
              ${ep.episode_number},
              ${ep.name},
              ${ep.overview ?? null},
              ${ep.still_path ?? null},
              ${ep.air_date ?? null},
              ${ep.runtime ?? null}
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              overview = EXCLUDED.overview,
              still_path = EXCLUDED.still_path,
              air_date = EXCLUDED.air_date,
              runtime = EXCLUDED.runtime
          `;
        }
      } else {
        console.log(`No episodes array found for season ${s.season_number}`);
      }
    }

    for (const c of credits.cast ?? []) {
      const personId = `person_${c.id}`;
      await upsertPerson(tx, {
        id: c.id,
        name: c.name,
        profile_path: c.profile_path,
      });

      await tx`
        INSERT INTO credit (
          id,
          show_id,
          person_id,
          kind,
          character,
          job,
          department,
          order_index
        )
        VALUES (
          ${`cast_${showId}_${c.id}_${c.order}`},
          ${showId},
          ${personId},
          'cast',
					${c.character ?? null},
          NULL,
          NULL,
          ${c.order}
        )
      `;
    }

    for (const c of credits.crew ?? []) {
      const personId = `person_${c.id}`;
      await upsertPerson(tx, {
        id: c.id,
        name: c.name,
        profile_path: c.profile_path,
      });

      await tx`
        INSERT INTO credit (
          id,
          show_id,
          person_id,
          kind,
          character,
          job,
          department,
          order_index
        )
        VALUES (
          ${`crew_${showId}_${c.id}_${c.department}_${c.job}`},
          ${showId},
          ${personId},
          'crew',
          NULL,
					${c.job ?? null},
					${c.department ?? null},
          NULL
        )
      `;
    }

    await tx`
      UPDATE "show"
			SET name = ${tv.name},
				overview = ${tv.overview ?? null},
				poster_path = ${tv.poster_path ?? null},
          enrich_state = 'ready',
          enrich_error = NULL,
          enriched_at = ${now}
      WHERE id = ${showId}
    `;
  });
}

async function upsertPerson(
  tx: postgres.Sql,
  person: { id: number; name: string; profile_path: string | null | undefined },
) {
  const personId = `person_${person.id}`;

  await tx`
    INSERT INTO person (
      id,
      tmdb_person_id,
      name,
      profile_path
    )
    VALUES (
      ${personId},
      ${person.id},
      ${person.name},
			${person.profile_path ?? null}
    )
    ON CONFLICT (tmdb_person_id) DO UPDATE SET
      name = EXCLUDED.name,
      profile_path = EXCLUDED.profile_path
  `;
}

async function markShowError(showId: string, message: string) {
  await sql`
    UPDATE "show"
    SET enrich_state = 'error',
        enrich_error = ${message}
    WHERE id = ${showId}
  `;
}

async function tmdb<T>(path: string): Promise<T> {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set("language", "en-US");

  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "zero-sample/0.1",
  };

  const trimmedKey = TMDB_API_KEY!.trim();
  const isV3ApiKey = /^[a-f0-9]{32}$/i.test(trimmedKey);
  if (isV3ApiKey) {
    url.searchParams.set("api_key", trimmedKey);
  } else {
    headers.Authorization = trimmedKey.toLowerCase().startsWith("bearer ")
      ? trimmedKey
      : `Bearer ${trimmedKey}`;
  }

  const res = await fetchWithRetry(url, { headers }, 3);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

async function ensureSchemaInitialized() {
  const initSql = await readFile(
    new URL("../db/init.sql", import.meta.url),
    "utf8",
  );

  const attempts = 30;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await sql.unsafe(initSql);
      console.info("DB init script applied");
      return;
    } catch (error) {
      if (attempt === attempts) {
        throw new Error("Failed to initialize database schema", {
          cause: error instanceof Error ? error : undefined,
        });
      }
      console.warn(
        `DB init attempt ${attempt}/${attempts} failed, retrying in 1s: ${formatErrorMessage(error)}`,
      );
      await sleep(1000);
    }
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchWithRetry(url: URL, init: RequestInit, attempts: number) {
  let lastError: unknown;

  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetch(url, init);
    } catch (e) {
      lastError = e;
      if (i < attempts - 1) {
        await sleep(250 * (i + 1));
      }
    }
  }

  throw new Error(
    `Network error while fetching ${url.hostname}: ${formatErrorMessage(lastError)}`,
    {
      cause: lastError instanceof Error ? lastError : undefined,
    },
  );
}

function formatErrorMessage(err: unknown) {
  if (!(err instanceof Error)) {
    return String(err);
  }

  const cause = err.cause;
  if (cause instanceof Error) {
    const code = getRecordString(cause, "code");
    return `${err.message}${code ? ` (cause=${code})` : ` (cause=${cause.message})`}`;
  }

  const code = getRecordString(cause, "code");
  const msg = getRecordString(cause, "message");
  if (code) {
    return `${err.message} (cause=${code}${msg ? `: ${msg}` : ""})`;
  }
  if (msg) {
    return `${err.message} (cause=${msg})`;
  }

  return err.message;
}

function getRecordString(value: unknown, key: string): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const prop = record[key];
  return typeof prop === "string" ? prop : undefined;
}

function truncate(text: string, max: number) {
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max)}...`;
}
