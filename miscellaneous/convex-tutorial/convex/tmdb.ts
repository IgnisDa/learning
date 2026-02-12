import { getAuthUserId } from "@convex-dev/auth/server";
import { Workpool } from "@convex-dev/workpool";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import {
  action,
  ActionCtx,
  internalAction,
  internalMutation,
  internalQuery,
  query,
  type MutationCtx,
} from "./_generated/server";

const tmdbWorkpool = new Workpool(components.tmdbWorkpool, {
  maxParallelism: 5,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function enqueueWork<T extends Record<string, any>>(
  ctx: ActionCtx,
  action: any,
  jobType: string,
  args: T,
  context?: any,
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
  workIds: string | string[],
  intervalMs = 500,
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
      workId: args.workId,
      result: results,
    });
  },
});

export const searchShows = action({
  args: { query: v.string() },
  handler: async (ctx, args): Promise<SearchResult[]> => {
    const trimmedQuery = args.query.trim();

    if (trimmedQuery.length < 2) return [];

    const workId = await enqueueWork(
      ctx,
      internal.tmdb.fetchSearchResults,
      "searchShows",
      { query: trimmedQuery },
      { query: trimmedQuery },
    );

    await pollWorkResults(ctx, workId, 100);

    const workResult = await ctx.runQuery(internal.tmdb.getWorkResult, {
      workId,
    });

    await ctx.runMutation(internal.tmdb.deleteWorkResult, { workId });

    return (workResult?.result as SearchResult[]) ?? [];
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
        overview: tv.overview,
        posterPath: tv.poster_path,
        seasonNumbers,
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
      orderIndex: cast.order ?? undefined,
      character: cast.character ?? undefined,
      profilePath: cast.profile_path ?? undefined,
    }));

    const crewCredits = (credits.crew ?? []).map((crew) => ({
      personTmdbId: crew.id,
      personName: crew.name,
      job: crew.job ?? undefined,
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
    showId: v.id("shows"),
    seasonNumber: v.number(),
    workId: v.string(),
  },
  handler: async (ctx, args) => {
    const season = await tmdbFetch<TmdbTvSeasonDetails>(
      `/tv/${args.tmdbId}/season/${args.seasonNumber}`,
    );

    const episodes = (season.episodes ?? []).map((episode) => ({
      name: episode.name,
      episodeNumber: episode.episode_number,
      runtime: episode.runtime ?? undefined,
      airDate: episode.air_date ?? undefined,
      overview: episode.overview ?? undefined,
      stillPath: episode.still_path ?? undefined,
    }));

    await ctx.runMutation(internal.tmdb.saveWorkResult, {
      workId: args.workId,
      result: {
        seasonNumber: season.season_number,
        airDate: season.air_date ?? undefined,
        overview: season.overview ?? undefined,
        posterPath: season.poster_path ?? undefined,
        name: season.name ?? `Season ${season.season_number}`,
        episodeCount:
          typeof season.episode_count === "number"
            ? season.episode_count
            : episodes.length,
        episodes,
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

    if (!workResult) {
      throw new Error(`Work result not found for workId: ${args.workId}`);
    }

    await ctx.db.patch(workResult._id, {
      status: "complete",
      result: args.result,
      error: args.error,
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

    if (!existingUserShow) {
      await ctx.db.insert("userShows", {
        showId,
        userId: args.userId,
      });
    }

    return { showId, alreadyExists };
  },
});

export const createPendingWorkResult = internalMutation({
  args: {
    workId: v.string(),
    poolName: v.string(),
    jobType: v.string(),
    context: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("workPoolResults", {
      workId: args.workId,
      poolName: args.poolName,
      jobType: args.jobType,
      status: "pending",
      context: args.context,
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

export const deleteWorkResult = internalMutation({
  args: { workId: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("workPoolResults")
      .withIndex("workId", (q) => q.eq("workId", args.workId))
      .first();
    if (result) {
      await ctx.db.delete(result._id);
    }
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
      args.workIds.map(async (workId) => {
        const result = await ctx.db
          .query("workPoolResults")
          .withIndex("workId", (q) => q.eq("workId", workId))
          .first();
        return result;
      }),
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

    const existingCredits = await ctx.db
      .query("credits")
      .withIndex("showId", (q) => q.eq("showId", showId))
      .collect();
    for (const credit of existingCredits) {
      await ctx.db.delete(credit._id);
    }

    const existingSeasons = await ctx.db
      .query("seasons")
      .withIndex("showId", (q) => q.eq("showId", showId))
      .collect();
    for (const season of existingSeasons) {
      const existingEpisodes = await ctx.db
        .query("episodes")
        .withIndex("seasonId", (q) => q.eq("seasonId", season._id))
        .collect();
      for (const episode of existingEpisodes) {
        await ctx.db.delete(episode._id);
      }
      await ctx.db.delete(season._id);
    }

    for (const season of seasons) {
      const seasonId = await ctx.db.insert("seasons", {
        showId,
        seasonNumber: season.seasonNumber,
        name: season.name,
        overview: season.overview,
        posterPath: season.posterPath,
        episodeCount: season.episodeCount,
        airDate: season.airDate,
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

    for (const castCredit of castCredits) {
      const personId = await upsertPerson(ctx, {
        name: castCredit.personName,
        profilePath: castCredit.profilePath,
        tmdbPersonId: castCredit.personTmdbId,
      });

      await ctx.db.insert("credits", {
        showId,
        personId,
        kind: "cast",
        character: castCredit.character,
        orderIndex: castCredit.orderIndex,
      });
    }

    for (const crewCredit of crewCredits) {
      const personId = await upsertPerson(ctx, {
        tmdbPersonId: crewCredit.personTmdbId,
        name: crewCredit.personName,
        profilePath: crewCredit.profilePath,
      });

      await ctx.db.insert("credits", {
        showId,
        personId,
        kind: "crew",
        job: crewCredit.job,
        department: crewCredit.department,
      });
    }

    for (const workResult of workResults) {
      if (workResult) {
        await ctx.db.delete(workResult._id);
      }
    }
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

    const myShows: Array<{
      name: string;
      tmdbId: number;
      _id: Id<"shows">;
      overview: string | undefined;
      posterPath: string | undefined;
      addedAt: number;
    }> = [];

    for (const userShow of userShows) {
      const show = await ctx.db.get(userShow.showId);
      if (!show) continue;

      myShows.push({
        _id: show._id,
        name: show.name,
        tmdbId: show.tmdbId,
        addedAt: userShow._creationTime,
        overview: show.overview,
        posterPath: show.posterPath,
      });
    }

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
            seasonNumber: season.seasonNumber,
            name: season.name,
            overview: season.overview,
            posterPath: season.posterPath,
            episodeCount: season.episodeCount,
            airDate: season.airDate,
            episodes: episodes
              .slice()
              .sort((a, b) => a.episodeNumber - b.episodeNumber)
              .map((episode) => ({
                id: episode._id,
                episodeNumber: episode.episodeNumber,
                name: episode.name,
                overview: episode.overview,
                stillPath: episode.stillPath,
                airDate: episode.airDate,
                runtime: episode.runtime,
              })),
          };
        }),
    );

    const credits = await ctx.db
      .query("credits")
      .withIndex("showId", (q) => q.eq("showId", show._id))
      .collect();

    const peopleById = new Map<Id<"persons">, Doc<"persons">>();
    await Promise.all(
      credits.map(async (credit) => {
        if (peopleById.has(credit.personId)) return;
        const person = await ctx.db.get(credit.personId);
        if (person) {
          peopleById.set(person._id, person);
        }
      }),
    );

    const cast = credits
      .filter((credit) => credit.kind === "cast")
      .map((credit) => ({
        id: credit._id,
        character: credit.character,
        orderIndex: credit.orderIndex,
        person: peopleById.get(credit.personId)
          ? {
              id: credit.personId,
              name: peopleById.get(credit.personId)!.name,
              profilePath: peopleById.get(credit.personId)!.profilePath,
            }
          : null,
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
        department: credit.department,
        job: credit.job,
        person: peopleById.get(credit.personId)
          ? {
              id: credit.personId,
              name: peopleById.get(credit.personId)!.name,
              profilePath: peopleById.get(credit.personId)!.profilePath,
            }
          : null,
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

    if (alreadyExists) {
      return { ok: true, tmdbId: args.tmdbId, showId };
    }

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
