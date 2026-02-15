import { useQuery } from "@tanstack/react-query";

export type SearchResult = {
  tmdbId: number;
  name: string;
  overview: string;
  posterPath: string | null;
  firstAirDate?: string;
};

export function useTmdbSearch(query: string) {
  return useQuery({
    queryKey: ["tmdb", "search", query],
    queryFn: async () => {
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        return [];
      }

      const res = await fetch(
        `/api/tmdb/search?q=${encodeURIComponent(trimmed)}`
      );

      if (!res.ok) {
        throw new Error(`TMDB search failed: ${res.status}`);
      }

      return (await res.json()) as SearchResult[];
    },
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60,
  });
}

export function useTmdbShow(tmdbId: number | null) {
  return useQuery({
    queryKey: ["tmdb", "show", tmdbId],
    queryFn: async () => {
      if (!tmdbId) {
        throw new Error("TMDB ID is required");
      }

      const res = await fetch(`/api/tmdb/show/${tmdbId}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch show: ${res.status}`);
      }

      return await res.json();
    },
    enabled: !!tmdbId,
  });
}
