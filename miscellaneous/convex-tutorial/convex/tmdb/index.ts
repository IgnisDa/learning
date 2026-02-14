import { getAuthUserId } from "@convex-dev/auth/server";
import { WorkflowManager, type WorkflowId } from "@convex-dev/workflow";
import { vOnCompleteArgs, Workpool } from "@convex-dev/workpool";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalMutation, query } from "../_generated/server";

export const tmdbWorkPool = new Workpool(components.tmdbWorkpool, {
  maxParallelism: 5,
});

export const tmdbWorkflow = new WorkflowManager(components.workflow, {
  workpoolOptions: { maxParallelism: 5 },
});

export const TMDB_RETRY_BEHAVIOR = {
  base: 2,
  maxAttempts: 5,
  initialBackoffMs: 400,
} as const;

export const SEARCH_RESULTS_EVENT_NAME = "tmdb.search.results";
export const SHOW_DETAILS_EVENT_NAME = "tmdb.import.showDetails";
export const SHOW_CREDITS_EVENT_NAME = "tmdb.import.credits";

export const seasonImportEventName = (seasonNumber: number) =>
  `tmdb.import.season.${seasonNumber}`;

const workCompletionContextValidator = v.object({
  workflowId: v.string(),
  eventName: v.string(),
});

export async function tmdbFetch<T>(path: string): Promise<T> {
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
      error,
      workflowId,
      name: args.context.eventName,
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
