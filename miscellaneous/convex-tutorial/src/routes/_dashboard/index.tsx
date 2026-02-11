import { useAuthActions } from "@convex-dev/auth/react";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { useEffect, useState, type CSSProperties } from "react";

export const Route = createFileRoute("/_dashboard/")({
  component: Dashboard,
});

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

const overviewClampStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<"myShows" | "search">("myShows");
  const [searchQuery, setSearchQuery] = useState("");
  const myShows = useQuery(api.tmdb.listMyShows) ?? [];
  const searchShowsAction = useAction(api.tmdb.searchShows);
  const addShowFromTmdbAction = useAction(api.tmdb.addShowFromTmdb);
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

  const {
    mutate: addShow,
    error: addShowError,
    isPending: isAddingShow,
    variables: addShowVariables,
  } = useMutation({
    mutationFn: async (tmdbId: number) => {
      return await addShowFromTmdbAction({ tmdbId });
    },
  });

  useEffect(() => {
    if (activeTab !== "search") return;
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) return;
    searchShows(trimmed);
  }, [activeTab, debouncedQuery, searchShows]);

  const myShowTmdbIds = new Set(myShows.map((show) => show.tmdbId));
  const myShowIdByTmdbId = new Map(
    myShows.map((show) => [show.tmdbId, show._id] as const),
  );

  return (
    <main className="w-full max-w-6xl min-h-screen px-4 pt-8 pb-10 mx-auto sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 pb-5 mb-8 border-b border-neutral-200 sm:flex-row sm:items-end sm:justify-between">
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
          className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          onClick={() => void signOut()}
          type="button"
        >
          Sign out
        </button>
      </header>

      <section className="p-4 bg-white border shadow-sm rounded-xl border-neutral-200 sm:p-6">
        <div className="flex items-center gap-2 p-1 border rounded-lg border-neutral-200 bg-neutral-50">
          <button
            className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition ${
              activeTab === "myShows"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            onClick={() => setActiveTab("myShows")}
            type="button"
          >
            My Shows
          </button>
          <button
            className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition ${
              activeTab === "search"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            onClick={() => setActiveTab("search")}
            type="button"
          >
            Search
          </button>
        </div>

        {activeTab === "myShows" && (
          <div className="mt-5">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-neutral-900">
                My Shows
              </h2>
              <p className="text-sm text-neutral-600">
                Shows you have added to your workspace.
              </p>
            </div>

            {myShows.length === 0 ? (
              <div className="px-4 py-5 mt-4 text-sm border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
                <p>You have not added any shows yet.</p>
                <button
                  className="inline-flex items-center justify-center px-4 mt-3 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                  onClick={() => setActiveTab("search")}
                  type="button"
                >
                  Search shows
                </button>
              </div>
            ) : (
              <div className="mt-6 overflow-hidden border rounded-lg border-neutral-200">
                <p className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                  {myShows.length} show{myShows.length !== 1 ? "s" : ""}
                </p>

                <ul className="bg-white divide-y divide-neutral-200">
                  {myShows.map((show) => (
                    <li
                      className="flex flex-col gap-4 p-4 transition hover:bg-neutral-50 sm:flex-row sm:items-start"
                      key={show._id}
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
                        <h3 className="text-sm font-semibold text-neutral-900">
                          {show.name}
                        </h3>
                        <p
                          className="mt-1 text-sm leading-5 text-neutral-600"
                          style={overviewClampStyle}
                        >
                          {show.overview || "No description available"}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <Link
                          className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                          search={{ id: show._id }}
                          to="/show"
                        >
                          View
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "search" && (
          <div className="mt-5">
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
                onChange={(event) => setSearchQuery(event.target.value)}
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
                {searchError instanceof Error
                  ? searchError.message
                  : "Search failed"}
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

            {searchResults && searchResults.length > 0 && (
              <div className="mt-6 overflow-hidden border rounded-lg border-neutral-200">
                <p className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                  {searchResults.length} result
                  {searchResults.length !== 1 ? "s" : ""} found
                </p>

                <ul className="bg-white divide-y divide-neutral-200">
                  {searchResults.map((show) => {
                    const alreadyAdded = myShowTmdbIds.has(show.tmdbId);
                    const isAddingCurrent =
                      isAddingShow && addShowVariables === show.tmdbId;
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
                              className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                              search={{ id: existingShowId }}
                              to="/show"
                            >
                              View
                            </Link>
                          ) : (
                            <button
                              className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={isAddingCurrent}
                              onClick={() => addShow(show.tmdbId)}
                              type="button"
                            >
                              {isAddingCurrent ? "Adding..." : "Add"}
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {searchQuery.trim().length >= 2 &&
              !isSearching &&
              searchResults?.length === 0 &&
              !searchError && (
                <div className="px-4 py-3 mt-4 text-sm border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
                  No shows found for "{searchQuery.trim()}"
                </div>
              )}
          </div>
        )}
      </section>
    </main>
  );
}
