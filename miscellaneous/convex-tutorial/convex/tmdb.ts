import { getAuthUserId } from "@convex-dev/auth/server";
import { Workpool } from "@convex-dev/workpool";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  action,
  ActionCtx,
  internalAction,
  internalMutation,
  internalQuery,
  query,
  type MutationCtx,
} from "./_generated/server";
import type { FunctionReference } from "convex/server";

// - add convex workflow
// - start displaying details of cast/crew of each season

const tmdbWorkpool = new Workpool(components.tmdbWorkpool, {
  maxParallelism: 5,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function enqueueWork<
  TArgs extends Record<string, any>,
  TContext = unknown,
>(
  ctx: ActionCtx,
  action: FunctionReference<"action", "internal", TArgs & { workId: string }>,
  jobType: string,
  args: TArgs,
  context?: TContext,
): Promise<string> {
  const workId = crypto.randomUUID();

  await ctx.runMutation(internal.tmdb.createPendingWorkResult, {
    workId,
    jobType,
    context,
    poolName: "tmdb",
  });

  await tmdbWorkpool.enqueueAction(ctx, action, { ...args, workId });

  return workId;
}

async function pollWorkResults(
  ctx: ActionCtx,
  workIds: string | readonly string[],
  intervalMs: number = 500,
) {
  const pending = new Set(Array.isArray(workIds) ? workIds : [workIds]);
  while (pending.size > 0) {
    await sleep(intervalMs);
    for (const workId of [...pending]) {
      const status = await ctx.runQuery(internal.tmdb.getWorkResultStatus, {
        workId,
      });
      if (status === "complete") pending.delete(workId);
    }
  }
}

type TmdbSearchTvResponse = {
  results?: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    first_air_date: string | undefined;
  }>;
};

type TmdbTvDetails = {
  name: string;
  overview?: string;
  poster_path?: string | null;
  seasons?: Array<{
    season_number: number;
  }>;
};

type TmdbTvSeasonDetails = {
  season_number: number;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  episode_count?: number | null;
  air_date?: string | null;
  episodes?: Array<{
    episode_number: number;
    name: string;
    overview?: string;
    still_path?: string | null;
    air_date?: string | null;
    runtime?: number | null;
  }>;
};

type TmdbTvCredits = {
  cast?: Array<{
    id: number;
    name: string;
    character?: string;
    order?: number;
    profile_path?: string | null;
  }>;
  crew?: Array<{
    id: number;
    name: string;
    department?: string;
    job?: string;
    profile_path?: string | null;
  }>;
};

export type SearchResult = {
  name: string;
  tmdbId: number;
  overview: string;
  firstAirDate?: string;
  posterPath: string | null;
};

/**
 * Fetches data from The Movie Database (TMDB) API
 * @param path - API endpoint path (e.g., "/search/tv?query=...")
 * @returns Parsed JSON response of type T
 * @throws Error if TMDB_API_KEY is not configured or if the API request fails
 */
async function tmdbFetch<T>(path: string): Promise<T> {
  const tmdbKey = process.env.TMDB_API_KEY;
  if (!tmdbKey) throw new Error("TMDB_API_KEY is not configured");

  const trimmedKey = tmdbKey.trim();

  const tmdbURL = new URL(`https://api.themoviedb.org/3${path}`);
  tmdbURL.searchParams.set("language", "en-US");

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${trimmedKey}`,
  };

  const res = await fetch(tmdbURL.toString(), { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `TMDB API returned status ${res.status}: ${text.slice(0, 200)}`,
    );
  }

  return (await res.json()) as T;
}

export const fetchSearchResults = internalAction({
  args: { query: v.string(), workId: v.string() },
  handler: async (ctx, args) => {
    const encodedQuery = encodeURIComponent(args.query);
    const data = await tmdbFetch<TmdbSearchTvResponse>(
      `/search/tv?query=${encodedQuery}&include_adult=false`,
    );

    const results = (data.results ?? []).map((r) => ({
      tmdbId: r.id,
      name: r.name,
      overview: r.overview,
      posterPath: r.poster_path,
      firstAirDate: r.first_air_date,
    }));

    await ctx.runMutation(internal.tmdb.saveWorkResult, {
      result: results,
      workId: args.workId,
    });
  },
});

export const searchShows = action({
  args: { query: v.string() },
  handler: async (ctx, args): Promise<{ workId: string }> => {
    const trimmedQuery = args.query.trim();

    if (trimmedQuery.length < 2) return { workId: "" };

    const workId = await enqueueWork(
      ctx,
      internal.tmdb.fetchSearchResults,
      "searchShows",
      { query: trimmedQuery },
      { query: trimmedQuery },
    );

    return { workId };
  },
});

export const searchShowsResult = query({
  args: { workId: v.string() },
  handler: async (ctx, args) => {
    const workResult = await ctx.db
      .query("workPoolResults")
      .withIndex("workId", (q) => q.eq("workId", args.workId))
      .first();

    if (!workResult) return null;

    return {
      workId: args.workId,
      error: workResult.error,
      status: workResult.status,
      result: workResult.result as SearchResult[] | undefined,
    };
  },
});

export const fetchShowDetails = internalAction({
  args: { tmdbId: v.number(), showId: v.id("shows"), workId: v.string() },
  handler: async (ctx, args) => {
    const tv = await tmdbFetch<TmdbTvDetails>(`/tv/${args.tmdbId}`);

    const seasonNumbers = (tv.seasons ?? [])
      .map((season) => season.season_number)
      .filter((seasonNumber) => Number.isFinite(seasonNumber));

    await ctx.runMutation(internal.tmdb.saveWorkResult, {
      workId: args.workId,
      result: {
        name: tv.name,
        seasonNumbers,
        overview: tv.overview,
        posterPath: tv.poster_path,
      },
    });
  },
});

export const fetchShowCredits = internalAction({
  args: { tmdbId: v.number(), showId: v.id("shows"), workId: v.string() },
  handler: async (ctx, args) => {
    const credits = await tmdbFetch<TmdbTvCredits>(
      `/tv/${args.tmdbId}/credits`,
    );

    const castCredits = (credits.cast ?? []).map((cast) => ({
      personName: cast.name,
      personTmdbId: cast.id,
      orderIndex: cast.order,
      character: cast.character ?? undefined,
      profilePath: cast.profile_path ?? undefined,
    }));

    const crewCredits = (credits.crew ?? []).map((crew) => ({
      job: crew.job ?? undefined,
      personTmdbId: crew.id,
      personName: crew.name,
      department: crew.department ?? undefined,
      profilePath: crew.profile_path ?? undefined,
    }));

    await ctx.runMutation(internal.tmdb.saveWorkResult, {
      workId: args.workId,
      result: { castCredits, crewCredits },
    });
  },
});

export const fetchSeasonDetails = internalAction({
  args: {
    tmdbId: v.number(),
    workId: v.string(),
    seasonNumber: v.number(),
    showId: v.id("shows"),
  },
  handler: async (ctx, args) => {
    const season = await tmdbFetch<TmdbTvSeasonDetails>(
      `/tv/${args.tmdbId}/season/${args.seasonNumber}`,
    );

    const episodes = (season.episodes ?? []).map((episode) => ({
      name: episode.name,
      runtime: episode.runtime ?? undefined,
      airDate: episode.air_date ?? undefined,
      overview: episode.overview ?? undefined,
      stillPath: episode.still_path ?? undefined,
      episodeNumber: episode.episode_number,
    }));

    await ctx.runMutation(internal.tmdb.saveWorkResult, {
      workId: args.workId,
      result: {
        episodes,
        airDate: season.air_date ?? undefined,
        overview: season.overview ?? undefined,
        posterPath: season.poster_path ?? undefined,
        seasonNumber: season.season_number,
        name: season.name ?? `Season ${season.season_number}`,
        episodeCount:
          typeof season.episode_count === "number"
            ? season.episode_count
            : episodes.length,
      },
    });
  },
});

export const saveWorkResult = internalMutation({
  args: {
    workId: v.string(),
    result: v.optional(v.any()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workResult = await ctx.db
      .query("workPoolResults")
      .withIndex("workId", (q) => q.eq("workId", args.workId))
      .first();

    if (!workResult)
      throw new Error(`Work result not found for workId: ${args.workId}`);

    await ctx.db.patch(workResult._id, {
      error: args.error,
      status: "complete",
      result: args.result,
    });
  },
});

export const createShowRecord = internalMutation({
  args: {
    name: v.string(),
    tmdbId: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingShow = await ctx.db
      .query("shows")
      .withIndex("tmdbId", (q) => q.eq("tmdbId", args.tmdbId))
      .first();

    let showId: Id<"shows">;
    let alreadyExists = false;

    if (existingShow) {
      showId = existingShow._id;
      alreadyExists = true;
    } else {
      showId = await ctx.db.insert("shows", {
        name: args.name,
        tmdbId: args.tmdbId,
      });
    }

    const existingUserShow = await ctx.db
      .query("userShows")
      .withIndex("userIdShowId", (q) =>
        q.eq("userId", args.userId).eq("showId", showId),
      )
      .first();

    if (!existingUserShow)
      await ctx.db.insert("userShows", { showId, userId: args.userId });

    return { showId, alreadyExists };
  },
});

export const createPendingWorkResult = internalMutation({
  args: {
    workId: v.string(),
    jobType: v.string(),
    poolName: v.string(),
    context: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("workPoolResults", {
      status: "pending",
      workId: args.workId,
      jobType: args.jobType,
      context: args.context,
      poolName: args.poolName,
    });
  },
});

export const getWorkResultStatus = internalQuery({
  args: { workId: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("workPoolResults")
      .withIndex("workId", (q) => q.eq("workId", args.workId))
      .first();
    return result?.status ?? "pending";
  },
});

export const getWorkResult = internalQuery({
  args: { workId: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("workPoolResults")
      .withIndex("workId", (q) => q.eq("workId", args.workId))
      .first();
    return result;
  },
});

export const getAuthenticatedUserId = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await getAuthUserId(ctx);
  },
});

export const saveShowDataFromResults = internalMutation({
  args: {
    showId: v.id("shows"),
    workIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const workResults = await Promise.all(
      args.workIds.map((workId) =>
        ctx.db
          .query("workPoolResults")
          .withIndex("workId", (q) => q.eq("workId", workId))
          .first(),
      ),
    );

    let showDetails: {
      name: string;
      overview?: string;
      posterPath?: string | null;
    } | null = null;
    let castCredits: Array<{
      personName: string;
      personTmdbId: number;
      orderIndex?: number;
      character?: string;
      profilePath?: string;
    }> = [];
    let crewCredits: Array<{
      personTmdbId: number;
      personName: string;
      job?: string;
      department?: string;
      profilePath?: string;
    }> = [];
    const seasons: Array<{
      seasonNumber: number;
      name: string;
      overview?: string;
      posterPath?: string;
      episodeCount?: number;
      airDate?: string;
      episodes: Array<{
        name: string;
        episodeNumber: number;
        runtime?: number;
        airDate?: string;
        overview?: string;
        stillPath?: string;
      }>;
    }> = [];

    for (const workResult of workResults) {
      if (!workResult || !workResult.result) continue;

      if (workResult.jobType === "showDetails") {
        showDetails = workResult.result;
      } else if (workResult.jobType === "credits") {
        castCredits = workResult.result.castCredits ?? [];
        crewCredits = workResult.result.crewCredits ?? [];
      } else if (workResult.jobType === "season") {
        seasons.push(workResult.result);
      }
    }

    const showId = args.showId;

    if (showDetails) {
      await ctx.db.patch(showId, {
        name: showDetails.name,
        overview: showDetails.overview,
        posterPath: showDetails.posterPath ?? undefined,
      });
    }

    await deleteRelatedRecords(ctx, "credits", "showId", showId);

    const existingSeasons = await ctx.db
      .query("seasons")
      .withIndex("showId", (q) => q.eq("showId", showId))
      .collect();
    await Promise.all(
      existingSeasons.map(async (season) => {
        await deleteRelatedRecords(ctx, "episodes", "seasonId", season._id);
        await ctx.db.delete(season._id);
      }),
    );

    for (const season of seasons) {
      const seasonId = await ctx.db.insert("seasons", {
        showId,
        name: season.name,
        airDate: season.airDate,
        overview: season.overview,
        posterPath: season.posterPath,
        seasonNumber: season.seasonNumber,
        episodeCount: season.episodeCount,
      });

      for (const episode of season.episodes) {
        await ctx.db.insert("episodes", {
          seasonId,
          name: episode.name,
          airDate: episode.airDate,
          runtime: episode.runtime,
          overview: episode.overview,
          stillPath: episode.stillPath,
          episodeNumber: episode.episodeNumber,
        });
      }
    }

    for (const castCredit of castCredits)
      await insertCredit(ctx, showId, castCredit, "cast");

    for (const crewCredit of crewCredits)
      await insertCredit(ctx, showId, crewCredit, "crew");
  },
});

export const listMyShows = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const userShows = await ctx.db
      .query("userShows")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    const myShows = (
      await Promise.all(
        userShows.map(async (userShow) => {
          const show = await ctx.db.get(userShow.showId);
          if (!show) return null;

          return {
            _id: show._id,
            name: show.name,
            tmdbId: show.tmdbId,
            overview: show.overview,
            posterPath: show.posterPath,
            addedAt: userShow._creationTime,
          };
        }),
      )
    ).filter((show) => show !== null);

    return myShows.sort((a, b) => b.addedAt - a.addedAt);
  },
});

export const getMyShowDetails = query({
  args: { showId: v.id("shows") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const userShow = await ctx.db
      .query("userShows")
      .withIndex("userIdShowId", (q) =>
        q.eq("userId", userId).eq("showId", args.showId),
      )
      .first();
    if (!userShow) return null;

    const show = await ctx.db.get(args.showId);
    if (!show) return null;

    const seasons = await ctx.db
      .query("seasons")
      .withIndex("showId", (q) => q.eq("showId", show._id))
      .collect();

    const seasonsWithEpisodes = await Promise.all(
      seasons
        .slice()
        .sort((a, b) => a.seasonNumber - b.seasonNumber)
        .map(async (season) => {
          const episodes = await ctx.db
            .query("episodes")
            .withIndex("seasonId", (q) => q.eq("seasonId", season._id))
            .collect();

          return {
            id: season._id,
            name: season.name,
            airDate: season.airDate,
            overview: season.overview,
            posterPath: season.posterPath,
            episodeCount: season.episodeCount,
            seasonNumber: season.seasonNumber,
            episodes: episodes
              .slice()
              .sort((a, b) => a.episodeNumber - b.episodeNumber)
              .map((episode) => ({
                id: episode._id,
                name: episode.name,
                airDate: episode.airDate,
                runtime: episode.runtime,
                overview: episode.overview,
                stillPath: episode.stillPath,
                episodeNumber: episode.episodeNumber,
              })),
          };
        }),
    );

    const credits = await ctx.db
      .query("credits")
      .withIndex("showId", (q) => q.eq("showId", show._id))
      .collect();

    const uniquePersonIds = [...new Set(credits.map((c) => c.personId))];
    const people = await Promise.all(
      uniquePersonIds.map((id) => ctx.db.get(id)),
    );
    const peopleById = new Map(
      people.filter((p) => p !== null).map((p) => [p!._id, p!]),
    );

    const getPersonData = (personId: Id<"persons">) => {
      const person = peopleById.get(personId);
      return person
        ? {
            id: personId,
            name: person.name,
            profilePath: person.profilePath,
          }
        : null;
    };

    const cast = credits
      .filter((credit) => credit.kind === "cast")
      .map((credit) => ({
        id: credit._id,
        character: credit.character,
        orderIndex: credit.orderIndex,
        person: getPersonData(credit.personId),
      }))
      .sort(
        (a, b) =>
          (a.orderIndex ?? Number.MAX_SAFE_INTEGER) -
          (b.orderIndex ?? Number.MAX_SAFE_INTEGER),
      );

    const crew = credits
      .filter((credit) => credit.kind === "crew")
      .map((credit) => ({
        id: credit._id,
        job: credit.job,
        department: credit.department,
        person: getPersonData(credit.personId),
      }));

    return {
      cast,
      crew,
      seasons: seasonsWithEpisodes,
      show: {
        id: show._id,
        name: show.name,
        tmdbId: show.tmdbId,
        overview: show.overview,
        posterPath: show.posterPath,
        addedAt: userShow._creationTime,
      },
    };
  },
});

export const addShowFromTmdb = action({
  args: { name: v.string(), tmdbId: v.number() },
  handler: async (
    ctx,
    args,
  ): Promise<{ ok: boolean; tmdbId: number; showId: Id<"shows"> }> => {
    const userId = await ctx.runQuery(internal.tmdb.getAuthenticatedUserId, {});
    if (!userId) throw new Error("You must be signed in to add a show");

    const { showId, alreadyExists } = await ctx.runMutation(
      internal.tmdb.createShowRecord,
      { name: args.name, tmdbId: args.tmdbId, userId },
    );

    if (alreadyExists) return { ok: true, tmdbId: args.tmdbId, showId };

    const allWorkIds: string[] = [];

    const showDetailsWorkId = await enqueueWork(
      ctx,
      internal.tmdb.fetchShowDetails,
      "showDetails",
      { tmdbId: args.tmdbId, showId },
    );
    allWorkIds.push(showDetailsWorkId);

    await pollWorkResults(ctx, showDetailsWorkId);

    const showDetailsResult = await ctx.runQuery(internal.tmdb.getWorkResult, {
      workId: showDetailsWorkId,
    });

    const seasonNumbers: number[] =
      showDetailsResult?.result?.seasonNumbers ?? [];

    const creditsWorkId = await enqueueWork(
      ctx,
      internal.tmdb.fetchShowCredits,
      "credits",
      { tmdbId: args.tmdbId, showId },
    );
    allWorkIds.push(creditsWorkId);

    for (const seasonNumber of seasonNumbers) {
      const seasonWorkId = await enqueueWork(
        ctx,
        internal.tmdb.fetchSeasonDetails,
        "season",
        { tmdbId: args.tmdbId, showId, seasonNumber },
        { seasonNumber },
      );
      allWorkIds.push(seasonWorkId);
    }

    const remainingWorkIds = allWorkIds.filter(
      (id) => id !== showDetailsWorkId,
    );
    await pollWorkResults(ctx, remainingWorkIds);

    await ctx.runMutation(internal.tmdb.saveShowDataFromResults, {
      showId,
      workIds: allWorkIds,
    });

    return { ok: true, tmdbId: args.tmdbId, showId };
  },
});

async function upsertPerson(
  ctx: MutationCtx,
  person: { name: string; tmdbPersonId: number; profilePath?: string },
) {
  const existing = await ctx.db
    .query("persons")
    .withIndex("tmdbPersonId", (q) => q.eq("tmdbPersonId", person.tmdbPersonId))
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, {
      name: person.name,
      profilePath: person.profilePath,
    });
    return existing._id;
  }

  return await ctx.db.insert("persons", {
    name: person.name,
    profilePath: person.profilePath,
    tmdbPersonId: person.tmdbPersonId,
  });
}

async function deleteRelatedRecords(
  ctx: MutationCtx,
  table: string,
  indexName: string,
  indexValue: any,
) {
  const records = await ctx.db
    .query(table as any)
    .withIndex(indexName, (q) => q.eq(indexName, indexValue))
    .collect();
  await Promise.all(records.map((record) => ctx.db.delete(record._id)));
}

async function insertCredit(
  ctx: MutationCtx,
  showId: Id<"shows">,
  credit: any,
  kind: "cast" | "crew",
) {
  const personId = await upsertPerson(ctx, {
    name: credit.personName,
    profilePath: credit.profilePath,
    tmdbPersonId: credit.personTmdbId,
  });

  await ctx.db.insert("credits", {
    kind,
    showId,
    personId,
    ...(kind === "cast"
      ? { character: credit.character, orderIndex: credit.orderIndex }
      : { job: credit.job, department: credit.department }),
  });
}
