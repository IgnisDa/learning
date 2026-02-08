import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import * as React from "react";
import { useAppForm } from "~/components/forms/app-form";
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
				setWizardError(e2 instanceof Error ? e2.message : "Step 1 failed");
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
						currentSeason: toNullablePositiveInt(value.currentSeason),
						currentEpisode: toNullablePositiveInt(value.currentEpisode),
						targetFinishAt: dateInputToMs(value.targetFinishDate),
					}),
				);

				const result = await write.server;
				if (result.type === "error") {
					throw result.error;
				}

				setWizardStep(3);
			} catch (e2) {
				setWizardError(e2 instanceof Error ? e2.message : "Step 2 failed");
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
						rating: toNullableRating(value.rating),
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
				setWizardError(e2 instanceof Error ? e2.message : "Step 3 failed");
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
		<div className="p-4 space-y-8">
			{wizardResult ? (
				<div className="p-4 space-y-3 bg-white border rounded-lg shadow-sm dark:bg-gray-900">
					<div className="flex flex-wrap items-start justify-between gap-2">
						<div>
							<h2 className="text-lg font-semibold">Add show setup</h2>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								{wizardResult.name} - Step {wizardStep} of 3
							</div>
						</div>
						<button
							type="button"
							onClick={onCancelWizard}
							className="px-2 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 dark:bg-gray-950"
						>
							Cancel
						</button>
					</div>

					{wizardStep === 1 ? (
						<form
							className="space-y-3"
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								void step1Form.handleSubmit();
							}}
						>
							<step1Form.AppField name="watchStatus">
								{(field) => (
									<field.SelectField
										label="Watch status"
										options={WATCH_STATUS_OPTIONS}
										className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
									/>
								)}
							</step1Form.AppField>
							<step1Form.AppField name="startedDate">
								{(field) => (
									<field.TextInputField
										label="Started date (optional)"
										type="date"
										className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
									/>
								)}
							</step1Form.AppField>
							<step1Form.AppForm>
								<step1Form.SubmitButton
									disabled={wizardSubmitting}
									idleLabel="Save and continue"
									submittingLabel="Saving..."
									className="px-3 text-sm font-medium text-white bg-blue-600 rounded-md h-9 hover:bg-blue-500 disabled:opacity-60"
								/>
							</step1Form.AppForm>
						</form>
					) : null}

					{wizardStep === 2 ? (
						<form
							className="space-y-3"
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								void step2Form.handleSubmit();
							}}
						>
							<div className="grid gap-3 sm:grid-cols-2">
								<step2Form.AppField name="currentSeason">
									{(field) => (
										<field.TextInputField
											label="Current season (optional)"
											type="number"
											min={1}
											className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
										/>
									)}
								</step2Form.AppField>
								<step2Form.AppField name="currentEpisode">
									{(field) => (
										<field.TextInputField
											label="Current episode (optional)"
											type="number"
											min={1}
											className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
										/>
									)}
								</step2Form.AppField>
							</div>
							<step2Form.AppField name="targetFinishDate">
								{(field) => (
									<field.TextInputField
										label="Target finish date (optional)"
										type="date"
										className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
									/>
								)}
							</step2Form.AppField>
							<step2Form.AppForm>
								<step2Form.SubmitButton
									disabled={wizardSubmitting}
									idleLabel="Save and continue"
									submittingLabel="Saving..."
									className="px-3 text-sm font-medium text-white bg-blue-600 rounded-md h-9 hover:bg-blue-500 disabled:opacity-60"
								/>
							</step2Form.AppForm>
						</form>
					) : null}

					{wizardStep === 3 ? (
						<form
							className="space-y-3"
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								void step3Form.handleSubmit();
							}}
						>
							<step3Form.AppField name="rating">
								{(field) => (
									<field.TextInputField
										label="Rating (1-10, optional)"
										type="number"
										min={1}
										max={10}
										className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
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
										className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md dark:bg-gray-950"
									/>
								)}
							</step3Form.AppField>
							<step3Form.AppForm>
								<step3Form.SubmitButton
									disabled={wizardSubmitting}
									idleLabel="Finish setup"
									submittingLabel="Saving..."
									className="px-3 text-sm font-medium text-white bg-blue-600 rounded-md h-9 hover:bg-blue-500 disabled:opacity-60"
								/>
							</step3Form.AppForm>
						</form>
					) : null}

					{wizardError ? (
						<div className="text-sm text-red-700 dark:text-red-300">{wizardError}</div>
					) : null}
				</div>
			) : null}

			{wizardSuccess ? (
				<div className="p-3 text-sm text-green-800 border border-green-200 rounded-lg bg-green-50 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-200">
					Saved setup for {wizardSuccess.showName}.{" "}
					<Link
						to="/shows/$showId"
						params={{ showId: wizardSuccess.showId }}
						className="underline"
					>
						Open details
					</Link>
				</div>
			) : null}

			<div className="space-y-2">
				<h1 className="text-xl font-semibold">TMDB search</h1>
				<div className="text-sm text-gray-600 dark:text-gray-400">
					Type 2+ characters. Start setup to save step 1, then continue through the
					multi-step form.
				</div>

				<input
					className="w-full max-w-xl px-3 py-2 text-sm bg-white border rounded-md shadow-sm dark:bg-gray-900"
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
							const inWizard = wizardResult?.tmdbId === r.tmdbId;
							return (
								<div
									key={r.tmdbId}
									className="flex gap-3 p-3 bg-white border rounded-lg shadow-sm dark:bg-gray-900"
								>
									<div className="h-20 overflow-hidden bg-gray-200 rounded w-14 shrink-0 dark:bg-gray-800">
										{r.posterPath ? (
											<img
												alt=""
												className="object-cover w-full h-full"
												src={`${TMDB_IMG}${r.posterPath}`}
												loading="lazy"
											/>
										) : null}
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium truncate">{r.name}</div>
										<div className="text-xs text-gray-600 line-clamp-2 dark:text-gray-400">
											{r.overview || "No overview"}
										</div>
										<div className="flex items-center justify-between gap-2 mt-2">
											<button
												disabled={alreadyAdded || inWizard}
												className={
													alreadyAdded || inWizard
														? "rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
														: "rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
												}
												onClick={() => onAdd(r)}
												type="button"
											>
												{alreadyAdded ? "Added" : inWizard ? "In setup" : "Start setup"}
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
				{libraryRows.length ? (
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{libraryRows.map((row) => (
							<Link
								key={row.show.id}
								to="/shows/$showId"
								params={{
									showId: row.show.id,
								}}
								className="flex gap-3 p-3 bg-white border rounded-lg shadow-sm hover:border-gray-400 dark:bg-gray-900"
							>
								<div className="h-20 overflow-hidden bg-gray-200 rounded w-14 shrink-0 dark:bg-gray-800">
									{row.show.posterPath ? (
										<img
											alt=""
											className="object-cover w-full h-full"
											src={`${TMDB_IMG}${row.show.posterPath}`}
											loading="lazy"
										/>
									) : null}
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium truncate">{row.show.name}</div>
									<div className="flex items-center gap-2 mt-1">
										<span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200">
											{row.show.enrichState}
										</span>
										<span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200">
											{row.watchStatus ?? "plan_to_watch"}
										</span>
										<span className="text-xs text-gray-500">
											TMDB #{row.show.tmdbId}
										</span>
									</div>
									{row.setupCompletedAt ? (
										<div className="mt-1 text-xs text-green-700 dark:text-green-300">
											Setup completed
										</div>
									) : (
										<div className="mt-1 text-xs text-amber-700 dark:text-amber-300">
											Setup draft in progress
										</div>
									)}
									{row.show.enrichError ? (
										<div className="mt-1 text-xs text-red-700 line-clamp-2 dark:text-red-300">
											{row.show.enrichError}
										</div>
									) : null}
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="text-sm text-gray-600 dark:text-gray-400">
						No shows yet. Search above and click "Start setup".
					</div>
				)}
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
