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
		<View padding={4} gap={8}>
			{wizardResult ? (
				<Card>
					<View gap={3}>
						<View direction="row" align="start" justify="space-between" gap={2} wrap>
							<View>
								<Text variant="title-6">{`Add show setup`}</Text>
								<Text variant="body-3" color="neutral-faded">
									{wizardResult.name} - Step {wizardStep} of 3
								</Text>
							</View>
							<Button
								variant="outline"
								size="small"
								onClick={onCancelWizard}
							>
								Cancel
							</Button>
						</View>

						{wizardStep === 1 ? (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									void step1Form.handleSubmit();
								}}
							>
								<View gap={3}>
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
											idleLabel="Save and continue"
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
								<View gap={3}>
									<View direction={{ s: "column", m: "row" }} gap={3}>
										<View.Item columns={{ s: 12, m: 6 }}>
											<step2Form.AppField name="currentSeason">
												{(field) => (
													<field.TextInputField
														label="Current season (optional)"
														type="number"
													/>
												)}
											</step2Form.AppField>
										</View.Item>
										<View.Item columns={{ s: 12, m: 6 }}>
											<step2Form.AppField name="currentEpisode">
												{(field) => (
													<field.TextInputField
														label="Current episode (optional)"
														type="number"
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
											idleLabel="Save and continue"
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
								<View gap={3}>
									<step3Form.AppField name="rating">
										{(field) => (
											<field.TextInputField
												label="Rating (1-10, optional)"
												type="number"
											/>
										)}
									</step3Form.AppField>
									<step3Form.AppField name="isFavorite">
										{(field) => (
											<field.CheckboxField label="Favorite show" />
										)}
									</step3Form.AppField>
									<step3Form.AppField name="notes">
										{(field) => (
											<field.TextareaField
												label="Notes (optional)"
												rows={4}
											/>
										)}
									</step3Form.AppField>
									<step3Form.AppForm>
										<step3Form.SubmitButton
											disabled={wizardSubmitting}
											idleLabel="Finish setup"
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
				</Card>
			) : null}

			{wizardSuccess ? (
				<Alert color="positive" title="Success">
					<Text>
						Saved setup for {wizardSuccess.showName}.{" "}
						<Link
							to="/shows/$showId"
							params={{ showId: wizardSuccess.showId }}
							style={{ textDecoration: "underline" }}
						>
							Open details
						</Link>
					</Text>
				</Alert>
			) : null}

			<View gap={3}>
				<Text variant="title-5">TMDB search</Text>
				<Text variant="body-3" color="neutral-faded">
					Type 2+ characters. Start setup to save step 1, then continue through the
					multi-step form.
				</Text>

				<View maxWidth="600px">
					<TextField
						name="search"
						placeholder="Search TV shows..."
						value={q}
						onChange={({ value }) => setQ(value)}
					/>
				</View>

				{searchError ? (
					<Alert color="critical" title="Search Error">
						{searchError}
					</Alert>
				) : null}

				{searching ? (
					<View direction="row" gap={2} align="center">
						<Loader size="small" ariaLabel="Searching" />
						<Text variant="body-3" color="neutral-faded">Searching...</Text>
					</View>
				) : null}

				{results.length ? (
					<View direction="row" gap={3} wrap>
						{results.slice(0, 12).map((r) => {
							const alreadyAdded = tmdbIDsInLibrary.has(r.tmdbId);
							const inWizard = wizardResult?.tmdbId === r.tmdbId;
							return (
								<View.Item key={r.tmdbId} columns={{ s: 12, m: 6, l: 4 }}>
									<Card>
										<View direction="row" gap={3}>
											<View
												width="56px"
												height="80px"
												borderRadius="small"
												overflow="hidden"
												backgroundColor="neutral-faded"
											>
												{r.posterPath ? (
													<Image
														src={`${TMDB_IMG}${r.posterPath}`}
														alt=""
														width="56px"
														height="80px"
													/>
												) : null}
											</View>
											<View grow gap={1}>
												<Text variant="body-2" weight="medium" maxLines={1}>
													{r.name}
												</Text>
												<Text variant="caption-1" color="neutral-faded" maxLines={2}>
													{r.overview || "No overview"}
												</Text>
												<View direction="row" align="center" justify="space-between" gap={2}>
													<Button
														size="small"
														disabled={alreadyAdded || inWizard}
														color={alreadyAdded || inWizard ? "neutral" : "primary"}
														onClick={() => onAdd(r)}
													>
														{alreadyAdded ? "Added" : inWizard ? "In setup" : "Start setup"}
													</Button>
													<Text variant="caption-2" color="neutral-faded">
														TMDB #{r.tmdbId}
													</Text>
												</View>
											</View>
										</View>
									</Card>
								</View.Item>
							);
						})}
					</View>
				) : null}
			</View>

			<View gap={3}>
				<Text variant="title-5">Your library</Text>
				{libraryRows.length ? (
					<View direction="row" gap={3} wrap>
						{libraryRows.map((row) => (
							<View.Item key={row.show.id} columns={{ s: 12, m: 6, l: 4 }}>
								<Link
									to="/shows/$showId"
									params={{ showId: row.show.id }}
									style={{ textDecoration: "none" }}
								>
									<Card>
										<View direction="row" gap={3}>
											<View
												width="56px"
												height="80px"
												borderRadius="small"
												overflow="hidden"
												backgroundColor="neutral-faded"
											>
												{row.show.posterPath ? (
													<Image
														src={`${TMDB_IMG}${row.show.posterPath}`}
														alt=""
														width="56px"
														height="80px"
													/>
												) : null}
											</View>
											<View grow gap={1}>
												<Text variant="body-2" weight="medium" maxLines={1}>
													{row.show.name}
												</Text>
												<View direction="row" gap={1} align="center" wrap>
													<Badge size="small">{row.show.enrichState}</Badge>
													<Badge size="small">{row.watchStatus ?? "plan_to_watch"}</Badge>
													<Text variant="caption-2" color="neutral-faded">
														TMDB #{row.show.tmdbId}
													</Text>
												</View>
												{row.setupCompletedAt ? (
													<Text variant="caption-1" color="positive">
														Setup completed
													</Text>
												) : (
													<Text variant="caption-1" color="warning">
														Setup draft in progress
													</Text>
												)}
												{row.show.enrichError ? (
													<Text variant="caption-1" color="critical" maxLines={2}>
														{row.show.enrichError}
													</Text>
												) : null}
											</View>
										</View>
									</Card>
								</Link>
							</View.Item>
						))}
					</View>
				) : (
					<Text variant="body-3" color="neutral-faded">
						No shows yet. Search above and click "Start setup".
					</Text>
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
