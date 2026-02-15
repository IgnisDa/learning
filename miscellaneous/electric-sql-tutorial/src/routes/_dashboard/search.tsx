import { DashboardLayout } from "@/components/DashboardLayout";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, type CSSProperties } from "react";
import { apiCall, authApiCall } from "@/utils/api";

export const Route = createFileRoute("/_dashboard/search")({
  component: DashboardSearch,
});

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

const overviewClampStyle: CSSProperties = {
  overflow: "hidden",
  WebkitLineClamp: 3,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
};

type SearchResult = {
  name: string;
  tmdbId: number;
  overview: string;
  firstAirDate?: string;
  posterPath: string | null;
};

type Show = {
  _id: string;
  tmdbId: number;
};

function DashboardSearch() {
  const { token } = useRouteContext({ from: "/_dashboard" });
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault(""),
  );
  const [debouncedQuery] = useDebouncedValue(searchQuery, 1000);

  // Fetch user's shows to check if they already have them
  const { data: myShowsData } = useQuery({
    queryKey: ["my-shows", token],
    queryFn: async () => {
      const result = await authApiCall<{ shows: Show[] }>(
        "/api/queries/my-shows",
        token
      );
      return result.shows;
    },
  });

  const myShows = myShowsData || [];

  // Search mutation
  const {
    data: searchResults,
    error: searchError,
    mutate: searchShows,
    isPending: isSearching,
  } = useMutation({
    mutationFn: async (query: string) => {
      const result = await apiCall<{ results: SearchResult[] }>(
        `/api/tmdb/search?q=${encodeURIComponent(query)}`
      );
      return result.results;
    },
  });

  // Add show mutation
  const { mutate: addShow, error: addShowError } = useMutation({
    mutationFn: async ({ tmdbId, name }: { tmdbId: number; name: string }) => {
      return await authApiCall(
        "/api/tmdb/shows",
        token,
        {
          method: "POST",
          body: JSON.stringify({ tmdbId, name }),
        }
      );
    },
    onSuccess: () => {
      // Refetch user's shows
      queryClient.invalidateQueries({ queryKey: ["my-shows", token] });
    },
  });

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) return;
    searchShows(trimmed);
  }, [debouncedQuery, searchShows]);

  const trimmedSearchQuery = searchQuery.trim();

  const myShowTmdbIds = new Set(myShows.map((show) => show.tmdbId));
  const myShowIdByTmdbId = new Map(
    myShows.map((show) => [show.tmdbId, show._id] as const),
  );

  return (
    <DashboardLayout activeTab="search">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900">
          Search TV Shows
        </h2>
        <p className="text-sm text-neutral-600">
          Start typing at least two characters to search TMDB.
        </p>
      </div>

      <div className="mt-4">
        <input
          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:shadow-[0_0_0_1px_rgba(23,23,23,0.16)]"
          onChange={(event) => {
            const nextQuery = event.target.value;
            void setSearchQuery(
              nextQuery.trim().length === 0 ? null : nextQuery,
            );
          }}
          placeholder="Search for a TV show..."
          type="text"
          value={searchQuery}
        />
      </div>

      {isSearching && (
        <div className="px-4 py-3 mt-4 text-sm border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
          Searching...
        </div>
      )}

      {searchError && (
        <div className="px-4 py-3 mt-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
          Error:{" "}
          {searchError instanceof Error ? searchError.message : "Search failed"}
        </div>
      )}

      {addShowError && (
        <div className="px-4 py-3 mt-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
          Error:{" "}
          {addShowError instanceof Error
            ? addShowError.message
            : "Failed to add show"}
        </div>
      )}

      {trimmedSearchQuery.length >= 2 && searchResults && searchResults.length > 0 && (
        <div className="mt-6 overflow-hidden border rounded-lg border-neutral-200">
          <p className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
            {searchResults.length} result
            {searchResults.length !== 1 ? "s" : ""} found
          </p>

          <ul className="bg-white divide-y divide-neutral-200">
            {searchResults.map((show) => {
              const alreadyAdded = myShowTmdbIds.has(show.tmdbId);
              const existingShowId = myShowIdByTmdbId.get(show.tmdbId);

              return (
                <li
                  className="flex flex-col gap-4 p-4 transition hover:bg-neutral-50 sm:flex-row sm:items-start"
                  key={show.tmdbId}
                >
                  <div className="w-16 h-24 overflow-hidden border rounded-md shrink-0 border-neutral-200 bg-neutral-100">
                    {show.posterPath ? (
                      <img
                        alt={show.name}
                        className="object-cover w-full h-full"
                        src={`${TMDB_IMG}${show.posterPath}`}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-xs font-medium text-center text-neutral-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {show.name}
                      </h3>
                      {show.firstAirDate && (
                        <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-600">
                          {new Date(show.firstAirDate).getFullYear()}
                        </span>
                      )}
                    </div>

                    <p
                      className="text-sm leading-5 text-neutral-600"
                      style={overviewClampStyle}
                    >
                      {show.overview || "No description available"}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {alreadyAdded && existingShowId ? (
                      <Link
                        to="/show/$id"
                        params={{ id: existingShowId }}
                        className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        View
                      </Link>
                    ) : (
                      <button
                        className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() =>
                          addShow({
                            tmdbId: show.tmdbId,
                            name: show.name,
                          })
                        }
                        type="button"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {trimmedSearchQuery.length >= 2 &&
        !isSearching &&
        searchResults?.length === 0 &&
        !searchError && (
          <div className="px-4 py-3 mt-4 text-sm border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
            No shows found for "{trimmedSearchQuery}"
          </div>
        )}
    </DashboardLayout>
  );
}
