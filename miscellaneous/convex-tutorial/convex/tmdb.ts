import { v } from "convex/values";
import { action } from "./_generated/server";

type TmdbSearchTvResponse = {
  results?: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    first_air_date: string | undefined;
  }>;
};

export type SearchResult = {
  name: string;
  tmdbId: number;
  overview: string;
  firstAirDate?: string;
  posterPath: string | null;
};

export const searchShows = action({
  args: {
    query: v.string(),
  },
  handler: async (_ctx, args): Promise<SearchResult[]> => {
    const trimmedQuery = args.query.trim();

    // Return empty array if query is too short
    if (trimmedQuery.length < 2) return [];

    // Get TMDB API key from environment
    const tmdbKey = process.env.TMDB_API_KEY;
    if (!tmdbKey) throw new Error("TMDB_API_KEY is not configured");

    // Build TMDB API URL
    const tmdbURL = new URL("https://api.themoviedb.org/3/search/tv");
    tmdbURL.searchParams.set("language", "en-US");
    tmdbURL.searchParams.set("query", trimmedQuery);
    tmdbURL.searchParams.set("include_adult", "false");

    // Setup headers
    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${tmdbKey}`,
    };

    // Make API request
    let res: Response;
    try {
      res = await fetch(tmdbURL.toString(), { headers });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`TMDB API request failed: ${message}`);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `TMDB API returned status ${res.status}: ${text.slice(0, 200)}`,
      );
    }

    const data = (await res.json()) as TmdbSearchTvResponse;

    return (data.results ?? []).map((r) => ({
      tmdbId: r.id,
      name: r.name,
      overview: r.overview,
      posterPath: r.poster_path,
      firstAirDate: r.first_air_date,
    }));
  },
});
