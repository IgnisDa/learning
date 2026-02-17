import { useQuery } from "@tanstack/react-query";

export type SearchResult = {
  tmdbId: number;
  name: string;
  overview: string;
  firstAirDate?: string;
  posterPath: string | null;
};

export function useTmdbSearch(query: string) {
  return useQuery({
    staleTime: 1000 * 60,
    enabled: query.trim().length >= 2,
    queryKey: ["tmdb", "search", query],
    queryFn: async () => {
      const trimmed = query.trim();
      if (trimmed.length < 2) return [];

      const res = await fetch(
        `/api/tmdb/search?q=${encodeURIComponent(trimmed)}`,
      );

      if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);

      return (await res.json()) as SearchResult[];
    },
  });
}
