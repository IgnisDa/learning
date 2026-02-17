import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import * as React from "react";
import { z } from "zod";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Image,
  Loader,
  Tabs,
  Text,
  View,
} from "reshaped";
import { EmptyState } from "~/components/EmptyState";
import { useAppForm } from "~/components/forms/app-form";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  EditIcon,
  HeartIcon,
  RefreshIcon,
  StarIcon,
  TvIcon,
} from "~/components/icons";
import { LoadingState } from "~/components/LoadingState";
import { PosterImage } from "~/components/PosterImage";
import { TMDB_IMAGE_SIZES } from "~/constants/tmdb";
import {
  WATCH_STATUS_OPTIONS,
  type WatchStatus,
} from "~/constants/watch-status";
import { dateInputToMs, formatMsDate, toDateInputValue } from "~/utils/date";
import { getErrorMessage } from "~/utils/error-message";
import { formatWatchStatus } from "~/utils/format";
import { toNullableNumber } from "~/utils/number";
import { mutators } from "~/zero/mutators";
import { queries } from "~/zero/queries";

const showSearchSchema = z.object({
  showId: z.string().min(1),
});

export const Route = createFileRoute("/shows")({
  validateSearch: showSearchSchema,
  component: ShowDetails,
});

function ShowDetails() {
  const zero = useZero();
  const { showId } = Route.useSearch();

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
      <View className="page-container" paddingBlock={6}>
        <Link to="/">
          <Button variant="ghost" color="neutral" size="small">
            <View direction="row" align="center" gap={1}>
              <ArrowLeftIcon />
              <span>Back to Library</span>
            </View>
          </Button>
        </Link>
        <View paddingTop={8} align="center">
          <View maxWidth="400px">
            <EmptyState
              icon={<TvIcon />}
              title="Show not found"
              description="This show doesn't exist or is not in your library."
            />
          </View>
        </View>
      </View>
    );
  }

  if (!show) {
    return (
      <View className="page-container" paddingBlock={6}>
        <Link to="/">
          <Button variant="ghost" color="neutral" size="small">
            <View direction="row" align="center" gap={1}>
              <ArrowLeftIcon />
              <span>Back to Library</span>
            </View>
          </Button>
        </Link>
        <View paddingTop={8} align="center">
          <LoadingState message="Loading show details..." />
        </View>
      </View>
    );
  }

  return (
    <View>
      {/* Hero Section */}
      <View className="show-hero">
        <View className="page-container">
          {/* Back button */}
          <View paddingBottom={4}>
            <Link to="/">
              <Button variant="ghost" color="neutral" size="small">
                <View direction="row" align="center" gap={1}>
                  <ArrowLeftIcon />
                  <span>Back to Library</span>
                </View>
              </Button>
            </Link>
          </View>

          {/* Hero content */}
          <View
            direction={{ s: "column", m: "row" }}
            gap={6}
            align={{ s: "center", m: "start" }}
          >
            <PosterImage
              posterPath={show.posterPath}
              alt={show.name}
              size="w342"
              className="poster-large poster-container"
            />

            {/* Show info */}
            <View grow gap={4}>
              <View gap={2}>
                <Text variant="featured-1" weight="bold">
                  {show.name}
                </Text>
                <View direction="row" gap={2} align="center" wrap>
                  <Badge
                    color={
                      show.enrichState === "ready"
                        ? "positive"
                        : show.enrichState === "error"
                          ? "critical"
                          : "neutral"
                    }
                  >
                    {show.enrichState}
                  </Badge>
                  <Text variant="body-3" color="neutral-faded">
                    TMDB #{show.tmdbId}
                  </Text>
                  {item?.isFavorite ? (
                    <View
                      direction="row"
                      align="center"
                      gap={1}
                      attributes={{
                        style: { color: "var(--rs-color-foreground-warning)" },
                      }}
                    >
                      <HeartIcon filled />
                      <Text variant="caption-1" color="warning">
                        Favorite
                      </Text>
                    </View>
                  ) : null}
                  {item?.rating ? (
                    <View direction="row" align="center" gap={1}>
                      <View
                        attributes={{
                          style: {
                            color: "var(--rs-color-foreground-warning)",
                          },
                        }}
                      >
                        <StarIcon />
                      </View>
                      <Text variant="body-3" weight="medium">
                        {item.rating}/10
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {show.enrichError ? (
                <Alert color="critical" title="Enrichment Error">
                  {show.enrichError}
                </Alert>
              ) : null}

              <Text variant="body-2" color="neutral-faded" maxLines={4}>
                {show.overview ?? "No overview available."}
              </Text>

              <View direction="row" gap={3} wrap>
                <Button color="primary" onClick={onEnrich}>
                  <View direction="row" align="center" gap={2}>
                    <RefreshIcon />
                    <span>Refresh Metadata</span>
                  </View>
                </Button>
                {!isEditingSetup && (
                  <Button variant="outline" onClick={beginEditSetup}>
                    <View direction="row" align="center" gap={2}>
                      <EditIcon />
                      <span>Edit Tracking</span>
                    </View>
                  </Button>
                )}
              </View>

              {show.enrichState !== "ready" ? (
                <View
                  padding={3}
                  borderRadius="medium"
                  backgroundColor="neutral-faded"
                  direction="row"
                  align="center"
                  gap={3}
                >
                  <Loader size="small" ariaLabel="Enriching" />
                  <Text variant="body-3" color="neutral-faded">
                    Fetching seasons, cast & crew data...
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      {/* Main content */}
      <View className="page-container" paddingBlock={6} gap={6}>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={({ value }) => setActiveTab(value as typeof activeTab)}
        >
          <Tabs.List>
            <Tabs.Item value="tracking">Your Tracking</Tabs.Item>
            <Tabs.Item value="seasons">Seasons ({seasons.length})</Tabs.Item>
            <Tabs.Item value="cast">Cast ({cast.length})</Tabs.Item>
            <Tabs.Item value="crew">Crew ({crew.length})</Tabs.Item>
          </Tabs.List>
        </Tabs>

        {/* Tab content */}
        {activeTab === "tracking" ? (
          <View gap={5}>
            {isEditingSetup ? (
              <View className="form-card animate-fade-in">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void editForm.handleSubmit();
                  }}
                >
                  <View gap={5}>
                    <View
                      direction="row"
                      align="center"
                      justify="space-between"
                      gap={3}
                    >
                      <Text variant="featured-3" weight="bold">
                        Edit Tracking Details
                      </Text>
                      <Button
                        variant="ghost"
                        color="neutral"
                        size="small"
                        onClick={() => {
                          setIsEditingSetup(false);
                          setEditError(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </View>

                    <Divider />

                    <View direction={{ s: "column", m: "row" }} gap={4}>
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
                    </View>

                    <View direction={{ s: "column", m: "row" }} gap={4}>
                      <View.Item columns={{ s: 12, m: 6 }}>
                        <editForm.AppField name="currentSeason">
                          {(field) => (
                            <field.TextInputField
                              label="Current season"
                              type="number"
                              placeholder="e.g., 2"
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
                              placeholder="e.g., 5"
                            />
                          )}
                        </editForm.AppField>
                      </View.Item>
                    </View>

                    <View direction={{ s: "column", m: "row" }} gap={4}>
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
                              label="Your rating (1-10)"
                              placeholder="e.g., 8"
                            />
                          )}
                        </editForm.AppField>
                      </View.Item>
                    </View>

                    <editForm.AppField name="isFavorite">
                      {(field) => (
                        <field.CheckboxField label="Mark as favorite" />
                      )}
                    </editForm.AppField>

                    <editForm.AppField name="notes">
                      {(field) => (
                        <field.TextareaField label="Personal notes" rows={4} />
                      )}
                    </editForm.AppField>

                    <editForm.AppForm>
                      <editForm.SubmitButton
                        idleLabel="Save Changes"
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
              </View>
            ) : null}

            {/* Tracking details display */}
            <View className="form-card">
              <View gap={4}>
                <Text variant="featured-3" weight="bold">
                  Tracking Details
                </Text>
                <Divider />

                <View direction={{ s: "column", m: "row" }} gap={4}>
                  <View.Item columns={{ s: 12, m: 6 }}>
                    <DetailCard
                      label="Watch Status"
                      value={formatWatchStatus(item?.watchStatus)}
                    />
                  </View.Item>
                  <View.Item columns={{ s: 12, m: 6 }}>
                    <DetailCard
                      label="Started Date"
                      value={formatMsDate(item?.startedAt ?? null)}
                    />
                  </View.Item>
                </View>

                <View direction={{ s: "column", m: "row" }} gap={4}>
                  <View.Item columns={{ s: 12, m: 6 }}>
                    <DetailCard
                      label="Current Progress"
                      value={
                        item?.currentSeason || item?.currentEpisode
                          ? `Season ${item?.currentSeason ?? "?"}, Episode ${item?.currentEpisode ?? "?"}`
                          : "Not started"
                      }
                    />
                  </View.Item>
                  <View.Item columns={{ s: 12, m: 6 }}>
                    <DetailCard
                      label="Target Finish"
                      value={formatMsDate(item?.targetFinishAt ?? null)}
                    />
                  </View.Item>
                </View>

                <View direction={{ s: "column", m: "row" }} gap={4}>
                  <View.Item columns={{ s: 12, m: 6 }}>
                    <DetailCard
                      label="Your Rating"
                      value={item?.rating ? `${item.rating}/10` : "Not rated"}
                      highlight={!!item?.rating}
                    />
                  </View.Item>
                  <View.Item columns={{ s: 12, m: 6 }}>
                    <DetailCard
                      label="Favorite"
                      value={item?.isFavorite ? "Yes" : "No"}
                      highlight={!!item?.isFavorite}
                    />
                  </View.Item>
                </View>

                {item?.notes ? (
                  <View gap={2}>
                    <Text
                      variant="caption-1"
                      weight="bold"
                      color="neutral-faded"
                    >
                      YOUR NOTES
                    </Text>
                    <View
                      padding={3}
                      borderRadius="medium"
                      backgroundColor="neutral-faded"
                    >
                      <Text
                        variant="body-3"
                        attributes={{ style: { whiteSpace: "pre-wrap" } }}
                      >
                        {item.notes}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}

        {activeTab === "seasons" ? (
          <View gap={4}>
            {seasons.length > 0 ? (
              seasons.map((s) => {
                const isExpanded = expandedSeasons.has(s.id);
                const episodes = s.episodes ?? [];
                return (
                  <View
                    key={s.id}
                    className="season-card"
                    attributes={{
                      onClick: () => toggleSeason(s.id),
                      style: { cursor: "pointer" },
                    }}
                  >
                    <View
                      className="season-card-header"
                      direction="row"
                      gap={4}
                      align="center"
                    >
                      {/* Season poster */}
                      <View
                        className="poster-container"
                        width="80px"
                        height="120px"
                        borderRadius="small"
                      >
                        {s.posterPath ? (
                          <Image
                            src={`${TMDB_IMAGE_SIZES.w342}${s.posterPath}`}
                            alt={s.name || `Season ${s.seasonNumber}`}
                          />
                        ) : (
                          <View
                            height="100%"
                            align="center"
                            justify="center"
                            backgroundColor="neutral-faded"
                          >
                            <Text variant="caption-1" color="neutral-faded">
                              S{s.seasonNumber}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Season info */}
                      <View grow gap={1}>
                        <View direction="row" align="center" gap={2}>
                          <Text variant="body-1" weight="bold">
                            Season {s.seasonNumber}
                          </Text>
                          {s.name && s.name !== `Season ${s.seasonNumber}` && (
                            <Text variant="body-2" color="neutral-faded">
                              {s.name}
                            </Text>
                          )}
                        </View>
                        <View direction="row" gap={3} align="center">
                          <Text variant="body-3" color="neutral-faded">
                            {s.episodeCount
                              ? `${s.episodeCount} episodes`
                              : "Episodes unknown"}
                          </Text>
                          {s.airDate && (
                            <Text variant="body-3" color="neutral-faded">
                              {s.airDate}
                            </Text>
                          )}
                        </View>
                        {s.overview && (
                          <Text
                            variant="caption-1"
                            color="neutral-faded"
                            maxLines={2}
                          >
                            {s.overview}
                          </Text>
                        )}
                      </View>

                      {/* Expand indicator */}
                      <View
                        attributes={{
                          style: {
                            transition: "transform 0.2s ease",
                            transform: isExpanded
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          },
                        }}
                      >
                        <ChevronRightIcon />
                      </View>
                    </View>

                    {isExpanded && (
                      <View className="season-card-expanded" gap={3}>
                        {episodes.length > 0 ? (
                          episodes.map((ep) => (
                            <View key={ep.id} className="episode-card">
                              <View direction="row" gap={3}>
                                <View
                                  className="poster-container"
                                  width="120px"
                                  height="68px"
                                  borderRadius="small"
                                >
                                  {ep.stillPath ? (
                                    <Image
                                      src={`${TMDB_IMAGE_SIZES.w300}${ep.stillPath}`}
                                      alt={
                                        ep.name || `Episode ${ep.episodeNumber}`
                                      }
                                    />
                                  ) : (
                                    <View
                                      height="100%"
                                      align="center"
                                      justify="center"
                                      backgroundColor="disabled"
                                    >
                                      <Text
                                        variant="caption-2"
                                        color="neutral-faded"
                                      >
                                        E{ep.episodeNumber}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                                <View grow gap={1}>
                                  <Text variant="body-2" weight="medium">
                                    {ep.episodeNumber}. {ep.name || "Untitled"}
                                  </Text>
                                  <View direction="row" gap={2} align="center">
                                    {ep.airDate && (
                                      <Text
                                        variant="caption-1"
                                        color="neutral-faded"
                                      >
                                        {ep.airDate}
                                      </Text>
                                    )}
                                    {ep.runtime && (
                                      <Text
                                        variant="caption-1"
                                        color="neutral-faded"
                                      >
                                        {ep.runtime} min
                                      </Text>
                                    )}
                                  </View>
                                  {ep.overview && (
                                    <Text
                                      variant="caption-1"
                                      color="neutral-faded"
                                      maxLines={2}
                                    >
                                      {ep.overview}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </View>
                          ))
                        ) : (
                          <View padding={4} align="center">
                            <Text variant="body-3" color="neutral-faded">
                              No episode data available. Try refreshing
                              metadata.
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <EmptyState
                icon={<TvIcon />}
                title="No seasons available"
                description="Season data will appear here after enrichment completes."
              />
            )}
          </View>
        ) : null}

        {activeTab === "cast" ? (
          <View gap={4}>
            {cast.length > 0 ? (
              <View direction="row" gap={4} wrap>
                {cast.slice(0, 24).map((c) => (
                  <View.Item key={c.id} columns={{ s: 12, m: 6, l: 4 }}>
                    <View className="person-card">
                      <View direction="row" gap={3} align="center">
                        <Avatar
                          size={12}
                          src={
                            c.person?.profilePath
                              ? `${TMDB_IMAGE_SIZES.w185}${c.person.profilePath}`
                              : undefined
                          }
                          initials={getInitials(c.person?.name ?? "Unknown")}
                        />
                        <View grow gap={0}>
                          <Text variant="body-2" weight="medium" maxLines={1}>
                            {c.person?.name ?? "Unknown"}
                          </Text>
                          <Text
                            variant="caption-1"
                            color="neutral-faded"
                            maxLines={1}
                          >
                            {c.character ?? "Unknown role"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View.Item>
                ))}
              </View>
            ) : (
              <EmptyState
                title="No cast information"
                description="Cast data will appear here after enrichment completes."
              />
            )}
          </View>
        ) : null}

        {activeTab === "crew" ? (
          <View gap={4}>
            {crew.length > 0 ? (
              <View direction="row" gap={4} wrap>
                {crew.slice(0, 24).map((c) => (
                  <View.Item key={c.id} columns={{ s: 12, m: 6, l: 4 }}>
                    <View className="person-card">
                      <View direction="row" gap={3} align="center">
                        <Avatar
                          size={12}
                          src={
                            c.person?.profilePath
                              ? `${TMDB_IMAGE_SIZES.w185}${c.person.profilePath}`
                              : undefined
                          }
                          initials={getInitials(c.person?.name ?? "Unknown")}
                        />
                        <View grow gap={0}>
                          <Text variant="body-2" weight="medium" maxLines={1}>
                            {c.person?.name ?? "Unknown"}
                          </Text>
                          <Text
                            variant="caption-1"
                            color="neutral-faded"
                            maxLines={1}
                          >
                            {[c.department, c.job]
                              .filter(Boolean)
                              .join(" - ") || "Unknown role"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View.Item>
                ))}
              </View>
            ) : (
              <EmptyState
                title="No crew information"
                description="Crew data will appear here after enrichment completes."
              />
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function DetailCard(props: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View
      padding={3}
      borderRadius="medium"
      backgroundColor={props.highlight ? "primary-faded" : "neutral-faded"}
    >
      <Text variant="caption-1" weight="bold" color="neutral-faded">
        {props.label.toUpperCase()}
      </Text>
      <Text variant="body-2" weight={props.highlight ? "bold" : "regular"}>
        {props.value}
      </Text>
    </View>
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
