import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  type MutationCtx,
} from "../_generated/server";
import {
  SHOW_CREDITS_EVENT_NAME,
  SHOW_DETAILS_EVENT_NAME,
  TMDB_RETRY_BEHAVIOR,
  seasonImportEventName,
  tmdbFetch,
  tmdbWorkPool,
  tmdbWorkflow,
} from "./index";

const showDetailsValidator = v.object({
  name: v.string(),
  seasonNumbers: v.array(v.number()),
  overview: v.optional(v.string()),
  posterPath: v.optional(v.union(v.string(), v.null())),
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

    await ctx.runMutation(internal.tmdb.details.replaceShowCredits, {
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

    await ctx.runMutation(internal.tmdb.details.replaceSeasonWithEpisodes, {
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

export const enqueueShowDetailsJob = internalMutation({
  args: {
    tmdbId: v.number(),
    workflowId: v.string(),
    eventName: v.string(),
  },
  handler: async (ctx, args) => {
    await tmdbWorkPool.enqueueAction(
      ctx,
      internal.tmdb.details.fetchShowDetails,
      { tmdbId: args.tmdbId },
      {
        retry: TMDB_RETRY_BEHAVIOR,
        onComplete: internal.tmdb.index.handleWorkpoolCompletion,
        context: { eventName: args.eventName, workflowId: args.workflowId },
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
      internal.tmdb.details.fetchShowCredits,
      { tmdbId: args.tmdbId, showId: args.showId },
      {
        retry: TMDB_RETRY_BEHAVIOR,
        onComplete: internal.tmdb.index.handleWorkpoolCompletion,
        context: { eventName: args.eventName, workflowId: args.workflowId },
      },
    );
  },
});

export const enqueueSeasonJob = internalMutation({
  args: {
    tmdbId: v.number(),
    eventName: v.string(),
    workflowId: v.string(),
    seasonNumber: v.number(),
    showId: v.id("shows"),
  },
  handler: async (ctx, args) => {
    await tmdbWorkPool.enqueueAction(
      ctx,
      internal.tmdb.details.fetchSeasonDetails,
      {
        tmdbId: args.tmdbId,
        showId: args.showId,
        seasonNumber: args.seasonNumber,
      },
      {
        retry: TMDB_RETRY_BEHAVIOR,
        onComplete: internal.tmdb.index.handleWorkpoolCompletion,
        context: { eventName: args.eventName, workflowId: args.workflowId },
      },
    );
  },
});

export const importShowWorkflow = tmdbWorkflow.define({
  args: {
    tmdbId: v.number(),
    showId: v.id("shows"),
  },
  returns: v.object({ seasonCount: v.number() }),
  handler: async (ctx, args): Promise<{ seasonCount: number }> => {
    await ctx.runMutation(internal.tmdb.details.enqueueShowDetailsJob, {
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

    await ctx.runMutation(internal.tmdb.details.patchShowMetadata, {
      showId: args.showId,
      name: showDetails.name,
      overview: showDetails.overview,
      posterPath: showDetails.posterPath ?? undefined,
    });

    await Promise.all([
      ctx.runMutation(internal.tmdb.details.enqueueShowCreditsJob, {
        tmdbId: args.tmdbId,
        showId: args.showId,
        workflowId: ctx.workflowId,
        eventName: SHOW_CREDITS_EVENT_NAME,
      }),
      ...seasonNumbers.map((seasonNumber) =>
        ctx.runMutation(internal.tmdb.details.enqueueSeasonJob, {
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

    await ctx.runMutation(internal.tmdb.details.deleteStaleSeasons, {
      showId: args.showId,
      keepSeasonNumbers: seasonNumbers,
    });

    return { seasonCount: seasonNumbers.length };
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
    const userId = await ctx.runQuery(
      internal.tmdb.index.getAuthenticatedUserId,
      {},
    );
    if (!userId) throw new Error("You must be signed in to add a show");

    const { showId, alreadyExists } = await ctx.runMutation(
      internal.tmdb.index.createShowRecord,
      { name: args.name, tmdbId: args.tmdbId, userId },
    );

    if (alreadyExists)
      return { ok: true, tmdbId: args.tmdbId, showId, workflowId: null };

    const workflowId = await tmdbWorkflow.start(
      ctx,
      internal.tmdb.details.importShowWorkflow,
      { showId, tmdbId: args.tmdbId },
      { startAsync: true },
    );

    return { ok: true, tmdbId: args.tmdbId, showId, workflowId };
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
