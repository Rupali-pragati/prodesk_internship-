import type { MovieResult } from "../services/movieApi";
import { MovieCard } from "./MovieCard";

interface MovieListProps {
  results: MovieResult[];
  query: string;
}

export function MovieList({
  results,
  query,
}: MovieListProps) {
  return (
    <section
      aria-labelledby="search-results-heading"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="search-results-heading"
          className="text-sm font-medium text-neutral-600"
        >
          <span className="text-neutral-900">
            {results.length}
          </span>{" "}
          {results.length === 1 ? "result" : "results"} for{" "}
          <span className="font-semibold text-neutral-900">
            {query || "your search"}
          </span>
        </h2>
      </div>

      <div
        role="list"
        aria-label="Movie search results"
        className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
      >
        {results.map((movie) => (
          <div
            key={movie.id || movie.imdbUrl}
            role="listitem"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}