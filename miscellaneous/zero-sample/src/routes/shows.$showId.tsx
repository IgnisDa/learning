import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import * as React from "react";
import { useAppForm } from "~/components/forms/app-form";
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
	const [editError, setEditError] = React.useState<string | null>(null);
	const editForm = useAppForm({
		defaultValues: {
			watchStatus: "plan_to_watch" as WatchStatus,
			startedDate: "",
			currentSeason: "",
			currentEpisode: "",
			targetFinishDate: "",
			rating: "",
			isFavorite: false,
			notes: "",
		},
		onSubmit: async ({ value }) => {
			setEditError(null);

			try {
				const write = zero.mutate(
					mutators.shows.updateTrackingDetails({
						showId,
						watchStatus: value.watchStatus,
						startedAt: dateInputToMs(value.startedDate),
						currentSeason: toNullablePositiveInt(value.currentSeason),
						currentEpisode: toNullablePositiveInt(value.currentEpisode),
						targetFinishAt: dateInputToMs(value.targetFinishDate),
						rating: toNullableRating(value.rating),
						isFavorite: value.isFavorite,
						notes: value.notes.trim() ? value.notes.trim() : null,
					}),
				);

				const result = await write.server;
				if (result.type === "error") {
					throw result.error;
				}

				setIsEditingSetup(false);
			} catch (e2) {
				setEditError(e2 instanceof Error ? e2.message : "Failed to save setup");
			}
		},
	});

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
		editForm.setFieldValue(
			"watchStatus",
			(item?.watchStatus as WatchStatus | undefined) ?? "plan_to_watch",
		);
		editForm.setFieldValue("startedDate", toDateInputValue(item?.startedAt ?? null));
		editForm.setFieldValue(
			"currentSeason",
			item?.currentSeason ? String(item.currentSeason) : "",
		);
		editForm.setFieldValue(
			"currentEpisode",
			item?.currentEpisode ? String(item.currentEpisode) : "",
		);
		editForm.setFieldValue(
			"targetFinishDate",
			toDateInputValue(item?.targetFinishAt ?? null),
		);
		editForm.setFieldValue("rating", item?.rating ? String(item.rating) : "");
		editForm.setFieldValue("isFavorite", Boolean(item?.isFavorite));
		editForm.setFieldValue("notes", item?.notes ?? "");
		setEditError(null);
		setIsEditingSetup(true);
	}, [editForm, item]);

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
				<div className="w-32 overflow-hidden bg-gray-200 rounded h-44 shrink-0 dark:bg-gray-800">
					{show.posterPath ? (
						<img
							alt=""
							className="object-cover w-full h-full"
							src={`${TMDB_POSTER}${show.posterPath}`}
							loading="lazy"
						/>
					) : null}
				</div>

				<div className="flex-1 min-w-0 space-y-2">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="min-w-0">
							<h1 className="text-2xl font-semibold truncate">{show.name}</h1>
							<div className="flex flex-wrap items-center gap-2 mt-1">
								<span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded dark:bg-gray-800 dark:text-gray-200">
									{show.enrichState}
								</span>
								<span className="text-xs text-gray-500">
									TMDB #{show.tmdbId}
								</span>
							</div>
						</div>

						<button
							className="px-3 text-sm font-medium text-white bg-blue-600 rounded-md h-9 hover:bg-blue-500"
							onClick={onEnrich}
							type="button"
						>
							Re-enrich
						</button>
					</div>

					{show.enrichError ? (
						<div className="p-3 text-sm text-red-800 border border-red-200 rounded-md bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
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
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									void editForm.handleSubmit();
								}}
								className="p-4 space-y-3 bg-white border rounded-lg shadow-sm dark:bg-gray-900"
							>
								<div className="grid gap-3 sm:grid-cols-2">
									<editForm.AppField name="watchStatus">
										{(field) => (
											<field.SelectField
												label="Watch status"
												options={WATCH_STATUS_OPTIONS}
												className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
											/>
										)}
									</editForm.AppField>
									<editForm.AppField name="startedDate">
										{(field) => (
											<field.TextInputField
												label="Started date"
												type="date"
												className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
											/>
										)}
									</editForm.AppField>
									<editForm.AppField name="currentSeason">
										{(field) => (
											<field.TextInputField
												label="Current season"
												type="number"
												min={1}
												className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
											/>
										)}
									</editForm.AppField>
									<editForm.AppField name="currentEpisode">
										{(field) => (
											<field.TextInputField
												label="Current episode"
												type="number"
												min={1}
												className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
											/>
										)}
									</editForm.AppField>
									<editForm.AppField name="targetFinishDate">
										{(field) => (
											<field.TextInputField
												label="Target finish date"
												type="date"
												className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
											/>
										)}
									</editForm.AppField>
									<editForm.AppField name="rating">
										{(field) => (
											<field.TextInputField
												label="Rating (1-10)"
												type="number"
												min={1}
												max={10}
												className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
											/>
										)}
									</editForm.AppField>
								</div>

								<editForm.AppField name="isFavorite">
									{(field) => (
										<field.CheckboxField label="Favorite show" />
									)}
								</editForm.AppField>

								<editForm.AppField name="notes">
									{(field) => (
										<field.TextareaField
											label="Notes"
											rows={4}
											className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
										/>
									)}
								</editForm.AppField>

								<editForm.AppForm>
									<editForm.SubmitButton
										idleLabel="Save changes"
										submittingLabel="Saving..."
										className="px-3 text-sm font-medium text-white bg-blue-600 rounded-md h-9 hover:bg-blue-500 disabled:opacity-60"
									/>
								</editForm.AppForm>

								{editError ? (
									<div className="text-sm text-red-700 dark:text-red-300">
										{editError}
									</div>
								) : null}
							</form>
						) : null}

						<div className="p-4 bg-white border rounded-lg shadow-sm dark:bg-gray-900">
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
							<div className="pt-3 mt-4 border-t">
								<div className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
									Notes
								</div>
								<div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap dark:text-gray-300">
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
											className="bg-white border rounded-lg shadow-sm dark:bg-gray-900"
										>
											<button
												type="button"
												onClick={() => {
													toggleSeason(s.id);
												}}
												className="flex w-full gap-3 p-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800"
											>
												<div className="h-20 overflow-hidden bg-gray-200 rounded w-14 shrink-0 dark:bg-gray-800">
													{s.posterPath ? (
														<img
															alt=""
															className="object-cover w-full h-full"
															src={`${TMDB_POSTER}${s.posterPath}`}
															loading="lazy"
														/>
													) : null}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2">
														<div className="font-medium truncate">
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
														<div className="mt-2 text-xs text-gray-700 line-clamp-3 dark:text-gray-300">
															{s.overview}
														</div>
													) : null}
												</div>
											</button>

											{isExpanded && (
												<div className="p-3 space-y-2 border-t">
													{episodes.length > 0 ? (
														episodes.map((ep) => (
															<div
																key={ep.id}
																className="flex gap-3 p-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800"
															>
																<div className="h-16 overflow-hidden bg-gray-200 rounded w-28 shrink-0 dark:bg-gray-700">
																	{ep.stillPath ? (
																		<img
																			alt=""
																			className="object-cover w-full h-full"
																			src={`${TMDB_STILL}${ep.stillPath}`}
																			loading="lazy"
																		/>
																	) : null}
																</div>
																<div className="flex-1 min-w-0">
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
										className="flex gap-3 p-3 text-sm bg-white border rounded-lg shadow-sm dark:bg-gray-900"
									>
										<div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-full shrink-0 dark:bg-gray-800">
											{c.person?.profilePath ? (
												<img
													alt=""
													className="object-cover w-full h-full"
													src={`${TMDB_PROFILE}${c.person.profilePath}`}
													loading="lazy"
												/>
											) : (
												<div className="flex items-center justify-center w-full h-full text-xs font-semibold text-gray-700 dark:text-gray-200">
													{getInitials(c.person?.name ?? "Unknown")}
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-medium truncate">
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
										className="flex gap-3 p-3 text-sm bg-white border rounded-lg shadow-sm dark:bg-gray-900"
									>
										<div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-full shrink-0 dark:bg-gray-800">
											{c.person?.profilePath ? (
												<img
													alt=""
													className="object-cover w-full h-full"
													src={`${TMDB_PROFILE}${c.person.profilePath}`}
													loading="lazy"
												/>
											) : (
												<div className="flex items-center justify-center w-full h-full text-xs font-semibold text-gray-700 dark:text-gray-200">
													{getInitials(c.person?.name ?? "Unknown")}
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-medium truncate">
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
			<div className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
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
