import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import * as React from "react";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";

const TMDB_POSTER = "https://image.tmdb.org/t/p/w185";
const TMDB_PROFILE = "https://image.tmdb.org/t/p/w92";
const TMDB_STILL = "https://image.tmdb.org/t/p/w300";

type WatchStatus =
	| "plan_to_watch"
	| "watching"
	| "completed"
	| "on_hold"
	| "dropped";

const WATCH_STATUS_OPTIONS: Array<{ label: string; value: WatchStatus }> = [
	{ label: "Plan to watch", value: "plan_to_watch" },
	{ label: "Watching", value: "watching" },
	{ label: "Completed", value: "completed" },
	{ label: "On hold", value: "on_hold" },
	{ label: "Dropped", value: "dropped" },
];

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

	const [activeTab, setActiveTab] = React.useState<
		"tracking" | "seasons" | "cast" | "crew"
	>("tracking");
	const [isEditingSetup, setIsEditingSetup] = React.useState(false);
	const [editSubmitting, setEditSubmitting] = React.useState(false);
	const [editError, setEditError] = React.useState<string | null>(null);
	const [editWatchStatus, setEditWatchStatus] = React.useState<WatchStatus>(
		"plan_to_watch",
	);
	const [editStartedDate, setEditStartedDate] = React.useState("");
	const [editCurrentSeason, setEditCurrentSeason] = React.useState("");
	const [editCurrentEpisode, setEditCurrentEpisode] = React.useState("");
	const [editTargetFinishDate, setEditTargetFinishDate] = React.useState("");
	const [editRating, setEditRating] = React.useState("");
	const [editIsFavorite, setEditIsFavorite] = React.useState(false);
	const [editNotes, setEditNotes] = React.useState("");

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

	const beginEditSetup = React.useCallback(() => {
		setEditWatchStatus((item?.watchStatus as WatchStatus | undefined) ?? "plan_to_watch");
		setEditStartedDate(toDateInputValue(item?.startedAt ?? null));
		setEditCurrentSeason(item?.currentSeason ? String(item.currentSeason) : "");
		setEditCurrentEpisode(item?.currentEpisode ? String(item.currentEpisode) : "");
		setEditTargetFinishDate(toDateInputValue(item?.targetFinishAt ?? null));
		setEditRating(item?.rating ? String(item.rating) : "");
		setEditIsFavorite(Boolean(item?.isFavorite));
		setEditNotes(item?.notes ?? "");
		setEditError(null);
		setIsEditingSetup(true);
	}, [item]);

	const onSaveSetup = React.useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			setEditSubmitting(true);
			setEditError(null);

			try {
				const write = zero.mutate(
					mutators.shows.updateTrackingDetails({
						showId,
						watchStatus: editWatchStatus,
						startedAt: dateInputToMs(editStartedDate),
						currentSeason: toNullablePositiveInt(editCurrentSeason),
						currentEpisode: toNullablePositiveInt(editCurrentEpisode),
						targetFinishAt: dateInputToMs(editTargetFinishDate),
						rating: toNullableRating(editRating),
						isFavorite: editIsFavorite,
						notes: editNotes.trim() ? editNotes.trim() : null,
					}),
				);

				const result = await write.server;
				if (result.type === "error") {
					throw result.error;
				}

				setIsEditingSetup(false);
			} catch (e2) {
				setEditError(e2 instanceof Error ? e2.message : "Failed to save setup");
			} finally {
				setEditSubmitting(false);
			}
		},
		[
			zero,
			showId,
			editWatchStatus,
			editStartedDate,
			editCurrentSeason,
			editCurrentEpisode,
			editTargetFinishDate,
			editRating,
			editIsFavorite,
			editNotes,
		],
	);

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
				<div className="border-b">
					<div className="flex flex-wrap gap-2 pb-2">
						<TabButton
							active={activeTab === "tracking"}
							onClick={() => setActiveTab("tracking")}
							label="Your setup"
						/>
						<TabButton
							active={activeTab === "seasons"}
							onClick={() => setActiveTab("seasons")}
							label="Seasons"
						/>
						<TabButton
							active={activeTab === "cast"}
							onClick={() => setActiveTab("cast")}
							label="Cast"
						/>
						<TabButton
							active={activeTab === "crew"}
							onClick={() => setActiveTab("crew")}
							label="Crew"
						/>
					</div>
				</div>

				{activeTab === "tracking" ? (
					<div className="space-y-3">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<h2 className="text-lg font-semibold">Your setup details</h2>
							{isEditingSetup ? (
								<button
									type="button"
									onClick={() => {
										setIsEditingSetup(false);
										setEditError(null);
									}}
									className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
								>
									Cancel
								</button>
							) : (
								<button
									type="button"
									onClick={beginEditSetup}
									className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
								>
									Edit setup
								</button>
							)}
						</div>

						{isEditingSetup ? (
							<form
								onSubmit={onSaveSetup}
								className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900 space-y-3"
							>
								<div className="grid gap-3 sm:grid-cols-2">
									<label className="block">
										<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
											Watch status
										</div>
										<select
											className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-950"
											value={editWatchStatus}
											onChange={(e) =>
												setEditWatchStatus(e.target.value as WatchStatus)
											}
										>
											{WATCH_STATUS_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</label>
									<label className="block">
										<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
											Started date
										</div>
										<input
											type="date"
											className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-950"
											value={editStartedDate}
											onChange={(e) => setEditStartedDate(e.target.value)}
										/>
									</label>
									<label className="block">
										<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
											Current season
										</div>
										<input
											type="number"
											min={1}
											className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-950"
											value={editCurrentSeason}
											onChange={(e) => setEditCurrentSeason(e.target.value)}
										/>
									</label>
									<label className="block">
										<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
											Current episode
										</div>
										<input
											type="number"
											min={1}
											className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-950"
											value={editCurrentEpisode}
											onChange={(e) => setEditCurrentEpisode(e.target.value)}
										/>
									</label>
									<label className="block">
										<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
											Target finish date
										</div>
										<input
											type="date"
											className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-950"
											value={editTargetFinishDate}
											onChange={(e) => setEditTargetFinishDate(e.target.value)}
										/>
									</label>
									<label className="block">
										<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
											Rating (1-10)
										</div>
										<input
											type="number"
											min={1}
											max={10}
											className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-950"
											value={editRating}
											onChange={(e) => setEditRating(e.target.value)}
										/>
									</label>
								</div>

								<label className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={editIsFavorite}
										onChange={(e) => setEditIsFavorite(e.target.checked)}
									/>
									Favorite show
								</label>

								<label className="block">
									<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
										Notes
									</div>
									<textarea
										className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-950"
										rows={4}
										value={editNotes}
										onChange={(e) => setEditNotes(e.target.value)}
									/>
								</label>

								<button
									type="submit"
									disabled={editSubmitting}
									className="h-9 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
								>
									{editSubmitting ? "Saving..." : "Save changes"}
								</button>

								{editError ? (
									<div className="text-sm text-red-700 dark:text-red-300">
										{editError}
									</div>
								) : null}
							</form>
						) : null}

						<div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
							<div className="grid gap-3 sm:grid-cols-2">
								<DetailRow
									label="Watch status"
									value={item?.watchStatus ?? "plan_to_watch"}
								/>
								<DetailRow
									label="Started date"
									value={formatMsDate(item?.startedAt ?? null)}
								/>
								<DetailRow
									label="Current season"
									value={item?.currentSeason ?? "-"}
								/>
								<DetailRow
									label="Current episode"
									value={item?.currentEpisode ?? "-"}
								/>
								<DetailRow
									label="Target finish date"
									value={formatMsDate(item?.targetFinishAt ?? null)}
								/>
								<DetailRow label="Rating" value={item?.rating ?? "-"} />
								<DetailRow
									label="Favorite"
									value={item?.isFavorite ? "Yes" : "No"}
								/>
								<DetailRow label="Setup step" value={item?.setupStep ?? "-"} />
								<DetailRow
									label="Setup completed"
									value={formatMsDate(item?.setupCompletedAt ?? null)}
								/>
							</div>
							<div className="mt-4 border-t pt-3">
								<div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
									Notes
								</div>
								<div className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
									{item?.notes?.trim() ? item.notes : "-"}
								</div>
							</div>
						</div>
					</div>
				) : null}

				{activeTab === "seasons" ? (
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
				) : null}

				{activeTab === "cast" ? (
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
				) : null}

				{activeTab === "crew" ? (
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
				) : null}
			</div>
		</div>
	);
}

function TabButton(props: {
	active: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={props.onClick}
			className={
				props.active
					? "rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
					: "rounded-md border bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
			}
		>
			{props.label}
		</button>
	);
}

function DetailRow(props: { label: string; value: string | number }) {
	return (
		<div>
			<div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
				{props.label}
			</div>
			<div className="mt-1 text-sm text-gray-800 dark:text-gray-200">
				{props.value}
			</div>
		</div>
	);
}

function toNullablePositiveInt(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const numberValue = Number(trimmed);
	if (!Number.isInteger(numberValue) || numberValue < 1) {
		return null;
	}

	return numberValue;
}

function toNullableRating(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const numberValue = Number(trimmed);
	if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 10) {
		return null;
	}

	return numberValue;
}

function dateInputToMs(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const ms = Date.parse(`${trimmed}T00:00:00`);
	return Number.isNaN(ms) ? null : ms;
}

function toDateInputValue(value: number | null) {
	if (!value) {
		return "";
	}

	const date = new Date(value);
	const yyyy = String(date.getFullYear());
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

function formatMsDate(value: number | null) {
	if (!value) {
		return "-";
	}

	return new Date(value).toLocaleDateString();
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
