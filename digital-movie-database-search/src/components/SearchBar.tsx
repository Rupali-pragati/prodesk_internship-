import { useState, useRef, type FormEvent } from "react";
import { sanitizeInput } from "../utils/sanitize";

interface SearchBarProps {
  onSearch:(query:string)=>Promise<void>;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sanitized = sanitizeInput(query.trim());

    if (!sanitized) {
      setValidationError("Please enter a movie title to search.");
      inputRef.current?.focus();
      return;
    }

    if (sanitized.length < 2) {
      setValidationError("Search query must be at least 2 characters.");
      inputRef.current?.focus();
      return;
    }

    setValidationError(null);

    

    onSearch(sanitized);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search movies"
      className="w-full"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="movie-search-input"
          className="text-sm font-medium text-neutral-600"
        >
          Search Movies
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="h-5 w-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              ref={inputRef}
              id="movie-search-input"
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter movie title (e.g., Inception, The Matrix)"
              aria-label="Movie search query"
              aria-describedby={validationError ? "search-error" : undefined}
              aria-invalid={validationError ? "true" : "false"}
              className={`w-full rounded-lg border bg-white py-3 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 transition-colors focus:outline-none focus:ring-2 ${
                validationError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-neutral-300 focus:border-neutral-900 focus:ring-neutral-200"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            aria-label="Search for movies"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Searching…
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>
        {validationError && (
          <p
            id="search-error"
            role="alert"
            className="text-sm font-medium text-red-600"
          >
            {validationError}
          </p>
        )}
      </div>
    </form>
  );
}
