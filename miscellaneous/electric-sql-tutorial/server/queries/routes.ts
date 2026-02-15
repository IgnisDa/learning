import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { authMiddleware } from "../auth/middleware";
import { db, schema } from "../db";
import type { Variables } from "../types";

const queries = new Hono<{ Variables: Variables }>();

// Get user's shows with details
queries.get("/my-shows", authMiddleware, async (c) => {
  try {
    const user = c.get("user");

    const userShows = await db
      .select({
        userShowId: schema.userShows.id,
        userId: schema.userShows.userId,
        createdAt: schema.userShows.createdAt,
        showId: schema.shows.id,
        name: schema.shows.name,
        tmdbId: schema.shows.tmdbId,
        overview: schema.shows.overview,
        posterPath: schema.shows.posterPath,
      })
      .from(schema.userShows)
      .leftJoin(schema.shows, eq(schema.userShows.showId, schema.shows.id))
      .where(eq(schema.userShows.userId, user.id))
      .orderBy(desc(schema.userShows.createdAt));

    const shows = userShows.map((us) => ({
      _id: us.showId,
      name: us.name,
      tmdbId: us.tmdbId,
      overview: us.overview,
      posterPath: us.posterPath,
      addedAt: us.createdAt?.getTime() || 0,
    }));

    return c.json({ shows });
  } catch (error) {
    console.error("Get my shows error:", error);
    return c.json({ error: "Failed to fetch shows" }, 500);
  }
});

// Get show details with seasons, episodes, and credits
queries.get("/shows/:showId", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const showId = c.req.param("showId");

    // Verify user owns this show
    const userShow = await db
      .select()
      .from(schema.userShows)
      .where(
        and(
          eq(schema.userShows.userId, user.id),
          eq(schema.userShows.showId, showId),
        ),
      )
      .limit(1);

    if (userShow.length === 0) {
      return c.json({ error: "Show not found in your library" }, 404);
    }

    // Get show
    const show = await db
      .select()
      .from(schema.shows)
      .where(eq(schema.shows.id, showId))
      .limit(1);

    if (show.length === 0) {
      return c.json({ error: "Show not found" }, 404);
    }

    // Get seasons with episodes
    const seasons = await db
      .select()
      .from(schema.seasons)
      .where(eq(schema.seasons.showId, showId))
      .orderBy(schema.seasons.seasonNumber);

    const seasonsWithEpisodes = await Promise.all(
      seasons.map(async (season) => {
        const episodes = await db
          .select()
          .from(schema.episodes)
          .where(eq(schema.episodes.seasonId, season.id))
          .orderBy(schema.episodes.episodeNumber);

        return {
          id: season.id,
          name: season.name,
          airDate: season.airDate,
          overview: season.overview,
          posterPath: season.posterPath,
          episodeCount: season.episodeCount,
          seasonNumber: season.seasonNumber,
          episodes: episodes.map((ep) => ({
            id: ep.id,
            name: ep.name,
            airDate: ep.airDate,
            runtime: ep.runtime,
            overview: ep.overview,
            stillPath: ep.stillPath,
            episodeNumber: ep.episodeNumber,
            castCredits: (ep.castCredits as any[]) || [],
            crewCredits: (ep.crewCredits as any[]) || [],
          })),
        };
      }),
    );

    // Get show credits
    const credits = await db
      .select({
        creditId: schema.credits.id,
        kind: schema.credits.kind,
        character: schema.credits.character,
        job: schema.credits.job,
        department: schema.credits.department,
        orderIndex: schema.credits.orderIndex,
        personId: schema.persons.id,
        personName: schema.persons.name,
        personProfilePath: schema.persons.profilePath,
      })
      .from(schema.credits)
      .leftJoin(schema.persons, eq(schema.credits.personId, schema.persons.id))
      .where(eq(schema.credits.showId, showId));

    const cast = credits
      .filter((c) => c.kind === "cast")
      .map((c) => ({
        id: c.creditId,
        character: c.character,
        orderIndex: c.orderIndex,
        person: c.personId
          ? {
              id: c.personId,
              name: c.personName,
              profilePath: c.personProfilePath,
            }
          : null,
      }))
      .sort((a, b) => (a.orderIndex || 999) - (b.orderIndex || 999));

    const crew = credits
      .filter((c) => c.kind === "crew")
      .map((c) => ({
        id: c.creditId,
        job: c.job,
        department: c.department,
        person: c.personId
          ? {
              id: c.personId,
              name: c.personName,
              profilePath: c.personProfilePath,
            }
          : null,
      }));

    return c.json({
      show: {
        id: show[0].id,
        name: show[0].name,
        tmdbId: show[0].tmdbId,
        overview: show[0].overview,
        posterPath: show[0].posterPath,
        addedAt: userShow[0].createdAt?.getTime() || 0,
      },
      seasons: seasonsWithEpisodes,
      cast,
      crew,
    });
  } catch (error) {
    console.error("Get show details error:", error);
    return c.json({ error: "Failed to fetch show details" }, 500);
  }
});

export default queries;
