import { useAuthActions } from "@convex-dev/auth/react";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { useEffect, useState, type CSSProperties } from "react";
import { api } from "../../convex/_generated/api";

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

const overviewClampStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [searchQuery, setSearchQuery] = useState("");
  const searchShowsAction = useAction(api.tmdb.searchShows);
  const [debouncedQuery] = useDebouncedValue(searchQuery, 250);

  const {
    error: searchError,
    mutate: searchShows,
    data: searchResults,
    isPending: isSearching,
  } = useMutation({
    mutationFn: async (query: string) => {
      return await searchShowsAction({ query });
    },
  });

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) return;
    searchShows(trimmed);
  }, [debouncedQuery, searchShows]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            TV Explorer
          </h1>
          <p className="max-w-2xl text-sm text-neutral-600">
            Search the TMDB catalog in a clean, Notion-inspired workspace.
          </p>
        </div>

        <button
          className="inline-flex h-9 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          onClick={() => void signOut()}
          type="button"
        >
          Sign out
        </button>
      </header>

      <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-neutral-900">Search TV Shows</h2>
          <p className="text-sm text-neutral-600">
            Start typing at least two characters to search TMDB.
          </p>
        </div>

        <div className="mt-4">
          <input
            className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:shadow-[0_0_0_1px_rgba(23,23,23,0.16)]"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for a TV show..."
            type="text"
            value={searchQuery}
          />
        </div>

        {isSearching && (
          <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
            Searching...
          </div>
        )}

        {searchError && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error: {searchError instanceof Error ? searchError.message : "Search failed"}
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200">
            <p className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} found
            </p>

            <ul className="divide-y divide-neutral-200 bg-white">
              {searchResults.map((show) => (
                <li
                  className="flex items-start gap-4 p-4 transition hover:bg-neutral-50"
                  key={show.tmdbId}
                >
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                    {show.posterPath ? (
                      <img
                        alt={show.name}
                        className="h-full w-full object-cover"
                        src={`${TMDB_IMG}${show.posterPath}`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-center text-xs font-medium text-neutral-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
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
                </li>
              ))}
            </ul>
          </div>
        )}

        {searchQuery.trim().length >= 2 &&
          !isSearching &&
          searchResults?.length === 0 &&
          !searchError && (
            <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              No shows found for "{searchQuery.trim()}"
            </div>
          )}
      </section>
    </main>
  );
}
