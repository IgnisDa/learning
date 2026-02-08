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
	TextField,
	Badge,
	Alert,
	Image,
	Loader,
	Icon,
} from "reshaped";

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

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

// SVG Icons
const SearchIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
);

const TvIcon = () => (
	<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
		<rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
		<polyline points="17 2 12 7 7 2" />
	</svg>
);

const PlusIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 5v14M5 12h14" />
	</svg>
);

const CheckIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

function Home() {
	const zero = useZero();
	const [libraryItems] = useQuery(queries.library.items());

	const libraryRows = React.useMemo(() => {
		const list: Array<{
			show: NonNullable<(typeof libraryItems)[number]["show"]>;
			watchStatus: (typeof libraryItems)[number]["watchStatus"];
			setupCompletedAt: (typeof libraryItems)[number]["setupCompletedAt"];
		}> = [];

		for (const item of libraryItems) {
			if (!item.show) {
				continue;
			}

			list.push({
				show: item.show,
				watchStatus: item.watchStatus,
				setupCompletedAt: item.setupCompletedAt,
			});
		}

		list.sort((a, b) => a.show.name.localeCompare(b.show.name));
		return list;
	}, [libraryItems]);

	const tmdbIDsInLibrary = React.useMemo(() => {
		return new Set(libraryRows.map((row) => row.show.tmdbId));
	}, [libraryRows]);

	const [q, setQ] = React.useState("");
	const [results, setResults] = React.useState<Array<SearchResult>>([]);
	const [searching, setSearching] = React.useState(false);
	const [searchError, setSearchError] = React.useState<string | null>(null);

	const [wizardResult, setWizardResult] = React.useState<SearchResult | null>(null);
	const [wizardStep, setWizardStep] = React.useState<1 | 2 | 3>(1);
	const [wizardSubmitting, setWizardSubmitting] = React.useState(false);
	const [wizardError, setWizardError] = React.useState<string | null>(null);
	const [wizardSuccess, setWizardSuccess] = React.useState<{
		showId: string;
		showName: string;
	} | null>(null);

	const step1Form = useAppForm({
		defaultValues: {
			watchStatus: "plan_to_watch" as WatchStatus,
			startedDate: "",
		},
		onSubmit: async ({ value }) => {
			if (!wizardResult) {
				return;
			}

			setWizardSubmitting(true);
			setWizardError(null);

			const id = `show_${wizardResult.tmdbId}`;
			const jobId = `job_${wizardResult.tmdbId}_${nanoid(6)}`;

			try {
				const write = zero.mutate(
					mutators.shows.addFromTmdb({
						id,
						jobId,
						tmdbId: wizardResult.tmdbId,
						name: wizardResult.name,
						overview: wizardResult.overview,
						posterPath: wizardResult.posterPath,
						watchStatus: value.watchStatus,
						startedAt: dateInputToMs(value.startedDate),
					}),
				);

				const result = await write.server;
				if (result.type === "error") {
					throw result.error;
				}

				setWizardStep(2);
			} catch (e2) {
				setWizardError(getErrorMessage(e2, "Step 1 failed"));
			} finally {
				setWizardSubmitting(false);
			}
		},
	});

	const step2Form = useAppForm({
		defaultValues: {
			currentSeason: "",
			currentEpisode: "",
			targetFinishDate: "",
		},
		onSubmit: async ({ value }) => {
			if (!wizardResult) {
				return;
			}

			setWizardSubmitting(true);
			setWizardError(null);

			try {
				const write = zero.mutate(
					mutators.shows.updateProgressStep({
						showId: `show_${wizardResult.tmdbId}`,
						currentSeason: toNullableNumber(value.currentSeason),
						currentEpisode: toNullableNumber(value.currentEpisode),
						targetFinishAt: dateInputToMs(value.targetFinishDate),
					}),
				);

				const result = await write.server;
				if (result.type === "error") {
					throw result.error;
				}

				setWizardStep(3);
			} catch (e2) {
				setWizardError(getErrorMessage(e2, "Step 2 failed"));
			} finally {
				setWizardSubmitting(false);
			}
		},
	});

	const step3Form = useAppForm({
		defaultValues: {
			rating: "",
			isFavorite: false,
			notes: "",
		},
		onSubmit: async ({ value }) => {
			if (!wizardResult) {
				return;
			}

			setWizardSubmitting(true);
			setWizardError(null);

			try {
				const write = zero.mutate(
					mutators.shows.completeSetupStep({
						showId: `show_${wizardResult.tmdbId}`,
						rating: toNullableNumber(value.rating),
						isFavorite: value.isFavorite,
						notes: value.notes.trim() ? value.notes.trim() : null,
					}),
				);

				const result = await write.server;
				if (result.type === "error") {
					throw result.error;
				}

				setWizardSuccess({
					showId: `show_${wizardResult.tmdbId}`,
					showName: wizardResult.name,
				});
				setWizardResult(null);
			} catch (e2) {
				setWizardError(getErrorMessage(e2, "Step 3 failed"));
			} finally {
				setWizardSubmitting(false);
			}
		},
	});

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
		setWizardResult(r);
		setWizardStep(1);
		setWizardError(null);
		setWizardSuccess(null);
		step1Form.reset();
		step2Form.reset();
		step3Form.reset();
	};

	const onCancelWizard = () => {
		setWizardResult(null);
		setWizardError(null);
	};

	return (
		<View className="page-container" paddingBlock={6} gap={8}>
			{/* Setup Wizard */}
			{wizardResult ? (
				<View className="wizard-card animate-fade-in" padding={6}>
					<View gap={5}>
						<View direction="row" align="start" justify="space-between" gap={4}>
							<View gap={1}>
								<View direction="row" align="center" gap={2}>
									<Text variant="featured-3" weight="bold">Add to Library</Text>
									<Badge color="primary" size="small">Step {wizardStep}/3</Badge>
								</View>
								<Text variant="body-2" color="neutral-faded">
									{wizardResult.name}
								</Text>
							</View>
							<Button
								variant="ghost"
								color="neutral"
								onClick={onCancelWizard}
							>
								Cancel
							</Button>
						</View>

						{/* Step indicators */}
						<View direction="row" gap={2}>
							{[1, 2, 3].map((step) => (
								<View
									key={step}
									height="4px"
									grow
									borderRadius="large"
									backgroundColor={
										step <= wizardStep ? "primary" : "neutral-faded"
									}
								/>
							))}
						</View>

						{wizardStep === 1 ? (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									void step1Form.handleSubmit();
								}}
							>
								<View gap={4}>
									<Text variant="body-2" weight="medium">Basic Information</Text>
									<step1Form.AppField name="watchStatus">
										{(field) => (
											<field.SelectField
												label="Watch status"
												options={WATCH_STATUS_OPTIONS}
											/>
										)}
									</step1Form.AppField>
									<step1Form.AppField name="startedDate">
										{(field) => (
											<field.TextInputField
												label="Started date (optional)"
												type="date"
											/>
										)}
									</step1Form.AppField>
									<step1Form.AppForm>
										<step1Form.SubmitButton
											disabled={wizardSubmitting}
											idleLabel="Continue"
											submittingLabel="Saving..."
										/>
									</step1Form.AppForm>
								</View>
							</form>
						) : null}

						{wizardStep === 2 ? (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									void step2Form.handleSubmit();
								}}
							>
								<View gap={4}>
									<Text variant="body-2" weight="medium">Progress Tracking</Text>
									<View direction={{ s: "column", m: "row" }} gap={4}>
										<View.Item columns={{ s: 12, m: 6 }}>
											<step2Form.AppField name="currentSeason">
												{(field) => (
													<field.TextInputField
														label="Current season"
														type="number"
														placeholder="e.g., 2"
													/>
												)}
											</step2Form.AppField>
										</View.Item>
										<View.Item columns={{ s: 12, m: 6 }}>
											<step2Form.AppField name="currentEpisode">
												{(field) => (
													<field.TextInputField
														label="Current episode"
														type="number"
														placeholder="e.g., 5"
													/>
												)}
											</step2Form.AppField>
										</View.Item>
									</View>
									<step2Form.AppField name="targetFinishDate">
										{(field) => (
											<field.TextInputField
												label="Target finish date (optional)"
												type="date"
											/>
										)}
									</step2Form.AppField>
									<step2Form.AppForm>
										<step2Form.SubmitButton
											disabled={wizardSubmitting}
											idleLabel="Continue"
											submittingLabel="Saving..."
										/>
									</step2Form.AppForm>
								</View>
							</form>
						) : null}

						{wizardStep === 3 ? (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									void step3Form.handleSubmit();
								}}
							>
								<View gap={4}>
									<Text variant="body-2" weight="medium">Personal Notes</Text>
									<step3Form.AppField name="rating">
										{(field) => (
											<field.TextInputField
												label="Your rating (1-10)"
												type="number"
												placeholder="e.g., 8"
											/>
										)}
									</step3Form.AppField>
									<step3Form.AppField name="isFavorite">
										{(field) => (
											<field.CheckboxField label="Mark as favorite" />
										)}
									</step3Form.AppField>
									<step3Form.AppField name="notes">
										{(field) => (
											<field.TextareaField
												label="Notes"
												rows={3}
											/>
										)}
									</step3Form.AppField>
									<step3Form.AppForm>
										<step3Form.SubmitButton
											disabled={wizardSubmitting}
											idleLabel="Add to Library"
											submittingLabel="Saving..."
										/>
									</step3Form.AppForm>
								</View>
							</form>
						) : null}

						{wizardError ? (
							<Alert color="critical" title="Error">
								{wizardError}
							</Alert>
						) : null}
					</View>
				</View>
			) : null}

			{/* Success Message */}
			{wizardSuccess ? (
				<View className="success-alert animate-fade-in" padding={4}>
					<View direction="row" align="center" gap={3}>
						<View
							width="40px"
							height="40px"
							borderRadius="large"
							backgroundColor="positive"
							align="center"
							justify="center"
						>
							<CheckIcon />
						</View>
						<View grow>
							<Text variant="body-2" weight="medium">Added to your library!</Text>
							<Text variant="body-3" color="neutral-faded">
								{wizardSuccess.showName} is now being enriched with metadata.
							</Text>
						</View>
						<Link
							to="/shows/$showId"
							params={{ showId: wizardSuccess.showId }}
						>
							<Button color="primary" size="small">View Details</Button>
						</Link>
					</View>
				</View>
			) : null}

			{/* Search Section */}
			<View className="search-section" gap={5}>
				<View gap={2}>
					<Text variant="featured-2" weight="bold">
						Discover Shows
					</Text>
					<Text variant="body-2" color="neutral-faded">
						Search TMDB for TV shows and add them to your personal library
					</Text>
				</View>

				<View position="relative" maxWidth="600px">
					<View
						position="absolute"
						insetStart={4}
						insetTop={0}
						insetBottom={0}
						align="center"
						justify="center"
						zIndex={1}
						attributes={{ style: { pointerEvents: "none", color: "var(--rs-color-foreground-neutral-faded)" } }}
					>
						<SearchIcon />
					</View>
					<TextField
						name="search"
						placeholder="Search for a TV show..."
						value={q}
						onChange={({ value }) => setQ(value)}
						inputAttributes={{ style: { paddingLeft: "2.75rem" } }}
					/>
				</View>

				{searchError ? (
					<Alert color="critical" title="Search Error">
						{searchError}
					</Alert>
				) : null}

				{searching ? (
					<View direction="row" gap={3} align="center" paddingBlock={2}>
						<Loader size="small" ariaLabel="Searching" />
						<Text variant="body-3" color="neutral-faded">Finding shows...</Text>
					</View>
				) : null}

				{results.length > 0 ? (
					<View gap={4}>
						<Text variant="body-3" color="neutral-faded">
							{results.length} result{results.length !== 1 ? "s" : ""} found
						</Text>
						<View direction="row" gap={4} wrap>
							{results.slice(0, 12).map((r, index) => {
								const alreadyAdded = tmdbIDsInLibrary.has(r.tmdbId);
								const inWizard = wizardResult?.tmdbId === r.tmdbId;
								return (
									<View.Item
										key={r.tmdbId}
										columns={{ s: 6, m: 4, l: 3 }}
										className="grid-item-animated"
									>
										<View
											className={`search-result-card card-interactive ${alreadyAdded || inWizard ? "" : ""}`}
											height="100%"
										>
											<View gap={0} height="100%">
												{/* Poster */}
												<View
													className="poster-container"
													height="200px"
													width="100%"
												>
													{r.posterPath ? (
														<Image
															src={`${TMDB_IMG}${r.posterPath}`}
															alt={r.name}
														/>
													) : (
														<View
															height="100%"
															align="center"
															justify="center"
															backgroundColor="neutral-faded"
														>
															<TvIcon />
														</View>
													)}
												</View>
												{/* Content */}
												<View padding={3} gap={2} grow>
													<Text variant="body-2" weight="bold" maxLines={1}>
														{r.name}
													</Text>
													<Text variant="caption-1" color="neutral-faded" maxLines={2}>
														{r.overview || "No description available"}
													</Text>
													<View grow />
													<View direction="row" align="center" justify="space-between" gap={2}>
														{alreadyAdded ? (
															<Badge color="positive" size="small">
																In Library
															</Badge>
														) : inWizard ? (
															<Badge color="primary" size="small">
																Adding...
															</Badge>
														) : (
															<Button
																size="small"
																color="primary"
																onClick={() => onAdd(r)}
															>
																<View direction="row" align="center" gap={1}>
																	<PlusIcon />
																	<span>Add</span>
																</View>
															</Button>
														)}
														<Text variant="caption-2" color="neutral-faded">
															#{r.tmdbId}
														</Text>
													</View>
												</View>
											</View>
										</View>
									</View.Item>
								);
							})}
						</View>
					</View>
				) : q.trim().length >= 2 && !searching ? (
					<View paddingBlock={4}>
						<Text variant="body-3" color="neutral-faded">
							No shows found for "{q}"
						</Text>
					</View>
				) : null}
			</View>

			{/* Library Section */}
			<View gap={5}>
				<View direction="row" align="center" justify="space-between" gap={3}>
					<View gap={1}>
						<Text variant="featured-2" weight="bold">
							Your Library
						</Text>
						<Text variant="body-3" color="neutral-faded">
							{libraryRows.length} show{libraryRows.length !== 1 ? "s" : ""} in your collection
						</Text>
					</View>
				</View>

				{libraryRows.length > 0 ? (
					<View direction="row" gap={4} wrap>
						{libraryRows.map((row, index) => (
							<View.Item
								key={row.show.id}
								columns={{ s: 6, m: 4, l: 3 }}
								className="grid-item-animated"
							>
								<Link
									to="/shows/$showId"
									params={{ showId: row.show.id }}
									style={{ textDecoration: "none", display: "block", height: "100%" }}
								>
									<View className="library-card card-interactive" height="100%">
										<View gap={0} height="100%">
											{/* Poster */}
											<View
												className="poster-container"
												height="200px"
												width="100%"
											>
												{row.show.posterPath ? (
													<Image
														src={`${TMDB_IMG}${row.show.posterPath}`}
														alt={row.show.name}
													/>
												) : (
													<View
														height="100%"
														align="center"
														justify="center"
														backgroundColor="neutral-faded"
													>
														<TvIcon />
													</View>
												)}
											</View>
											{/* Content */}
											<View padding={3} gap={2} grow>
												<Text variant="body-2" weight="bold" maxLines={1}>
													{row.show.name}
												</Text>
												<View direction="row" gap={1} align="center" wrap>
													<Badge
														size="small"
														color={row.show.enrichState === "ready" ? "positive" : row.show.enrichState === "error" ? "critical" : "neutral"}
													>
														{row.show.enrichState}
													</Badge>
													<Badge size="small" color="neutral">
														{formatWatchStatus(row.watchStatus)}
													</Badge>
												</View>
												<View grow />
												{row.setupCompletedAt ? (
													<View direction="row" align="center" gap={1}>
														<View
															width="6px"
															height="6px"
															borderRadius="large"
															backgroundColor="positive"
														/>
														<Text variant="caption-2" color="positive">
															Setup complete
														</Text>
													</View>
												) : (
													<View direction="row" align="center" gap={1}>
														<View
															width="6px"
															height="6px"
															borderRadius="large"
															backgroundColor="warning"
														/>
														<Text variant="caption-2" color="warning">
															In progress
														</Text>
													</View>
												)}
											</View>
										</View>
									</View>
								</Link>
							</View.Item>
						))}
					</View>
				) : (
					<View className="empty-state">
						<View align="center" gap={3}>
							<TvIcon />
							<View gap={1}>
								<Text variant="body-2" weight="medium">Your library is empty</Text>
								<Text variant="body-3" color="neutral-faded">
									Search for shows above to start building your collection
								</Text>
							</View>
						</View>
					</View>
				)}
			</View>
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

function formatWatchStatus(status: string | null | undefined): string {
	if (!status) return "Plan to watch";
	return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
