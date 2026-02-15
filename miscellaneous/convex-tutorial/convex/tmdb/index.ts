import { WorkflowManager, type WorkflowId } from "@convex-dev/workflow";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { internalMutation, query } from "../_generated/server";

export const tmdbWorkflow = new WorkflowManager(components.workflow);

export const SEARCH_RESULTS_EVENT_NAME = "tmdb.search.results";

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
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return [];

    const token = args.token;
    const session = await ctx.db
      .query("sessions")
      .withIndex("token", (q) => q.eq("token", token))
      .first();

    if (!session || session.expiresAt < Date.now()) return [];

    const userId = session.userId;

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
  args: { showId: v.id("shows"), token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const token = args.token;
    const session = await ctx.db
      .query("sessions")
      .withIndex("token", (q) => q.eq("token", token))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    const userId = session.userId;

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
