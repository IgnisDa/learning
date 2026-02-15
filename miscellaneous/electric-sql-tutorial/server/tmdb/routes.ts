import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { authMiddleware } from "../auth/middleware";
import { db, schema } from "../db";
import { tmdbFetch } from "./client";
import { importShowFromTmdb } from "./import";
import type { SearchResult, TmdbSearchTvResponse } from "./types";
import type { Variables } from "../types";

const tmdb = new Hono<{ Variables: Variables }>();

// Search TV shows
tmdb.get("/search", async (c) => {
  try {
    const query = c.req.query("q");

    if (!query || query.trim().length < 2) {
      return c.json({ results: [] });
    }

    const trimmedQuery = query.trim();
    const encodedQuery = encodeURIComponent(trimmedQuery);

    const data = await tmdbFetch<TmdbSearchTvResponse>(
      `/search/tv?query=${encodedQuery}&include_adult=false`,
    );

    const results: SearchResult[] = (data.results ?? []).map((r) => ({
      tmdbId: r.id,
      name: r.name,
      overview: r.overview,
      posterPath: r.poster_path,
      firstAirDate: r.first_air_date,
    }));

    return c.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return c.json({ error: "Search failed" }, 500);
  }
});

// Add show to user's library
tmdb.post("/shows", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const { tmdbId, name } = await c.req.json();

    if (!tmdbId || !name) {
      return c.json({ error: "tmdbId and name are required" }, 400);
    }

    // Check if show already exists
    const existingShow = await db
      .select()
      .from(schema.shows)
      .where(eq(schema.shows.tmdbId, tmdbId))
      .limit(1);

    let showId: string;
    let alreadyExists = false;

    if (existingShow.length > 0) {
      showId = existingShow[0].id;
      alreadyExists = true;
    } else {
      // Create new show
      const newShow = await db
        .insert(schema.shows)
        .values({
          name,
          tmdbId,
        })
        .returning();

      showId = newShow[0].id;
    }

    // Check if user already has this show
    const existingUserShow = await db
      .select()
      .from(schema.userShows)
      .where(
        and(
          eq(schema.userShows.userId, user.id),
          eq(schema.userShows.showId, showId),
        ),
      )
      .limit(1);

    if (existingUserShow.length === 0) {
      // Add show to user's library
      await db.insert(schema.userShows).values({
        userId: user.id,
        showId,
      });
    }

    // Start background import (don't await - let it run async)
    importShowFromTmdb(showId, tmdbId).catch((error) => {
      console.error("Background import error:", error);
    });

    return c.json({ ok: true, showId, alreadyExists });
  } catch (error) {
    console.error("Add show error:", error);
    return c.json({ error: "Failed to add show" }, 500);
  }
});

// Refresh show details
tmdb.post("/shows/:showId/refresh", authMiddleware, async (c) => {
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

    // Get show to get tmdbId
    const show = await db
      .select()
      .from(schema.shows)
      .where(eq(schema.shows.id, showId))
      .limit(1);

    if (show.length === 0) {
      return c.json({ error: "Show not found" }, 404);
    }

    // Start background import (don't await)
    importShowFromTmdb(showId, show[0].tmdbId).catch((error) => {
      console.error("Refresh error:", error);
    });

    return c.json({ ok: true });
  } catch (error) {
    console.error("Refresh show error:", error);
    return c.json({ error: "Failed to refresh show" }, 500);
  }
});

export default tmdb;
