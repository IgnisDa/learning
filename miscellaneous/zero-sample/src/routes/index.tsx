import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import * as React from "react";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";

export const Route = createFileRoute("/")({
	component: Home,
});

type SearchResult = {
	tmdbId: number;
	name: string;
	overview: string;
	posterPath: string | null;
	firstAirDate?: string;
};

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

function Home() {
	const zero = useZero();
	const [libraryItems] = useQuery(queries.library.items());

	const shows = React.useMemo(() => {
		const list = libraryItems
			.map((i) => i.show)
			.filter((s): s is NonNullable<typeof s> => Boolean(s));
		list.sort((a, b) => a.name.localeCompare(b.name));
		return list;
	}, [libraryItems]);

	const tmdbIDsInLibrary = React.useMemo(() => {
		return new Set(shows.map((s) => s.tmdbId));
	}, [shows]);

	const [q, setQ] = React.useState("");
	const [results, setResults] = React.useState<Array<SearchResult>>([]);
	const [searching, setSearching] = React.useState(false);
	const [searchError, setSearchError] = React.useState<string | null>(null);

	React.useEffect(() => {
		let cancelled = false;

		async function run() {
			const trimmed = q.trim();
			if (trimmed.length < 2) {
				setResults([]);
				setSearchError(null);
				return;
			}

			setSearching(true);
			setSearchError(null);

			try {
				const res = await fetch(
					`/api/tmdb/search?q=${encodeURIComponent(trimmed)}`,
				);
				if (!res.ok) {
					throw new Error(`TMDB search failed: ${res.status}`);
				}

				const data = (await res.json()) as Array<SearchResult>;
				if (cancelled) {
					return;
				}

				setResults(data);
			} catch (e) {
				if (cancelled) {
					return;
				}

				setResults([]);
				setSearchError(e instanceof Error ? e.message : "Unknown error");
			} finally {
				if (!cancelled) {
					setSearching(false);
				}
			}
		}

		const t = window.setTimeout(run, 250);
		return () => {
			cancelled = true;
			window.clearTimeout(t);
		};
	}, [q]);

	const onAdd = (r: SearchResult) => {
		const id = `show_${r.tmdbId}`;
		const jobId = `job_${r.tmdbId}_${nanoid(6)}`;

		zero.mutate(
			mutators.shows.addFromTmdb({
				id,
				jobId,
				tmdbId: r.tmdbId,
				name: r.name,
				overview: r.overview,
				posterPath: r.posterPath,
			}),
		);
	};

	return (
		<div className="p-4 space-y-8">
			<div className="space-y-2">
				<h1 className="text-xl font-semibold">TMDB search</h1>
				<div className="text-sm text-gray-600 dark:text-gray-400">
					Type 2+ characters. Clicking “Add” writes to Postgres via Zero, then a
					worker fetches seasons + cast/crew.
				</div>

				<input
					className="w-full max-w-xl rounded-md border bg-white px-3 py-2 text-sm shadow-sm dark:bg-gray-900"
					placeholder="Search TV shows…"
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>

				{searchError ? (
					<div className="text-sm text-red-700 dark:text-red-300">
						{searchError}
					</div>
				) : null}

				{searching ? (
					<div className="text-sm text-gray-600 dark:text-gray-400">
						Searching…
					</div>
				) : null}

				{results.length ? (
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{results.slice(0, 12).map((r) => {
							const alreadyAdded = tmdbIDsInLibrary.has(r.tmdbId);
							return (
								<div
									key={r.tmdbId}
									className="flex gap-3 rounded-lg border bg-white p-3 shadow-sm dark:bg-gray-900"
								>
									<div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
										{r.posterPath ? (
											<img
												alt=""
												className="h-full w-full object-cover"
												src={`${TMDB_IMG}${r.posterPath}`}
												loading="lazy"
											/>
										) : null}
									</div>
									<div className="min-w-0 flex-1">
										<div className="truncate text-sm font-medium">{r.name}</div>
										<div className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
											{r.overview || "No overview"}
										</div>
										<div className="mt-2 flex items-center justify-between gap-2">
											<button
												disabled={alreadyAdded}
												className={
													alreadyAdded
														? "rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
														: "rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
												}
												onClick={() => onAdd(r)}
												type="button"
											>
												{alreadyAdded ? "Added" : "Add"}
											</button>
											<div className="text-xs text-gray-500">
												TMDB #{r.tmdbId}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : null}
			</div>

			<div className="space-y-2">
				<h2 className="text-xl font-semibold">Your library</h2>
				{shows.length ? (
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{shows.map((s) => (
							<Link
								key={s.id}
								to="/shows/$showId"
								params={{
									showId: s.id,
								}}
								className="flex gap-3 rounded-lg border bg-white p-3 shadow-sm hover:border-gray-400 dark:bg-gray-900"
							>
								<div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
									{s.posterPath ? (
										<img
											alt=""
											className="h-full w-full object-cover"
											src={`${TMDB_IMG}${s.posterPath}`}
											loading="lazy"
										/>
									) : null}
								</div>
								<div className="min-w-0 flex-1">
									<div className="truncate text-sm font-medium">{s.name}</div>
									<div className="mt-1 flex items-center gap-2">
										<span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200">
											{s.enrichState}
										</span>
										<span className="text-xs text-gray-500">
											TMDB #{s.tmdbId}
										</span>
									</div>
									{s.enrichError ? (
										<div className="mt-1 line-clamp-2 text-xs text-red-700 dark:text-red-300">
											{s.enrichError}
										</div>
									) : null}
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="text-sm text-gray-600 dark:text-gray-400">
						No shows yet. Search above and click “Add”.
					</div>
				)}
			</div>
		</div>
	);
}
