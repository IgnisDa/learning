import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { type CSSProperties } from "react";

export const Route = createFileRoute("/_dashboard/")({
  component: Dashboard,
});

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

const overviewClampStyle: CSSProperties = {
  overflow: "hidden",
  WebkitLineClamp: 3,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
};

export function Dashboard() {
  const { signOut } = useAuthActions();
  const myShows = useQuery(api.tmdb.index.listMyShows) ?? [];

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
          <Link
            className="inline-flex items-center justify-center px-3 text-sm font-medium transition bg-white rounded-md shadow-sm h-9 text-neutral-900"
            to="/"
          >
            My Shows
          </Link>
          <Link
            className="inline-flex items-center justify-center px-3 text-sm font-medium transition rounded-md h-9 text-neutral-600 hover:text-neutral-900"
            to="/search"
          >
            Search
          </Link>
        </div>

        <div className="mt-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-900">My Shows</h2>
            <p className="text-sm text-neutral-600">
              Shows you have added to your workspace.
            </p>
          </div>

          {myShows.length === 0 ? (
            <div className="px-4 py-5 mt-4 text-sm border rounded-md border-neutral-200 bg-neutral-50 text-neutral-600">
              <p>You have not added any shows yet.</p>
              <Link
                className="inline-flex items-center justify-center px-4 mt-3 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                to="/search"
              >
                Search shows
              </Link>
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
                        to="/show/$id"
                        params={{ id: show._id }}
                        className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
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
      </section>
    </main>
  );
}
