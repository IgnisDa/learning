import { getAuthUserId } from "@convex-dev/auth/server";
import { Workpool } from "@convex-dev/workpool";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";

const tmdbWorkpool = new Workpool(components.tmdbWorkpool, {
  maxParallelism: 5,
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

const castCreditValidator = v.object({
  personTmdbId: v.number(),
  personName: v.string(),
  profilePath: v.optional(v.string()),
  character: v.optional(v.string()),
  orderIndex: v.optional(v.number()),
});

const crewCreditValidator = v.object({
  personTmdbId: v.number(),
  personName: v.string(),
  profilePath: v.optional(v.string()),
  department: v.optional(v.string()),
  job: v.optional(v.string()),
});

const seasonValidator = v.object({
  seasonNumber: v.number(),
  name: v.string(),
  overview: v.optional(v.string()),
  posterPath: v.optional(v.string()),
  episodeCount: v.optional(v.number()),
  airDate: v.optional(v.string()),
  episodes: v.array(
    v.object({
      episodeNumber: v.number(),
      name: v.string(),
      overview: v.optional(v.string()),
      stillPath: v.optional(v.string()),
      airDate: v.optional(v.string()),
      runtime: v.optional(v.number()),
    }),
  ),
});

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

export const searchShows = action({
  args: { query: v.string() },
  handler: async (_ctx, args): Promise<SearchResult[]> => {
    const trimmedQuery = args.query.trim();

    // Return empty array if query is too short
    if (trimmedQuery.length < 2) return [];

    const encodedQuery = encodeURIComponent(trimmedQuery);
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

export const addShowFromTmdb = mutation({
  args: { name: v.string(), tmdbId: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You must be signed in to add a show");

    // Check if show already exists
    const existingShow = await ctx.db
      .query("shows")
      .withIndex("tmdbId", (q) => q.eq("tmdbId", args.tmdbId))
      .first();

    let showId: Id<"shows">;
    if (existingShow) {
      showId = existingShow._id;
    } else {
      // Create a minimal show entry
      showId = await ctx.db.insert("shows", {
        name: args.name,
        tmdbId: args.tmdbId,
      });
    }

    // Check if user already has this show
    const existingUserShow = await ctx.db
      .query("userShows")
      .withIndex("userIdShowId", (q) =>
        q.eq("userId", userId).eq("showId", showId),
      )
      .first();

    if (!existingUserShow) {
      // Create the userShow row
      await ctx.db.insert("userShows", {
        showId,
        userId,
      });
    }

    // Enqueue the TMDB fetching work to the workpool
    await tmdbWorkpool.enqueueAction(
      ctx,
      internal.tmdb.fetchAndSaveShowFromTmdb,
      { showId, tmdbId: args.tmdbId },
    );

    return { ok: true, tmdbId: args.tmdbId, showId };
  },
});

export const fetchAndSaveShowFromTmdb = internalAction({
  args: { tmdbId: v.number(), showId: v.id("shows") },
  handler: async (ctx, args) => {
    const tv = await tmdbFetch<TmdbTvDetails>(`/tv/${args.tmdbId}`);
    const credits = await tmdbFetch<TmdbTvCredits>(
      `/tv/${args.tmdbId}/credits`,
    );

    const seasonNumbers = (tv.seasons ?? [])
      .map((season) => season.season_number)
      .filter((seasonNumber) => Number.isFinite(seasonNumber));

    const seasonDetails = await Promise.all(
      seasonNumbers.map((seasonNumber) =>
        tmdbFetch<TmdbTvSeasonDetails>(
          `/tv/${args.tmdbId}/season/${seasonNumber}`,
        ),
      ),
    );

    const seasons = seasonDetails.map((season) => {
      const episodes = (season.episodes ?? []).map((episode) => ({
        name: episode.name,
        episodeNumber: episode.episode_number,
        runtime: episode.runtime ?? undefined,
        airDate: episode.air_date ?? undefined,
        overview: episode.overview ?? undefined,
        stillPath: episode.still_path ?? undefined,
      }));

      return {
        episodes,
        seasonNumber: season.season_number,
        airDate: season.air_date ?? undefined,
        overview: season.overview ?? undefined,
        posterPath: season.poster_path ?? undefined,
        name: season.name ?? `Season ${season.season_number}`,
        episodeCount:
          typeof season.episode_count === "number"
            ? season.episode_count
            : episodes.length,
      };
    });

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

    await ctx.runMutation(internal.tmdb.updateShowDataFromTmdb, {
      showId: args.showId,
      seasons,
      castCredits,
      crewCredits,
      show: {
        name: tv.name,
        tmdbId: args.tmdbId,
        overview: tv.overview ?? undefined,
        posterPath: tv.poster_path ?? undefined,
      },
    });
  },
});

export const updateShowDataFromTmdb = internalMutation({
  args: {
    showId: v.id("shows"),
    seasons: v.array(seasonValidator),
    castCredits: v.array(castCreditValidator),
    crewCredits: v.array(crewCreditValidator),
    show: v.object({
      tmdbId: v.number(),
      name: v.string(),
      overview: v.optional(v.string()),
      posterPath: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const showId = args.showId;

    // Update the show with full data
    await ctx.db.patch(showId, {
      name: args.show.name,
      overview: args.show.overview,
      posterPath: args.show.posterPath,
    });

    // Delete existing credits
    const existingCredits = await ctx.db
      .query("credits")
      .withIndex("showId", (q) => q.eq("showId", showId))
      .collect();
    for (const credit of existingCredits) {
      await ctx.db.delete(credit._id);
    }

    // Delete existing seasons and episodes
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

    // Insert new seasons and episodes
    for (const season of args.seasons) {
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

    // Insert new credits
    for (const castCredit of args.castCredits) {
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

    for (const crewCredit of args.crewCredits) {
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
