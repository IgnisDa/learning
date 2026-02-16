import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import * as React from "react";
import { Alert, Badge, Button, Loader, Text, TextField, View } from "reshaped";
import { EmptyState } from "~/components/EmptyState";
import { useAppForm } from "~/components/forms/app-form";
import { CheckIcon, PlusIcon, SearchIcon, TvIcon } from "~/components/icons";
import { PosterImage } from "~/components/PosterImage";
import {
  WATCH_STATUS_OPTIONS,
  type WatchStatus,
} from "~/constants/watch-status";
import { useTmdbSearch, type SearchResult } from "~/hooks/use-tmdb";
import { dateInputToMs } from "~/utils/date";
import { getErrorMessage } from "~/utils/error-message";
import { formatWatchStatus } from "~/utils/format";
import { toNullableNumber } from "~/utils/number";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const zero = useZero();
  const [libraryItems] = useQuery(queries.library.items());

  const libraryRows = React.useMemo(() => {
    const list = libraryItems.flatMap((item) =>
      item.show
        ? [
            {
              show: item.show,
              watchStatus: item.watchStatus,
              setupCompletedAt: item.setupCompletedAt,
            },
          ]
        : [],
    );

    list.sort((a, b) => a.show.name.localeCompare(b.show.name));
    return list;
  }, [libraryItems]);

  const tmdbIDsInLibrary = React.useMemo(() => {
    return new Set(libraryRows.map((row) => row.show.tmdbId));
  }, [libraryRows]);

  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const {
    data: results = [],
    isLoading: searching,
    error: searchError,
  } = useTmdbSearch(debouncedQ);

  const [wizardResult, setWizardResult] = React.useState<SearchResult | null>(
    null,
  );
  const [wizardStep, setWizardStep] = React.useState<1 | 2 | 3>(1);
  const [wizardSubmitting, setWizardSubmitting] = React.useState(false);
  const [wizardError, setWizardError] = React.useState<string | null>(null);
  const [wizardSuccess, setWizardSuccess] = React.useState<{
    showId: string;
    showName: string;
  } | null>(null);

  const step1Form = useAppForm({
    defaultValues: {
      startedDate: "",
      watchStatus: "plan_to_watch" as WatchStatus,
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
            name: wizardResult.name,
            tmdbId: wizardResult.tmdbId,
            watchStatus: value.watchStatus,
            overview: wizardResult.overview,
            posterPath: wizardResult.posterPath,
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

  // Debounce search query
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q);
    }, 300);

    return () => {
      window.clearTimeout(timer);
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
                  <Text variant="featured-3" weight="bold">
                    Add to Library
                  </Text>
                  <Badge color="primary" size="small">
                    Step {wizardStep}/3
                  </Badge>
                </View>
                <Text variant="body-2" color="neutral-faded">
                  {wizardResult.name}
                </Text>
              </View>
              <Button variant="ghost" color="neutral" onClick={onCancelWizard}>
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
                  <Text variant="body-2" weight="medium">
                    Basic Information
                  </Text>
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
                  <Text variant="body-2" weight="medium">
                    Progress Tracking
                  </Text>
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
                  <Text variant="body-2" weight="medium">
                    Personal Notes
                  </Text>
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
                    {(field) => <field.TextareaField label="Notes" rows={3} />}
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
              <Text variant="body-2" weight="medium">
                Added to your library!
              </Text>
              <Text variant="body-3" color="neutral-faded">
                {wizardSuccess.showName} is now being enriched with metadata.
              </Text>
            </View>
            <Link to="/shows/$showId" params={{ showId: wizardSuccess.showId }}>
              <Button color="primary" size="small">
                View Details
              </Button>
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
            attributes={{
              style: {
                pointerEvents: "none",
                color: "var(--rs-color-foreground-neutral-faded)",
              },
            }}
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
            {searchError instanceof Error
              ? searchError.message
              : "Search failed"}
          </Alert>
        ) : null}

        {searching ? (
          <View direction="row" gap={3} align="center" paddingBlock={2}>
            <Loader size="small" ariaLabel="Searching" />
            <Text variant="body-3" color="neutral-faded">
              Finding shows...
            </Text>
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
                        <PosterImage
                          posterPath={r.posterPath}
                          alt={r.name}
                          height="200px"
                        />
                        {/* Content */}
                        <View padding={3} gap={2} grow>
                          <Text variant="body-2" weight="bold" maxLines={1}>
                            {r.name}
                          </Text>
                          <Text
                            variant="caption-1"
                            color="neutral-faded"
                            maxLines={2}
                          >
                            {r.overview || "No description available"}
                          </Text>
                          <View grow />
                          <View
                            direction="row"
                            align="center"
                            justify="space-between"
                            gap={2}
                          >
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
              {libraryRows.length} show{libraryRows.length !== 1 ? "s" : ""} in
              your collection
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
                  style={{
                    textDecoration: "none",
                    display: "block",
                    height: "100%",
                  }}
                >
                  <View className="library-card card-interactive" height="100%">
                    <View gap={0} height="100%">
                      <PosterImage
                        posterPath={row.show.posterPath}
                        alt={row.show.name}
                        height="200px"
                      />
                      {/* Content */}
                      <View padding={3} gap={2} grow>
                        <Text variant="body-2" weight="bold" maxLines={1}>
                          {row.show.name}
                        </Text>
                        <View direction="row" gap={1} align="center" wrap>
                          <Badge
                            size="small"
                            color={
                              row.show.enrichState === "ready"
                                ? "positive"
                                : row.show.enrichState === "error"
                                  ? "critical"
                                  : "neutral"
                            }
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
          <EmptyState
            icon={<TvIcon />}
            title="Your library is empty"
            description="Search for shows above to start building your collection"
          />
        )}
      </View>
    </View>
  );
}
