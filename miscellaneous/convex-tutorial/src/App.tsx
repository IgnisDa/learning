import { useAuthActions } from "@convex-dev/auth/react";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useAction,
} from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";
import { Auth } from "./components/Auth";

type SearchResult = {
  tmdbId: number;
  name: string;
  overview: string;
  posterPath: string | null;
  firstAirDate?: string;
};

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

export default function App() {
  return (
    <>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
      <Unauthenticated>
        <Auth />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </>
  );
}

function Dashboard() {
  const { signOut } = useAuthActions();
  const searchShows = useAction(api.tmdb.searchShows);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Debounced search effect
  useEffect(() => {
    let cancelled = false;

    async function runSearch() {
      const trimmed = searchQuery.trim();
      if (trimmed.length < 2) {
        setSearchResults([]);
        setSearchError(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const results = await searchShows({ query: trimmed });
        if (cancelled) return;
        setSearchResults(results);
      } catch (e) {
        if (cancelled) return;
        setSearchResults([]);
        setSearchError(e instanceof Error ? e.message : "Search failed");
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }

    const timer = setTimeout(runSearch, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, searchShows]);

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

        {searchError && <div className="error">Error: {searchError}</div>}

        {searchResults.length > 0 && (
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
                        src={`${TMDB_IMG}${show.posterPath}`}
                        alt={show.name}
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
          searchResults.length === 0 &&
          !searchError && (
            <div className="no-results">No shows found for "{searchQuery}"</div>
          )}
      </div>
    </main>
  );
}
