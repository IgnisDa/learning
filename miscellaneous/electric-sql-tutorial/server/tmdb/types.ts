export type TmdbSearchTvResponse = {
  results?: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    first_air_date: string | undefined;
  }>;
};

export type TmdbTvDetails = {
  name: string;
  overview?: string;
  poster_path?: string | null;
  seasons?: Array<{
    season_number: number;
  }>;
};

export type TmdbTvSeasonDetails = {
  season_number: number;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  episode_count?: number | null;
  air_date?: string | null;
  episodes?: Array<{
    episode_number: number;
    name: string;
    overview?: string;
    still_path?: string | null;
    air_date?: string | null;
    runtime?: number | null;
    guest_stars?: Array<{
      id: number;
      name: string;
      character?: string;
      order?: number;
      profile_path?: string | null;
    }>;
    crew?: Array<{
      id: number;
      name: string;
      department?: string;
      job?: string;
      profile_path?: string | null;
    }>;
  }>;
};

export type TmdbTvCredits = {
  cast?: Array<{
    id: number;
    name: string;
    character?: string;
    order?: number;
    profile_path?: string | null;
  }>;
  crew?: Array<{
    id: number;
    name: string;
    department?: string;
    job?: string;
    profile_path?: string | null;
  }>;
};

export type SearchResult = {
  name: string;
  tmdbId: number;
  overview: string;
  firstAirDate?: string;
  posterPath: string | null;
};
