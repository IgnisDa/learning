import { v } from "convex/values";
import {
  action,
  internalAction,
} from "../_generated/server";
import {
  tmdbFetch,
} from "./index";

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
  args: { query: v.string() },
  handler: async (_ctx, args): Promise<SearchResult[]> => {
    const trimmedQuery = args.query.trim();

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
