import { eq, and } from "drizzle-orm";
import { db, schema } from "../db";
import { tmdbFetch } from "./client";
import type { TmdbTvDetails, TmdbTvSeasonDetails, TmdbTvCredits } from "./types";
import type { CastCredit, CrewCredit } from "../../drizzle/schema";

export async function importShowFromTmdb(showId: string, tmdbId: number): Promise<void> {
  // Fetch show details
  const tvDetails = await tmdbFetch<TmdbTvDetails>(`/tv/${tmdbId}`);

  // Update show metadata
  await db
    .update(schema.shows)
    .set({
      overview: tvDetails.overview || null,
      posterPath: tvDetails.poster_path || null,
      updatedAt: new Date(),
    })
    .where(eq(schema.shows.id, showId));

  // Get season numbers
  const seasonNumbers = (tvDetails.seasons ?? [])
    .map((season) => season.season_number)
    .filter((seasonNumber) => Number.isFinite(seasonNumber))
    .sort((a, b) => a - b);

  // Fetch and import show credits
  await importShowCredits(showId, tmdbId);

  // Fetch and import all seasons
  await Promise.all(
    seasonNumbers.map((seasonNumber) =>
      importSeasonDetails(showId, tmdbId, seasonNumber)
    )
  );

  // Delete stale seasons (seasons that no longer exist in TMDB)
  const existingSeasons = await db
    .select()
    .from(schema.seasons)
    .where(eq(schema.seasons.showId, showId));

  const seasonNumbersSet = new Set(seasonNumbers);
  
  for (const season of existingSeasons) {
    if (!seasonNumbersSet.has(season.seasonNumber)) {
      // Delete episodes first (cascade should handle this, but being explicit)
      await db.delete(schema.episodes).where(eq(schema.episodes.seasonId, season.id));
      // Delete season
      await db.delete(schema.seasons).where(eq(schema.seasons.id, season.id));
    }
  }
}

async function importShowCredits(showId: string, tmdbId: number): Promise<void> {
  const credits = await tmdbFetch<TmdbTvCredits>(`/tv/${tmdbId}/credits`);

  // Delete existing credits for this show
  await db.delete(schema.credits).where(eq(schema.credits.showId, showId));

  // Process cast
  const castMembers = credits.cast ?? [];
  for (const cast of castMembers) {
    const personId = await upsertPerson({
      name: cast.name,
      tmdbPersonId: cast.id,
      profilePath: cast.profile_path || undefined,
    });

    await db.insert(schema.credits).values({
      showId,
      personId,
      kind: "cast",
      character: cast.character || null,
      orderIndex: cast.order ?? null,
      job: null,
      department: null,
    });
  }

  // Process crew
  const crewMembers = credits.crew ?? [];
  for (const crew of crewMembers) {
    const personId = await upsertPerson({
      name: crew.name,
      tmdbPersonId: crew.id,
      profilePath: crew.profile_path || undefined,
    });

    await db.insert(schema.credits).values({
      showId,
      personId,
      kind: "crew",
      character: null,
      orderIndex: null,
      job: crew.job || null,
      department: crew.department || null,
    });
  }
}

async function importSeasonDetails(
  showId: string,
  tmdbId: number,
  seasonNumber: number
): Promise<void> {
  const season = await tmdbFetch<TmdbTvSeasonDetails>(
    `/tv/${tmdbId}/season/${seasonNumber}`
  );

  // Check if season already exists
  const existingSeason = await db
    .select()
    .from(schema.seasons)
    .where(
      and(
        eq(schema.seasons.showId, showId),
        eq(schema.seasons.seasonNumber, seasonNumber)
      )
    )
    .limit(1);

  let seasonId: string;

  if (existingSeason.length > 0) {
    // Update existing season
    await db
      .update(schema.seasons)
      .set({
        name: season.name || `Season ${seasonNumber}`,
        airDate: season.air_date || null,
        overview: season.overview || null,
        posterPath: season.poster_path || null,
        episodeCount:
          typeof season.episode_count === "number"
            ? season.episode_count
            : (season.episodes ?? []).length,
      })
      .where(eq(schema.seasons.id, existingSeason[0].id));

    seasonId = existingSeason[0].id;

    // Delete existing episodes
    await db.delete(schema.episodes).where(eq(schema.episodes.seasonId, seasonId));
  } else {
    // Insert new season
    const newSeason = await db
      .insert(schema.seasons)
      .values({
        showId,
        name: season.name || `Season ${seasonNumber}`,
        seasonNumber,
        airDate: season.air_date || null,
        overview: season.overview || null,
        posterPath: season.poster_path || null,
        episodeCount:
          typeof season.episode_count === "number"
            ? season.episode_count
            : (season.episodes ?? []).length,
      })
      .returning();

    seasonId = newSeason[0].id;
  }

  // Import episodes
  const episodes = season.episodes ?? [];
  
  for (const episode of episodes) {
    const castCredits: CastCredit[] = (episode.guest_stars ?? []).map((cast) => ({
      personName: cast.name,
      personTmdbId: cast.id,
      orderIndex: cast.order,
      character: cast.character,
      profilePath: cast.profile_path || undefined,
    }));

    const crewCredits: CrewCredit[] = (episode.crew ?? []).map((crew) => ({
      personTmdbId: crew.id,
      personName: crew.name,
      job: crew.job,
      department: crew.department,
      profilePath: crew.profile_path || undefined,
    }));

    await db.insert(schema.episodes).values({
      seasonId,
      name: episode.name,
      episodeNumber: episode.episode_number,
      airDate: episode.air_date || null,
      runtime: episode.runtime ?? null,
      overview: episode.overview || null,
      stillPath: episode.still_path || null,
      castCredits,
      crewCredits,
    });
  }
}

async function upsertPerson(person: {
  name: string;
  tmdbPersonId: number;
  profilePath?: string;
}): Promise<string> {
  // Check if person exists
  const existing = await db
    .select()
    .from(schema.persons)
    .where(eq(schema.persons.tmdbPersonId, person.tmdbPersonId))
    .limit(1);

  if (existing.length > 0) {
    // Update existing person
    await db
      .update(schema.persons)
      .set({
        name: person.name,
        profilePath: person.profilePath || null,
      })
      .where(eq(schema.persons.id, existing[0].id));

    return existing[0].id;
  }

  // Insert new person
  const newPerson = await db
    .insert(schema.persons)
    .values({
      name: person.name,
      tmdbPersonId: person.tmdbPersonId,
      profilePath: person.profilePath || null,
    })
    .returning();

  return newPerson[0].id;
}
