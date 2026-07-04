import { useState } from "react";
import type { MovieResult } from "../services/movieApi";

interface MovieCardProps {
  movie: MovieResult;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="flex overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md"
      aria-label={`${movie.title} (${movie.year})`}
    >
      {/* Poster */}
      <div className="relative flex h-48 w-32 shrink-0 items-center justify-center bg-neutral-100 sm:h-56 sm:w-36">
        {movie.posterUrl && !imgError ? (
          <img
            src={movie.posterUrl}
            alt={`Movie poster for ${movie.title}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <svg
              className="h-10 w-10 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span className="text-xs text-neutral-400">No poster</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="text-base font-semibold leading-tight text-neutral-900 sm:text-lg">
              {movie.title}
            </h3>
            <span className="inline-flex shrink-0 items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
              {movie.year}
            </span>
          </div>

          {movie.actors && movie.actors !== "Unknown" && (
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-600">Cast:</span>{" "}
              {movie.actors}
            </p>
          )}

          <p className="text-xs text-neutral-400">
            IMDb ID: {movie.id}
          </p>
        </div>

        <div className="mt-3">
          <a
            href={movie.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${movie.title} on IMDb (opens in new tab)`}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View on IMDb
          </a>
        </div>
      </div>
    </article>
  );
}
