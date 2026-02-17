import { Job, Worker } from "bullmq";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import type postgres from "postgres";
import { credit, episode, person, season, show } from "../src/db/schema";
import type { TmdbEnrichJobData } from "../src/lib/queue";

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

export async function startWorker(opts: {
  sql: postgres.Sql;
  db: ReturnType<typeof drizzle>;
  migrationsFolder: string;
}): Promise<Worker<TmdbEnrichJobData>> {
  const { sql, db, migrationsFolder } = opts;
  const REDIS_URL = process.env.REDIS_URL!;
  const TMDB_API_KEY = process.env.TMDB_API_KEY!;

  await ensureSchemaInitialized(db, migrationsFolder);

  console.info(`TMDB worker started (node ${process.version})`);

  const worker = new Worker<TmdbEnrichJobData>(
    "tmdb.enrich_show",
    async (job: Job<TmdbEnrichJobData>) => {
      console.info(
        `Job ${job.id}: enriching show_id=${job.data.showId} tmdb_id=${job.data.tmdbId}`,
      );
      await enrichShow({ jobData: job.data, db, tmdbApiKey: TMDB_API_KEY });
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
      void markShowError(db, job.data.showId, truncate(err.message, 1000));
    }
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
  });

  console.info("Worker is ready to process jobs...");

  return worker;
}

async function enrichShow(opts: {
  jobData: TmdbEnrichJobData;
  db: ReturnType<typeof drizzle>;
  tmdbApiKey: string;
}) {
  const { jobData, db, tmdbApiKey } = opts;
  const { showId, tmdbId } = jobData;

  await db
    .update(show)
    .set({ enrichState: "running", enrichError: null })
    .where(eq(show.id, showId));

  const tv = await tmdb<TmdbTvDetails>(`/tv/${tmdbId}`, tmdbApiKey);
  const credits = await tmdb<TmdbTvCredits>(
    `/tv/${tmdbId}/credits`,
    tmdbApiKey,
  );

  const seasonNumbers = (tv.seasons ?? [])
    .map((s) => s.season_number)
    .filter((n) => typeof n === "number");

  const seasonDetails = [] as Array<TmdbTvSeasonDetails>;
  for (const n of seasonNumbers) {
    seasonDetails.push(
      await tmdb<TmdbTvSeasonDetails>(`/tv/${tmdbId}/season/${n}`, tmdbApiKey),
    );
  }

  const now = Date.now();

  await db.transaction(async (tx) => {
    const seasonRows = await tx
      .select({ id: season.id })
      .from(season)
      .where(eq(season.showId, showId));

    if (seasonRows.length > 0) {
      await tx.delete(episode).where(
        inArray(
          episode.seasonId,
          seasonRows.map((row) => row.id),
        ),
      );
    }

    await tx.delete(season).where(eq(season.showId, showId));
    await tx.delete(credit).where(eq(credit.showId, showId));

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
      await tx
        .insert(season)
        .values({
          id: seasonId,
          showId,
          seasonNumber: s.season_number,
          name: seasonName,
          overview: s.overview ?? null,
          posterPath: s.poster_path ?? null,
          episodeCount,
          airDate: s.air_date ?? null,
        })
        .onConflictDoUpdate({
          target: season.id,
          set: {
            name: seasonName,
            overview: s.overview ?? null,
            posterPath: s.poster_path ?? null,
            episodeCount,
            airDate: s.air_date ?? null,
          },
        });

      if (Array.isArray(s.episodes)) {
        console.log(
          `Inserting ${s.episodes.length} episodes for season ${s.season_number}`,
        );
        for (const ep of s.episodes) {
          const episodeId = `episode_${seasonId}_${ep.episode_number}`;
          await tx
            .insert(episode)
            .values({
              id: episodeId,
              seasonId,
              episodeNumber: ep.episode_number,
              name: ep.name,
              overview: ep.overview ?? null,
              stillPath: ep.still_path ?? null,
              airDate: ep.air_date ?? null,
              runtime: ep.runtime ?? null,
            })
            .onConflictDoUpdate({
              target: episode.id,
              set: {
                name: ep.name,
                overview: ep.overview ?? null,
                stillPath: ep.still_path ?? null,
                airDate: ep.air_date ?? null,
                runtime: ep.runtime ?? null,
              },
            });
        }
      } else {
        console.log(`No episodes array found for season ${s.season_number}`);
      }
    }

    for (const c of credits.cast ?? []) {
      const personId = `person_${c.id}`;
      await tx
        .insert(person)
        .values({
          id: personId,
          tmdbPersonId: c.id,
          name: c.name,
          profilePath: c.profile_path ?? null,
        })
        .onConflictDoUpdate({
          target: person.tmdbPersonId,
          set: {
            name: c.name,
            profilePath: c.profile_path ?? null,
          },
        });

      await tx.insert(credit).values({
        id: `cast_${showId}_${c.id}_${c.order}`,
        showId,
        personId,
        kind: "cast",
        character: c.character ?? null,
        job: null,
        department: null,
        orderIndex: c.order,
      });
    }

    for (const c of credits.crew ?? []) {
      const personId = `person_${c.id}`;
      await tx
        .insert(person)
        .values({
          id: personId,
          tmdbPersonId: c.id,
          name: c.name,
          profilePath: c.profile_path ?? null,
        })
        .onConflictDoUpdate({
          target: person.tmdbPersonId,
          set: {
            name: c.name,
            profilePath: c.profile_path ?? null,
          },
        });

      await tx.insert(credit).values({
        id: `crew_${showId}_${c.id}_${c.department}_${c.job}`,
        showId,
        personId,
        kind: "crew",
        character: null,
        job: c.job ?? null,
        department: c.department ?? null,
        orderIndex: null,
      });
    }

    await tx
      .update(show)
      .set({
        name: tv.name,
        overview: tv.overview ?? null,
        posterPath: tv.poster_path ?? null,
        enrichState: "ready",
        enrichError: null,
        enrichedAt: now,
      })
      .where(eq(show.id, showId));
  });
}

async function markShowError(
  db: ReturnType<typeof drizzle>,
  showId: string,
  message: string,
) {
  await db
    .update(show)
    .set({ enrichState: "error", enrichError: message })
    .where(eq(show.id, showId));
}

async function tmdb<T>(path: string, apiKey: string) {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set("language", "en-US");

  const baseHeaders = {
    Accept: "application/json",
    "User-Agent": "zero-sample/0.1",
  };

  const trimmedKey = apiKey.trim();
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
    url.searchParams.set("api_key", trimmedKey);
  }

  const res = await fetchWithRetry(url, { headers }, 3);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

async function ensureSchemaInitialized(
  db: ReturnType<typeof drizzle>,
  migrationsFolder: string,
) {
  const attempts = 30;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await migrate(db, { migrationsFolder });
      console.info("Drizzle migrations applied");
      return;
    } catch (error) {
      if (attempt === attempts) {
        throw new Error("Failed to initialize database schema", {
          cause: error instanceof Error ? error : undefined,
        });
      }
      console.warn(
        `DB migration attempt ${attempt}/${attempts} failed, retrying in 1s: ${formatErrorMessage(error)}`,
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
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetch(url, init);
    } catch (e) {
      if (i < attempts - 1) {
        await sleep(250 * (i + 1));
        continue;
      }

      throw new Error(
        `Network error while fetching ${url.hostname}: ${formatErrorMessage(e)}`,
        {
          cause: e instanceof Error ? e : undefined,
        },
      );
    }
  }

  throw new Error(
    `Network error while fetching ${url.hostname}: unknown error`,
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

function getRecordString(value: unknown, key: string) {
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
