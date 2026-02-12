import { getAuthUserId } from "@convex-dev/auth/server";
import { vOnCompleteArgs, Workpool } from "@convex-dev/workpool";
import { WorkflowManager, type WorkflowId } from "@convex-dev/workflow";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
  type MutationCtx,
} from "./_generated/server";

const tmdbWorkPool = new Workpool(components.tmdbWorkpool, {
  maxParallelism: 5,
});

const tmdbWorkflow = new WorkflowManager(components.workflow, {
  workpoolOptions: { maxParallelism: 5 },
});

const TMDB_RETRY_BEHAVIOR = {
  base: 2,
  maxAttempts: 5,
  initialBackoffMs: 400,
} as const;

const SEARCH_RESULTS_EVENT_NAME = "tmdb.search.results";
const SHOW_DETAILS_EVENT_NAME = "tmdb.import.showDetails";
const SHOW_CREDITS_EVENT_NAME = "tmdb.import.credits";

const seasonImportEventName = (seasonNumber: number) =>
  `tmdb.import.season.${seasonNumber}`;

const searchResultValidator = v.object({
  name: v.string(),
  tmdbId: v.number(),
  overview: v.string(),
  firstAirDate: v.optional(v.string()),
  posterPath: v.union(v.string(), v.null()),
});

const searchResultsValidator = v.array(searchResultValidator);

const showDetailsValidator = v.object({
  name: v.string(),
  seasonNumbers: v.array(v.number()),
  overview: v.optional(v.string()),
  posterPath: v.optional(v.union(v.string(), v.null())),
});

const workCompletionContextValidator = v.object({
  workflowId: v.string(),
  eventName: v.string(),
});

const castCreditValidator = v.object({
  personName: v.string(),
  personTmdbId: v.number(),
  orderIndex: v.optional(v.number()),
  character: v.optional(v.string()),
  profilePath: v.optional(v.string()),
});

const crewCreditValidator = v.object({
  personTmdbId: v.number(),
  personName: v.string(),
  job: v.optional(v.string()),
  department: v.optional(v.string()),
  profilePath: v.optional(v.string()),
});

const episodeValidator = v.object({
  name: v.string(),
  episodeNumber: v.number(),
  runtime: v.optional(v.number()),
  airDate: v.optional(v.string()),
  overview: v.optional(v.string()),
  stillPath: v.optional(v.string()),
});

const seasonDetailsValidator = v.object({
  seasonNumber: v.number(),
  name: v.string(),
  overview: v.optional(v.string()),
  posterPath: v.optional(v.string()),
  episodeCount: v.optional(v.number()),
  airDate: v.optional(v.string()),
  episodes: v.array(episodeValidator),
});

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
  args: { query: v.string() },
  handler: async (_ctx, args): Promise<SearchResult[]> => {
    const encodedQuery = encodeURIComponent(args.query);
    const data = await tmdbFetch<TmdbSearchTvResponse>(
      `/search/tv?query=${encodedQuery}&include_adult=false`,
    );

    return (data.results ?? []).map((r) => ({
      tmdbId: r.id,
      name: r.name,
      overview: r.overview,
      posterPath: r.poster_path,
      firstAirDate: r.first_air_date,
    }));
  },
});

export const fetchShowDetails = internalAction({
  args: { tmdbId: v.number() },
  handler: async (_ctx, args) => {
    const tv = await tmdbFetch<TmdbTvDetails>(`/tv/${args.tmdbId}`);

    const seasonNumbers = (tv.seasons ?? [])
      .map((season) => season.season_number)
      .filter((seasonNumber) => Number.isFinite(seasonNumber));

    return {
      name: tv.name,
      seasonNumbers,
      overview: tv.overview,
      posterPath: tv.poster_path,
    };
  },
});

export const fetchShowCredits = internalAction({
  args: { tmdbId: v.number(), showId: v.id("shows") },
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

    await ctx.runMutation(internal.tmdb.replaceShowCredits, {
      castCredits,
      crewCredits,
      showId: args.showId,
    });

    return { castCount: castCredits.length, crewCount: crewCredits.length };
  },
});

