import "~/config/env";
import { createFileRoute } from "@tanstack/react-router";
import { tmdbKey } from "~/lib/common";

type TmdbSearchTvResponse = {
  results?: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    first_air_date: string | undefined;
  }>;
};

export const Route = createFileRoute("/api/tmdb/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!tmdbKey) {
          return Response.json(
            { error: "TMDB_API_KEY is required" },
            { status: 500 },
          );
        }

        const url = new URL(request.url);
        const q = url.searchParams.get("q")?.trim() ?? "";
        if (q.length < 2) {
          return Response.json([]);
        }

        const tmdbURL = new URL("https://api.themoviedb.org/3/search/tv");
        tmdbURL.searchParams.set("query", q);
        tmdbURL.searchParams.set("include_adult", "false");
        tmdbURL.searchParams.set("language", "en-US");

        const baseHeaders = {
          Accept: "application/json",
        };

        const trimmedKey = tmdbKey.trim();
        const isV3ApiKey = /^[a-f0-9]{32}$/i.test(trimmedKey);
        const headers = isV3ApiKey
          ? baseHeaders
          : {
              ...baseHeaders,
              Authorization: trimmedKey.toLowerCase().startsWith("bearer ")
                ? trimmedKey
                : `Bearer ${trimmedKey}`,
            };

        if (isV3ApiKey) {
          tmdbURL.searchParams.set("api_key", trimmedKey);
        }

        const fetchResult = await (async () => {
          try {
            return {
              ok: true as const,
              response: await fetch(tmdbURL, { headers }),
            };
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            const cause = e instanceof Error ? e.cause : undefined;
            return {
              ok: false as const,
              response: Response.json(
                {
                  error: "TMDB search failed",
                  status: "fetch",
                  details:
                    cause && typeof cause === "object" && "code" in cause
                      ? `${message} (cause=${String((cause as Record<string, unknown>).code)})`
                      : message,
                },
                { status: 502 },
              ),
            };
          }
        })();

        if (!fetchResult.ok) {
          return fetchResult.response;
        }

        const res = fetchResult.response;

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          return Response.json(
            {
              error: "TMDB search failed",
              status: res.status,
              details: text.slice(0, 500),
            },
            { status: 502 },
          );
        }

        const data = (await res.json()) as TmdbSearchTvResponse;

        return Response.json(
          (data.results ?? []).map((r) => ({
            tmdbId: r.id,
            name: r.name,
            overview: r.overview,
            posterPath: r.poster_path,
            firstAirDate: r.first_air_date,
          })),
        );
      },
    },
  },
});
