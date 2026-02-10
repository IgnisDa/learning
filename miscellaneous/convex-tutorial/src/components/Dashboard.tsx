import { useAuthActions } from "@convex-dev/auth/react";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

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
    <main>
      <header>
        <h1>Convex Tutorial</h1>
        <button onClick={() => void signOut()}>Sign Out</button>
      </header>

      <div className="search-section">
        <h2>Search TV Shows</h2>
        <p className="search-description">
          Search for TV shows from TMDB database
        </p>

        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a TV show..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isSearching && <div className="loading">Searching...</div>}

        {searchError && (
          <div className="error">
            Error:{" "}
            {searchError instanceof Error
              ? searchError.message
              : "Search failed"}
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="results-container">
            <p className="results-count">
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} found
            </p>
            <div className="results-grid">
              {searchResults.map((show) => (
                <div key={show.tmdbId} className="show-card">
                  <div className="show-poster">
                    {show.posterPath ? (
                      <img
                        alt={show.name}
                        src={`${TMDB_IMG}${show.posterPath}`}
                      />
                    ) : (
                      <div className="poster-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="show-info">
                    <h3 className="show-title">{show.name}</h3>
                    {show.firstAirDate && (
                      <p className="show-year">
                        {new Date(show.firstAirDate).getFullYear()}
                      </p>
                    )}
                    <p className="show-overview">
                      {show.overview || "No description available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery.trim().length >= 2 &&
          !isSearching &&
          searchResults?.length === 0 &&
          !searchError && (
            <div className="no-results">No shows found for "{searchQuery}"</div>
          )}
      </div>
    </main>
  );
}
