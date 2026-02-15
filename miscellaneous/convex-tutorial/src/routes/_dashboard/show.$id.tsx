import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

const TMDB_POSTER = "https://image.tmdb.org/t/p/w342";
const TMDB_PROFILE = "https://image.tmdb.org/t/p/w185";
const TMDB_STILL = "https://image.tmdb.org/t/p/w300";

export const Route = createFileRoute("/_dashboard/show/$id")({
  component: ShowPage,
});

function ShowPage() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"seasons" | "cast" | "crew">(
    "seasons",
  );
  const [expandedSeasonIds, setExpandedSeasonIds] = useState<Set<string>>(
    () => new Set(),
  );

  const details = useQuery(
    api.tmdb.index.getMyShowDetails,
    id ? { showId: id as Id<"shows"> } : "skip",
  );

  const cast = useMemo(() => details?.cast ?? [], [details]);
  const crew = useMemo(() => details?.crew ?? [], [details]);

  const toggleSeason = (seasonId: string) => {
    setExpandedSeasonIds((prev) => {
      const next = new Set(prev);
      if (next.has(seasonId)) {
        next.delete(seasonId);
      } else {
        next.add(seasonId);
      }
      return next;
    });
  };

  if (!id) {
    return (
      <main className="w-full max-w-6xl min-h-screen px-4 pt-8 pb-10 mx-auto sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          to="/"
        >
          Back to Dashboard
        </Link>
        <div className="px-4 py-5 mt-6 text-sm bg-white border rounded-md border-neutral-200 text-neutral-600">
          Missing show id. Open a show from the dashboard.
        </div>
      </main>
    );
  }

  if (details === undefined) {
    return (
      <main className="w-full max-w-6xl min-h-screen px-4 pt-8 pb-10 mx-auto sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          to="/"
        >
          Back to Dashboard
        </Link>
        <div className="px-4 py-5 mt-6 text-sm bg-white border rounded-md border-neutral-200 text-neutral-600">
          Loading show details...
        </div>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="w-full max-w-6xl min-h-screen px-4 pt-8 pb-10 mx-auto sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          to="/"
        >
          Back to Dashboard
        </Link>
        <div className="px-4 py-5 mt-6 text-sm bg-white border rounded-md border-neutral-200 text-neutral-600">
          Show not found in your library.
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-6xl min-h-screen px-4 pt-8 pb-10 mx-auto sm:px-6 lg:px-8">
      <Link
        className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
        to="/"
      >
        Back to Dashboard
      </Link>

      <section className="mt-6 overflow-hidden bg-white border shadow-sm rounded-xl border-neutral-200">
        <div className="grid gap-6 p-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:p-6">
          <div className="w-48 overflow-hidden border rounded-md h-72 border-neutral-200 bg-neutral-100">
            {details.show.posterPath ? (
              <img
                alt={details.show.name}
                className="object-cover w-full h-full"
                src={`${TMDB_POSTER}${details.show.posterPath}`}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-sm text-neutral-500">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
              TV Show
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              {details.show.name}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              TMDB #{details.show.tmdbId}
            </p>
            <p className="mt-4 text-sm leading-6 text-neutral-700">
              {details.show.overview || "No overview available."}
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              <span className="px-2 py-1 text-xs font-medium border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
                {details.seasons.length} season
                {details.seasons.length !== 1 ? "s" : ""}
              </span>
              <span className="px-2 py-1 text-xs font-medium border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
                {cast.length} cast
              </span>
              <span className="px-2 py-1 text-xs font-medium border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
                {crew.length} crew
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="p-4 mt-6 bg-white border shadow-sm rounded-xl border-neutral-200 sm:p-6">
        <div className="flex items-center gap-2 p-1 border rounded-lg border-neutral-200 bg-neutral-50">
          <TabButton
            active={activeTab === "seasons"}
            label={`Seasons (${details.seasons.length})`}
            onClick={() => setActiveTab("seasons")}
          />
          <TabButton
            active={activeTab === "cast"}
            label={`Cast (${cast.length})`}
            onClick={() => setActiveTab("cast")}
          />
          <TabButton
            active={activeTab === "crew"}
            label={`Crew (${crew.length})`}
            onClick={() => setActiveTab("crew")}
          />
        </div>

        {activeTab === "seasons" && (
          <div className="mt-5 space-y-4">
            {details.seasons.length === 0 && (
              <div className="px-4 py-4 text-sm border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
                No seasons available yet.
              </div>
            )}

            {details.seasons.map((season) => (
              <article
                className="overflow-hidden border rounded-lg border-neutral-200"
                key={season.id}
              >
                <button
                  aria-expanded={expandedSeasonIds.has(String(season.id))}
                  className="flex items-start w-full gap-4 p-4 text-left transition bg-neutral-50 hover:bg-neutral-100"
                  onClick={() => toggleSeason(String(season.id))}
                  type="button"
                >
                  <div className="w-16 h-24 overflow-hidden border rounded-md shrink-0 border-neutral-200 bg-neutral-100">
                    {season.posterPath ? (
                      <img
                        alt={season.name}
                        className="object-cover w-full h-full"
                        src={`${TMDB_POSTER}${season.posterPath}`}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-xs text-neutral-500">
                        S{season.seasonNumber}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Season {season.seasonNumber}
                      {season.name &&
                      season.name !== `Season ${season.seasonNumber}`
                        ? ` - ${season.name}`
                        : ""}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {season.episodeCount ?? season.episodes.length} episodes
                      {season.airDate ? ` - ${season.airDate}` : ""}
                    </p>
                    {season.overview && (
                      <p className="mt-2 text-sm leading-5 text-neutral-600">
                        {season.overview}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-neutral-500">
                    {expandedSeasonIds.has(String(season.id)) ? "-" : "+"}
                  </span>
                </button>

                {expandedSeasonIds.has(String(season.id)) && (
                  <ul className="pl-6 bg-white divide-y divide-neutral-200 sm:pl-10">
                    {season.episodes.map((episode) => (
                      <li
                        className="flex items-start gap-3 p-3"
                        key={episode.id}
                      >
                        <div className="overflow-hidden border rounded h-17 w-30 shrink-0 border-neutral-200 bg-neutral-100">
                          {episode.stillPath ? (
                            <img
                              alt={episode.name}
                              className="object-cover w-full h-full"
                              src={`${TMDB_STILL}${episode.stillPath}`}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-xs text-neutral-500">
                              E{episode.episodeNumber}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">
                            {episode.episodeNumber}. {episode.name}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {episode.airDate ?? "Unknown air date"}
                            {episode.runtime ? ` - ${episode.runtime} min` : ""}
                          </p>
                          {episode.overview && (
                            <p className="mt-1 text-sm leading-5 text-neutral-600">
                              {episode.overview}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}

                    {season.episodes.length === 0 && (
                      <li className="px-4 py-3 text-sm text-neutral-500">
                        No episode data available.
                      </li>
                    )}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}

        {activeTab === "cast" && (
          <div className="grid gap-3 mt-5 sm:grid-cols-2 lg:grid-cols-3">
            {cast.map((credit) => (
              <article
                className="flex items-center gap-3 p-3 border rounded-md border-neutral-200"
                key={credit.id}
              >
                <div className="w-12 h-12 overflow-hidden border rounded-full shrink-0 border-neutral-200 bg-neutral-100">
                  {credit.person?.profilePath ? (
                    <img
                      alt={credit.person.name}
                      className="object-cover w-full h-full"
                      src={`${TMDB_PROFILE}${credit.person.profilePath}`}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-xs text-neutral-500">
                      ?
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-neutral-900">
                    {credit.person?.name ?? "Unknown"}
                  </p>
                  <p className="text-xs truncate text-neutral-500">
                    {credit.character ?? "Unknown role"}
                  </p>
                </div>
              </article>
            ))}

            {cast.length === 0 && (
              <div className="px-4 py-4 text-sm border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
                No cast information available.
              </div>
            )}
          </div>
        )}

        {activeTab === "crew" && (
          <div className="grid gap-3 mt-5 sm:grid-cols-2 lg:grid-cols-3">
            {crew.map((credit) => (
              <article
                className="flex items-center gap-3 p-3 border rounded-md border-neutral-200"
                key={credit.id}
              >
                <div className="w-12 h-12 overflow-hidden border rounded-full shrink-0 border-neutral-200 bg-neutral-100">
                  {credit.person?.profilePath ? (
                    <img
                      alt={credit.person.name}
                      className="object-cover w-full h-full"
                      src={`${TMDB_PROFILE}${credit.person.profilePath}`}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-xs text-neutral-500">
                      ?
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-neutral-900">
                    {credit.person?.name ?? "Unknown"}
                  </p>
                  <p className="text-xs truncate text-neutral-500">
                    {[credit.department, credit.job]
                      .filter(Boolean)
                      .join(" - ") || "Unknown role"}
                  </p>
                </div>
              </article>
            ))}

            {crew.length === 0 && (
              <div className="px-4 py-4 text-sm border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
                No crew information available.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function TabButton(props: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition ${
        props.active
          ? "bg-white text-neutral-900 shadow-sm"
          : "text-neutral-600 hover:text-neutral-900"
      }`}
      onClick={props.onClick}
      type="button"
    >
      {props.label}
    </button>
  );
}
