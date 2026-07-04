export interface MovieResult {
  id: string;
  title: string;
  year: number;
  actors: string;
  aka: string;
  imdbUrl: string;
  posterUrl: string | null;
}

interface ApiResponse {
  ok: boolean;
  description: ApiMovie[];
  error_code: number;
}

interface ApiMovie {
  "#TITLE": string;
  "#YEAR": number;
  "#IMDB_ID": string;
  "#RANK": number;
  "#ACTORS": string;
  "#AKA": string;
  "#IMDB_URL": string;
  "#IMG_POSTER"?: string;
}

export class MovieApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "MovieApiError";
  }
}

/**
 * Search movies using the IMDb Search API.
 * Uses native fetch() with async/await.
 */
export async function searchMovies(
  query: string,
  signal?: AbortSignal
): Promise<MovieResult[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const url = `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(trimmed)}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    // Request cancelled intentionally
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new MovieApiError(
      "Network error. Please check your internet connection and try again."
    );
  }

  if (!response.ok) {
    throw new MovieApiError(
      `Server error (${response.status}). Please try again later.`,
      response.status
    );
  }

  let data: ApiResponse;

  try {
    data = (await response.json()) as ApiResponse;
  } catch {
    throw new MovieApiError(
      "Unable to read server response. Please try again."
    );
  }

  if (!data.ok || !Array.isArray(data.description)) {
    return [];
  }

  return data.description.map((movie) => ({
    id: movie["#IMDB_ID"] || crypto.randomUUID(),
    title: movie["#TITLE"] || "Unknown Title",
    year: Number(movie["#YEAR"]) || 0,
    actors: movie["#ACTORS"] || "Unknown",
    aka: movie["#AKA"] || "",
    imdbUrl: movie["#IMDB_URL"] || "",
    posterUrl: movie["#IMG_POSTER"] || null,
  }));
}