export const fetchSeasonDetails = internalAction({
  args: {
    tmdbId: v.number(),
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

    await ctx.runMutation(internal.tmdb.replaceSeasonWithEpisodes, {
      showId: args.showId,
      season: {
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

    return {
      episodeCount: episodes.length,
      seasonNumber: season.season_number,
    };
  },
});

export const handleWorkpoolCompletion = internalMutation({
  args: vOnCompleteArgs(workCompletionContextValidator),
  handler: async (ctx, args) => {
    const workflowId = args.context.workflowId as WorkflowId;

    if (args.result.kind === "success") {
      await tmdbWorkflow.sendEvent(ctx, {
        workflowId,
        name: args.context.eventName,
        value: args.result.returnValue,
      });
      return;
    }

    const error =
      args.result.kind === "failed"
        ? args.result.error
        : `TMDB work ${args.workId} was canceled`;

    await tmdbWorkflow.sendEvent(ctx, {
      workflowId,
      name: args.context.eventName,
      error,
    });
  },
});

export const enqueueSearchShowsJob = internalMutation({
  args: {
    query: v.string(),
    workflowId: v.string(),
    eventName: v.string(),
  },
  handler: async (ctx, args) => {
    await tmdbWorkPool.enqueueAction(
      ctx,
      internal.tmdb.fetchSearchResults,
      { query: args.query },
      {
        retry: TMDB_RETRY_BEHAVIOR,
        onComplete: internal.tmdb.handleWorkpoolCompletion,
        context: {
          workflowId: args.workflowId,
          eventName: args.eventName,
        },
      },
    );
  },
});

export const enqueueShowDetailsJob = internalMutation({
  args: {
    tmdbId: v.number(),
    workflowId: v.string(),
    eventName: v.string(),
  },
  handler: async (ctx, args) => {
    await tmdbWorkPool.enqueueAction(
      ctx,
      internal.tmdb.fetchShowDetails,
      { tmdbId: args.tmdbId },
      {
        retry: TMDB_RETRY_BEHAVIOR,
        onComplete: internal.tmdb.handleWorkpoolCompletion,
        context: {
          workflowId: args.workflowId,
          eventName: args.eventName,
        },
      },
    );
  },
});

export const enqueueShowCreditsJob = internalMutation({
  args: {
    tmdbId: v.number(),
    showId: v.id("shows"),
    workflowId: v.string(),
    eventName: v.string(),
  },
  handler: async (ctx, args) => {
    await tmdbWorkPool.enqueueAction(
      ctx,
      internal.tmdb.fetchShowCredits,
      {
        tmdbId: args.tmdbId,
        showId: args.showId,
      },
      {
        retry: TMDB_RETRY_BEHAVIOR,
        onComplete: internal.tmdb.handleWorkpoolCompletion,
        context: {
          workflowId: args.workflowId,
          eventName: args.eventName,
        },
      },
    );
  },
});

export const enqueueSeasonJob = internalMutation({
  args: {
    tmdbId: v.number(),
    seasonNumber: v.number(),
    showId: v.id("shows"),
    workflowId: v.string(),
    eventName: v.string(),
  },
  handler: async (ctx, args) => {
    await tmdbWorkPool.enqueueAction(
      ctx,
      internal.tmdb.fetchSeasonDetails,
      {
        tmdbId: args.tmdbId,
        seasonNumber: args.seasonNumber,
        showId: args.showId,
      },
      {
        retry: TMDB_RETRY_BEHAVIOR,
        onComplete: internal.tmdb.handleWorkpoolCompletion,
        context: {
          workflowId: args.workflowId,
          eventName: args.eventName,
        },
      },
    );
  },
});

export const searchShowsWorkflow = tmdbWorkflow.define({
  args: { query: v.string() },
  returns: searchResultsValidator,
  handler: async (ctx, args): Promise<SearchResult[]> => {
    await ctx.runMutation(internal.tmdb.enqueueSearchShowsJob, {
      query: args.query,
      workflowId: ctx.workflowId,
      eventName: SEARCH_RESULTS_EVENT_NAME,
    });

    return await ctx.awaitEvent({
      name: SEARCH_RESULTS_EVENT_NAME,
      validator: searchResultsValidator,
    });
  },
});

export const importShowWorkflow = tmdbWorkflow.define({
  args: {
    tmdbId: v.number(),
    showId: v.id("shows"),
  },
  returns: v.object({ seasonCount: v.number() }),
  handler: async (ctx, args): Promise<{ seasonCount: number }> => {
    await ctx.runMutation(internal.tmdb.enqueueShowDetailsJob, {
      tmdbId: args.tmdbId,
      workflowId: ctx.workflowId,
      eventName: SHOW_DETAILS_EVENT_NAME,
    });

    const showDetails = await ctx.awaitEvent({
      name: SHOW_DETAILS_EVENT_NAME,
      validator: showDetailsValidator,
    });

    const seasonNumbers = [...new Set(showDetails.seasonNumbers)]
      .filter((seasonNumber) => Number.isFinite(seasonNumber))
      .sort((a, b) => a - b);

    await ctx.runMutation(internal.tmdb.patchShowMetadata, {
      showId: args.showId,
      name: showDetails.name,
      overview: showDetails.overview,
      posterPath: showDetails.posterPath ?? undefined,
    });

    await Promise.all([
      ctx.runMutation(internal.tmdb.enqueueShowCreditsJob, {
        tmdbId: args.tmdbId,
        showId: args.showId,
        workflowId: ctx.workflowId,
        eventName: SHOW_CREDITS_EVENT_NAME,
      }),
      ...seasonNumbers.map((seasonNumber) =>
        ctx.runMutation(internal.tmdb.enqueueSeasonJob, {
          tmdbId: args.tmdbId,
          seasonNumber,
          showId: args.showId,
          workflowId: ctx.workflowId,
          eventName: seasonImportEventName(seasonNumber),
        }),
      ),
    ]);

    await Promise.all([
      ctx.awaitEvent({ name: SHOW_CREDITS_EVENT_NAME }),
      ...seasonNumbers.map((seasonNumber) =>
        ctx.awaitEvent({ name: seasonImportEventName(seasonNumber) }),
      ),
    ]);

    await ctx.runMutation(internal.tmdb.deleteStaleSeasons, {
      showId: args.showId,
      keepSeasonNumbers: seasonNumbers,
    });

    return { seasonCount: seasonNumbers.length };
  },
});

export const searchShows = action({
  args: { query: v.string() },
  handler: async (ctx, args): Promise<{ workId: string }> => {
    const trimmedQuery = args.query.trim();

    if (trimmedQuery.length < 2) return { workId: "" };

    const workflowId = await tmdbWorkflow.start(
      ctx,
      internal.tmdb.searchShowsWorkflow,
      { query: trimmedQuery },
      { startAsync: true },
    );

    return { workId: workflowId };
  },
});

export const searchShowsResult = query({
  args: { workId: v.string() },
  handler: async (ctx, args) => {
    if (!args.workId) return null;

    try {
      const status = await tmdbWorkflow.status(ctx, args.workId as WorkflowId);

      if (status.type === "inProgress") {
        return {
          workId: args.workId,
          error: undefined,
          result: undefined,
          status: "pending" as const,
        };
      }

      if (status.type === "completed") {
        return {
          workId: args.workId,
          error: undefined,
          status: "complete" as const,
          result: status.result as SearchResult[] | undefined,
        };
      }

      return {
        workId: args.workId,
        result: undefined,
        status: "complete" as const,
        error:
          status.type === "failed"
            ? status.error
            : "Search workflow was canceled",
      };
    } catch {
      return null;
    }
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

export const patchShowMetadata = internalMutation({
  args: {
    showId: v.id("shows"),
    name: v.string(),
    overview: v.optional(v.string()),
    posterPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.showId, {
      name: args.name,
      overview: args.overview,
      posterPath: args.posterPath,
    });
  },
});

export const replaceShowCredits = internalMutation({
  args: {
    showId: v.id("shows"),
    castCredits: v.array(castCreditValidator),
    crewCredits: v.array(crewCreditValidator),
  },
  handler: async (ctx, args) => {
    await deleteRelatedRecords(ctx, "credits", "showId", args.showId);

    for (const castCredit of args.castCredits)
      await insertCredit(ctx, args.showId, castCredit, "cast");

    for (const crewCredit of args.crewCredits)
      await insertCredit(ctx, args.showId, crewCredit, "crew");
  },
});

export const replaceSeasonWithEpisodes = internalMutation({
  args: {
    showId: v.id("shows"),
    season: seasonDetailsValidator,
  },
  handler: async (ctx, args) => {
    const existingSeason = await ctx.db
      .query("seasons")
      .withIndex("showIdSeasonNumber", (q) =>
        q
          .eq("showId", args.showId)
          .eq("seasonNumber", args.season.seasonNumber),
      )
      .first();

    if (existingSeason) {
      await deleteRelatedRecords(
        ctx,
        "episodes",
        "seasonId",
        existingSeason._id,
      );
      await ctx.db.delete(existingSeason._id);
    }

    const seasonId = await ctx.db.insert("seasons", {
      name: args.season.name,
      showId: args.showId,
      airDate: args.season.airDate,
      overview: args.season.overview,
      posterPath: args.season.posterPath,
      seasonNumber: args.season.seasonNumber,
      episodeCount: args.season.episodeCount,
    });

    for (const episode of args.season.episodes) {
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
  },
});

export const deleteStaleSeasons = internalMutation({
  args: {
    showId: v.id("shows"),
    keepSeasonNumbers: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const keepSeasonNumbers = new Set(args.keepSeasonNumbers);
    const existingSeasons = await ctx.db
      .query("seasons")
      .withIndex("showId", (q) => q.eq("showId", args.showId))
      .collect();

    for (const season of existingSeasons) {
      if (keepSeasonNumbers.has(season.seasonNumber)) continue;
      await deleteRelatedRecords(ctx, "episodes", "seasonId", season._id);
      await ctx.db.delete(season._id);
    }
  },
});

export const getAuthenticatedUserId = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await getAuthUserId(ctx);
  },
});

export const addShowFromTmdb = action({
  args: { name: v.string(), tmdbId: v.number() },
  handler: async (
    ctx,
    args,
  ): Promise<{
    ok: boolean;
    tmdbId: number;
    showId: Id<"shows">;
    workflowId: string | null;
  }> => {
    const userId = await ctx.runQuery(internal.tmdb.getAuthenticatedUserId, {});
    if (!userId) throw new Error("You must be signed in to add a show");

    const { showId, alreadyExists } = await ctx.runMutation(
      internal.tmdb.createShowRecord,
      { name: args.name, tmdbId: args.tmdbId, userId },
    );

    if (alreadyExists)
      return { ok: true, tmdbId: args.tmdbId, showId, workflowId: null };

    const workflowId = await tmdbWorkflow.start(
      ctx,
      internal.tmdb.importShowWorkflow,
      {
        tmdbId: args.tmdbId,
        showId,
      },
      { startAsync: true },
    );

    return { ok: true, tmdbId: args.tmdbId, showId, workflowId };
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
