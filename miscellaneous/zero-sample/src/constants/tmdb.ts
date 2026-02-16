export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const TMDB_IMAGE_SIZES = {
  w185: `${TMDB_IMAGE_BASE}/w185`,
  w300: `${TMDB_IMAGE_BASE}/w300`,
  w342: `${TMDB_IMAGE_BASE}/w342`,
  w500: `${TMDB_IMAGE_BASE}/w500`,
  original: `${TMDB_IMAGE_BASE}/original`,
};

export function getTmdbImageUrl(
  path: string | null,
  size: keyof typeof TMDB_IMAGE_SIZES = "w185",
) {
  if (!path) return null;
  return `${TMDB_IMAGE_SIZES[size]}${path}`;
}
