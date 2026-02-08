import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import * as React from "react";
import { useAppForm } from "~/components/forms/app-form";
import { getErrorMessage } from "~/utils/error-message";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";
import {
	View,
	Text,
	Card,
	Button,
	Badge,
	Alert,
	Image,
	Tabs,
	Avatar,
	Divider,
	Accordion,
	Loader,
} from "reshaped";

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
						currentSeason: toNullableNumber(value.currentSeason),
						currentEpisode: toNullableNumber(value.currentEpisode),
						targetFinishAt: dateInputToMs(value.targetFinishDate),
						rating: toNullableNumber(value.rating),
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
				setEditError(getErrorMessage(e2, "Failed to save setup"));
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
		editForm.setFieldValue(
			"startedDate",
			toDateInputValue(item?.startedAt ?? null),
		);
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
			<View padding={4}>
				<Link to="/">
					<Text variant="body-3" color="primary">
						&larr; Back
					</Text>
				</Link>
				<View paddingTop={4}>
					<Text variant="body-3" color="neutral-faded">
						Show not found (or not in your library).
					</Text>
				</View>
			</View>
		);
	}

	if (!show) {
		return (
			<View padding={4}>
				<Link to="/">
					<Text variant="body-3" color="primary">
						&larr; Back
					</Text>
				</Link>
				<View paddingTop={4} direction="row" gap={2} align="center">
					<Loader size="small" ariaLabel="Loading show" />
					<Text variant="body-3" color="neutral-faded">
						Loading...
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View padding={4} gap={8}>
			<Link to="/">
				<Text variant="body-3" color="primary">
					&larr; Back
				</Text>
			</Link>

			<View direction={{ s: "column", m: "row" }} gap={4}>
				<View
					width="128px"
					height="176px"
					borderRadius="medium"
					overflow="hidden"
					backgroundColor="neutral-faded"
				>
					{show.posterPath ? (
						<Image
							src={`${TMDB_POSTER}${show.posterPath}`}
							alt=""
							width="128px"
							height="176px"
						/>
					) : null}
				</View>

				<View grow gap={2}>
					<View direction="row" align="start" justify="space-between" gap={3} wrap>
						<View gap={1}>
							<Text variant="title-4" maxLines={1}>
								{show.name}
							</Text>
							<View direction="row" gap={2} align="center" wrap>
								<Badge>{show.enrichState}</Badge>
								<Text variant="caption-1" color="neutral-faded">
									TMDB #{show.tmdbId}
								</Text>
							</View>
						</View>

						<Button color="primary" onClick={onEnrich}>
							Re-enrich
						</Button>
					</View>

					{show.enrichError ? (
						<Alert color="critical" title="Enrichment Error">
							{show.enrichError}
						</Alert>
					) : null}

					<Text variant="body-3" color="neutral-faded">
						{show.overview ?? "No overview."}
					</Text>

					{show.enrichState !== "ready" ? (
						<Text variant="body-3" color="neutral-faded">
							Waiting for worker to fetch seasons + cast/crew...
						</Text>
					) : null}
				</View>
			</View>

			<View gap={3}>
				<Tabs
					value={activeTab}
					onChange={({ value }) => setActiveTab(value as typeof activeTab)}
				>
					<Tabs.List>
						<Tabs.Item value="tracking">Your setup</Tabs.Item>
						<Tabs.Item value="seasons">Seasons</Tabs.Item>
						<Tabs.Item value="cast">Cast</Tabs.Item>
						<Tabs.Item value="crew">Crew</Tabs.Item>
					</Tabs.List>
				</Tabs>

				{activeTab === "tracking" ? (
					<View gap={3}>
						<View direction="row" align="center" justify="space-between" gap={2} wrap>
							<Text variant="title-6">Your setup details</Text>
							{isEditingSetup ? (
								<Button
									variant="outline"
									size="small"
									onClick={() => {
										setIsEditingSetup(false);
										setEditError(null);
									}}
								>
									Cancel
								</Button>
							) : (
								<Button
									color="primary"
									size="small"
									onClick={beginEditSetup}
								>
									Edit setup
								</Button>
							)}
						</View>

						{isEditingSetup ? (
							<Card>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
										void editForm.handleSubmit();
									}}
								>
									<View gap={3}>
										<View direction={{ s: "column", m: "row" }} gap={3}>
											<View.Item columns={{ s: 12, m: 6 }}>
												<editForm.AppField name="watchStatus">
													{(field) => (
														<field.SelectField
															label="Watch status"
															options={WATCH_STATUS_OPTIONS}
														/>
													)}
												</editForm.AppField>
											</View.Item>
											<View.Item columns={{ s: 12, m: 6 }}>
												<editForm.AppField name="startedDate">
													{(field) => (
														<field.TextInputField
															label="Started date"
															type="date"
														/>
													)}
												</editForm.AppField>
											</View.Item>
											<View.Item columns={{ s: 12, m: 6 }}>
												<editForm.AppField name="currentSeason">
													{(field) => (
														<field.TextInputField
															label="Current season"
															type="number"
														/>
													)}
												</editForm.AppField>
											</View.Item>
											<View.Item columns={{ s: 12, m: 6 }}>
												<editForm.AppField name="currentEpisode">
													{(field) => (
														<field.TextInputField
															label="Current episode"
															type="number"
														/>
													)}
												</editForm.AppField>
											</View.Item>
											<View.Item columns={{ s: 12, m: 6 }}>
												<editForm.AppField name="targetFinishDate">
													{(field) => (
														<field.TextInputField
															label="Target finish date"
															type="date"
														/>
													)}
												</editForm.AppField>
											</View.Item>
											<View.Item columns={{ s: 12, m: 6 }}>
												<editForm.AppField name="rating">
													{(field) => (
														<field.TextInputField
															type="number"
															label="Rating (1-10)"
														/>
													)}
												</editForm.AppField>
											</View.Item>
										</View>

										<editForm.AppField name="isFavorite">
											{(field) => <field.CheckboxField label="Favorite show" />}
										</editForm.AppField>

										<editForm.AppField name="notes">
											{(field) => (
												<field.TextareaField
													label="Notes"
													rows={4}
												/>
											)}
										</editForm.AppField>

										<editForm.AppForm>
											<editForm.SubmitButton
												idleLabel="Save changes"
												submittingLabel="Saving..."
											/>
										</editForm.AppForm>

										{editError ? (
											<Alert color="critical" title="Error">
												{editError}
											</Alert>
										) : null}
									</View>
								</form>
							</Card>
						) : null}

						<Card>
							<View gap={3}>
								<View direction={{ s: "column", m: "row" }} gap={3}>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow
											label="Watch status"
											value={item?.watchStatus ?? "plan_to_watch"}
										/>
									</View.Item>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow
											label="Started date"
											value={formatMsDate(item?.startedAt ?? null)}
										/>
									</View.Item>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow
											label="Current season"
											value={item?.currentSeason ?? "-"}
										/>
									</View.Item>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow
											label="Current episode"
											value={item?.currentEpisode ?? "-"}
										/>
									</View.Item>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow
											label="Target finish date"
											value={formatMsDate(item?.targetFinishAt ?? null)}
										/>
									</View.Item>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow label="Rating" value={item?.rating ?? "-"} />
									</View.Item>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow
											label="Favorite"
											value={item?.isFavorite ? "Yes" : "No"}
										/>
									</View.Item>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow label="Setup step" value={item?.setupStep ?? "-"} />
									</View.Item>
									<View.Item columns={{ s: 12, m: 6 }}>
										<DetailRow
											label="Setup completed"
											value={formatMsDate(item?.setupCompletedAt ?? null)}
										/>
									</View.Item>
								</View>
								<Divider />
								<View>
									<Text variant="caption-1" weight="bold" color="neutral-faded">
										NOTES
									</Text>
									<View>
										<pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", margin: 0 }}>
											<Text variant="body-3" as="span">
												{item?.notes?.trim() ? item.notes : "-"}
											</Text>
										</pre>
									</View>
								</View>
							</View>
						</Card>
					</View>
				) : null}

				{activeTab === "seasons" ? (
					<View gap={3}>
						<Text variant="title-6">Seasons</Text>
						{seasons.length ? (
							<View gap={2}>
								{seasons.map((s) => {
									const isExpanded = expandedSeasons.has(s.id);
									const episodes = s.episodes ?? [];
									return (
								<Card key={s.id} padding={0} onClick={() => toggleSeason(s.id)}>
							<View
								direction="row"
								gap={3}
								padding={3}
							>
												<View
													width="56px"
													height="80px"
													borderRadius="small"
													overflow="hidden"
													backgroundColor="neutral-faded"
												>
													{s.posterPath ? (
														<Image
															src={`${TMDB_POSTER}${s.posterPath}`}
															alt=""
															width="56px"
															height="80px"
														/>
													) : null}
												</View>
												<View grow gap={1}>
													<View direction="row" gap={2} align="center">
														<Text variant="body-2" weight="medium" maxLines={1}>
															S{s.seasonNumber}: {s.name}
														</Text>
														<Text variant="body-3" color="neutral-faded">
															{isExpanded ? "▼" : "▶"}
														</Text>
													</View>
													<Text variant="caption-1" color="neutral-faded">
														{s.episodeCount ? `${s.episodeCount} eps` : "-"}
														{s.airDate ? ` | ${s.airDate}` : ""}
													</Text>
													{s.overview ? (
														<Text variant="caption-1" color="neutral-faded" maxLines={3}>
															{s.overview}
														</Text>
													) : null}
												</View>
							</View>

											{isExpanded && (
												<View borderTop padding={3} gap={2}>
													{episodes.length > 0 ? (
														episodes.map((ep) => (
															<Card key={ep.id}>
																<View direction="row" gap={3}>
																	<View
																		width="112px"
																		height="64px"
																		borderRadius="small"
																		overflow="hidden"
																		backgroundColor="neutral-faded"
																	>
																		{ep.stillPath ? (
																			<Image
																				src={`${TMDB_STILL}${ep.stillPath}`}
																				alt=""
																				width="112px"
																				height="64px"
																			/>
																		) : null}
																	</View>
																	<View grow gap={1}>
																		<Text variant="body-2" weight="medium">
																			{ep.episodeNumber}. {ep.name}
																		</Text>
																		{ep.airDate && (
																			<Text variant="caption-1" color="neutral-faded">
																				{ep.airDate}
																				{ep.runtime ? ` | ${ep.runtime} min` : ""}
																			</Text>
																		)}
																		{ep.overview ? (
																			<Text variant="caption-1" color="neutral-faded">
																				{ep.overview}
																			</Text>
																		) : null}
																	</View>
																</View>
															</Card>
														))
													) : (
														<Text variant="body-3" color="neutral-faded">
															No episodes found for this season. Try clicking
															"Re-enrich" to fetch episode data.
														</Text>
													)}
												</View>
											)}
										</Card>
									);
								})}
							</View>
						) : (
							<Text variant="body-3" color="neutral-faded">
								No seasons yet.
							</Text>
						)}
					</View>
				) : null}

				{activeTab === "cast" ? (
					<View gap={3}>
						<Text variant="title-6">Cast</Text>
						{cast.length ? (
							<View direction="row" gap={2} wrap>
								{cast.slice(0, 18).map((c) => (
									<View.Item key={c.id} columns={{ s: 12, m: 6, l: 4 }}>
										<Card>
											<View direction="row" gap={3} align="center">
												<Avatar
													size={10}
													src={c.person?.profilePath ? `${TMDB_PROFILE}${c.person.profilePath}` : undefined}
													initials={getInitials(c.person?.name ?? "Unknown")}
												/>
												<View grow gap={0}>
													<Text variant="body-2" weight="medium" maxLines={1}>
														{c.person?.name ?? "Unknown"}
													</Text>
													<Text variant="caption-1" color="neutral-faded">
														{c.character ?? "-"}
													</Text>
												</View>
											</View>
										</Card>
									</View.Item>
								))}
							</View>
						) : (
							<Text variant="body-3" color="neutral-faded">
								No cast yet.
							</Text>
						)}
					</View>
				) : null}

				{activeTab === "crew" ? (
					<View gap={3}>
						<Text variant="title-6">Crew</Text>
						{crew.length ? (
							<View direction="row" gap={2} wrap>
								{crew.slice(0, 18).map((c) => (
									<View.Item key={c.id} columns={{ s: 12, m: 6, l: 4 }}>
										<Card>
											<View direction="row" gap={3} align="center">
												<Avatar
													size={10}
													src={c.person?.profilePath ? `${TMDB_PROFILE}${c.person.profilePath}` : undefined}
													initials={getInitials(c.person?.name ?? "Unknown")}
												/>
												<View grow gap={0}>
													<Text variant="body-2" weight="medium" maxLines={1}>
														{c.person?.name ?? "Unknown"}
													</Text>
													<Text variant="caption-1" color="neutral-faded">
														{[c.department, c.job].filter(Boolean).join(" | ") ||
															"-"}
													</Text>
												</View>
											</View>
										</Card>
									</View.Item>
								))}
							</View>
						) : (
							<Text variant="body-3" color="neutral-faded">
								No crew yet.
							</Text>
						)}
					</View>
				) : null}
			</View>
		</View>
	);
}

function DetailRow(props: { label: string; value: string | number }) {
	return (
		<View>
			<Text variant="caption-1" weight="bold" color="neutral-faded">
				{props.label.toUpperCase()}
			</Text>
			<Text variant="body-3">{props.value}</Text>
		</View>
	);
}

function toNullableNumber(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	return Number(trimmed);
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
