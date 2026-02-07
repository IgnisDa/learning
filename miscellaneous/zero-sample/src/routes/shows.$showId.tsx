import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import * as React from "react";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";

const TMDB_POSTER = "https://image.tmdb.org/t/p/w185";
const TMDB_PROFILE = "https://image.tmdb.org/t/p/w92";
const TMDB_STILL = "https://image.tmdb.org/t/p/w300";

export const Route = createFileRoute("/shows/$showId")({
	component: ShowDetails,
});

function ShowDetails() {
	const zero = useZero();
	const { showId } = Route.useParams();

	const [rows, detailsResult] = useQuery(
		queries.library.showDetails({ showId }),
	);
	const item = rows[0];
	const show = item?.show;
	const seasons = show?.seasons ?? [];
	const credits = show?.credits ?? [];

	const [expandedSeasons, setExpandedSeasons] = React.useState<Set<string>>(
		new Set(),
	);

	const toggleSeason = React.useCallback((seasonId: string) => {
		setExpandedSeasons((prev) => {
			const next = new Set(prev);
			if (next.has(seasonId)) {
				next.delete(seasonId);
			} else {
				next.add(seasonId);
			}
			return next;
		});
	}, []);

	const cast = React.useMemo(() => {
		return credits.filter((c) => c.kind === "cast");
	}, [credits]);

	const crew = React.useMemo(() => {
		return credits.filter((c) => c.kind === "crew");
	}, [credits]);

	const onEnrich = React.useCallback(() => {
		if (!show) {
			return;
		}

		zero.mutate(
			mutators.shows.addFromTmdb({
				id: show.id,
				jobId: `job_${show.tmdbId}_${nanoid(6)}`,
				tmdbId: show.tmdbId,
				forceEnrich: true,
				name: show.name,
				overview: show.overview ?? null,
				posterPath: show.posterPath ?? null,
			}),
		);
	}, [show, zero]);

	if (!show && detailsResult.type === "complete") {
		return (
			<div className="p-4">
				<Link
					to="/"
					className="text-sm text-blue-700 hover:underline dark:text-blue-400"
				>
					&larr; Back
				</Link>
				<div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
					Show not found (or not in your library).
				</div>
			</div>
		);
	}

	if (!show) {
		return (
			<div className="p-4">
				<Link
					to="/"
					className="text-sm text-blue-700 hover:underline dark:text-blue-400"
				>
					&larr; Back
				</Link>
				<div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
					Loading...
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 space-y-8">
			<Link
				to="/"
				className="text-sm text-blue-700 hover:underline dark:text-blue-400"
			>
				&larr; Back
			</Link>

			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="h-44 w-32 shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
					{show.posterPath ? (
						<img
							alt=""
							className="h-full w-full object-cover"
							src={`${TMDB_POSTER}${show.posterPath}`}
							loading="lazy"
						/>
					) : null}
				</div>

				<div className="min-w-0 flex-1 space-y-2">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="min-w-0">
							<h1 className="truncate text-2xl font-semibold">{show.name}</h1>
							<div className="mt-1 flex flex-wrap items-center gap-2">
								<span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200">
									{show.enrichState}
								</span>
								<span className="text-xs text-gray-500">
									TMDB #{show.tmdbId}
								</span>
							</div>
						</div>

						<button
							className="h-9 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-500"
							onClick={onEnrich}
							type="button"
						>
							Re-enrich
						</button>
					</div>

					{show.enrichError ? (
						<div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
							{show.enrichError}
						</div>
					) : null}

					<div className="text-sm text-gray-700 dark:text-gray-300">
						{show.overview ?? "No overview."}
					</div>

					{show.enrichState !== "ready" ? (
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Waiting for worker to fetch seasons + cast/crew...
						</div>
					) : null}
				</div>
			</div>

			<div className="space-y-2">
				<h2 className="text-lg font-semibold">Seasons</h2>
				{seasons.length ? (
					<div className="space-y-2">
						{seasons.map((s) => {
							const isExpanded = expandedSeasons.has(s.id);
							const episodes = s.episodes ?? [];
							return (
								<div
									key={s.id}
									className="rounded-lg border bg-white shadow-sm dark:bg-gray-900"
								>
									<button
										type="button"
										onClick={() => {
											toggleSeason(s.id);
										}}
										className="flex w-full gap-3 p-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
									>
										<div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
											{s.posterPath ? (
												<img
													alt=""
													className="h-full w-full object-cover"
													src={`${TMDB_POSTER}${s.posterPath}`}
													loading="lazy"
												/>
											) : null}
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<div className="truncate font-medium">
													S{s.seasonNumber}: {s.name}
												</div>
												<span className="text-gray-400">
													{isExpanded ? "▼" : "▶"}
												</span>
											</div>
											<div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
												{s.episodeCount ? `${s.episodeCount} eps` : "-"}
												{s.airDate ? ` | ${s.airDate}` : ""}
											</div>
											{s.overview ? (
												<div className="mt-2 line-clamp-3 text-xs text-gray-700 dark:text-gray-300">
													{s.overview}
												</div>
											) : null}
										</div>
									</button>

									{isExpanded && (
										<div className="border-t p-3 space-y-2">
											{episodes.length > 0 ? (
												episodes.map((ep) => (
													<div
														key={ep.id}
														className="flex gap-3 rounded-lg border bg-gray-50 p-3 text-sm dark:bg-gray-800"
													>
														<div className="h-16 w-28 shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
															{ep.stillPath ? (
																<img
																	alt=""
																	className="h-full w-full object-cover"
																	src={`${TMDB_STILL}${ep.stillPath}`}
																	loading="lazy"
																/>
															) : null}
														</div>
														<div className="min-w-0 flex-1">
															<div className="font-medium">
																{ep.episodeNumber}. {ep.name}
															</div>
															{ep.airDate && (
																<div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
																	{ep.airDate}
																	{ep.runtime ? ` | ${ep.runtime} min` : ""}
																</div>
															)}
															{ep.overview ? (
																<div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
																	{ep.overview}
																</div>
															) : null}
														</div>
													</div>
												))
											) : (
												<div className="text-sm text-gray-600 dark:text-gray-400">
													No episodes found for this season. Try clicking "Re-enrich" to fetch episode data.
												</div>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-sm text-gray-600 dark:text-gray-400">
						No seasons yet.
					</div>
				)}
			</div>

			<div className="space-y-2">
				<h2 className="text-lg font-semibold">Cast</h2>
				{cast.length ? (
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{cast.slice(0, 18).map((c) => (
							<div
								key={c.id}
								className="flex gap-3 rounded-lg border bg-white p-3 text-sm shadow-sm dark:bg-gray-900"
							>
								<div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
									{c.person?.profilePath ? (
										<img
											alt=""
											className="h-full w-full object-cover"
											src={`${TMDB_PROFILE}${c.person.profilePath}`}
											loading="lazy"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">
											{getInitials(c.person?.name ?? "Unknown")}
										</div>
									)}
								</div>
								<div className="min-w-0 flex-1">
									<div className="truncate font-medium">
										{c.person?.name ?? "Unknown"}
									</div>
									<div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
										{c.character ?? "-"}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-sm text-gray-600 dark:text-gray-400">
						No cast yet.
					</div>
				)}
			</div>

			<div className="space-y-2">
				<h2 className="text-lg font-semibold">Crew</h2>
				{crew.length ? (
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{crew.slice(0, 18).map((c) => (
							<div
								key={c.id}
								className="flex gap-3 rounded-lg border bg-white p-3 text-sm shadow-sm dark:bg-gray-900"
							>
								<div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
									{c.person?.profilePath ? (
										<img
											alt=""
											className="h-full w-full object-cover"
											src={`${TMDB_PROFILE}${c.person.profilePath}`}
											loading="lazy"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">
											{getInitials(c.person?.name ?? "Unknown")}
										</div>
									)}
								</div>
								<div className="min-w-0 flex-1">
									<div className="truncate font-medium">
										{c.person?.name ?? "Unknown"}
									</div>
									<div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
										{[c.department, c.job].filter(Boolean).join(" | ") || "-"}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-sm text-gray-600 dark:text-gray-400">
						No crew yet.
					</div>
				)}
			</div>
		</div>
	);
}

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean);

	if (!parts.length) {
		return "?";
	}

	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

	return (first + last).toUpperCase() || "?";
}
