export async function tmdbFetch<T>(path: string): Promise<T> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY)
    console.warn(
      "Warning: TMDB_API_KEY is not set. TMDB features will not work.",
    );

  if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is not configured");

  const trimmedKey = TMDB_API_KEY.trim();
  const tmdbURL = new URL(`https://api.themoviedb.org/3${path}`);
  tmdbURL.searchParams.set("language", "en-US");

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${trimmedKey}`,
  };

  const res = await fetch(tmdbURL.toString(), { headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `TMDB API returned status ${res.status}: ${text.slice(0, 200)}`,
    );
  }

  return (await res.json()) as T;
}
