import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { MovieList } from "./components/MovieList";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { EmptyState } from "./components/EmptyState";
import { useMovieSearch } from "./hooks/useMovieSearch";

export default function App() {
  const { results, isLoading, error, hasSearched, search } = useMovieSearch();
  const [lastQuery, setLastQuery] = useState("");

  const handleSearch = async (query: string) => {
   setLastQuery(query);

   console.log("[Analytics] User interacted with Movie Database Search");

  try {
    await search(query);
  } catch (error) {
    console.error("Search failed:", error);
  }
};

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">
                Movie Database Search
              </h1>
              <p className="text-xs text-neutral-500">
                Indie Film Studio — Internal Tool
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        {/* Search Section */}
        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        <div aria-live="polite" aria-atomic="true">
          {isLoading && <LoadingSpinner />}

          {!isLoading && error && (
            <EmptyState type="error" message={error} />
          )}

          {!isLoading && !error && !hasSearched && (
            <EmptyState type="initial" />
          )}

          {!isLoading && !error && hasSearched && results.length === 0 && (
            <EmptyState type="no-results" />
          )}

          {!isLoading && !error && results.length > 0 && (
            <MovieList results={results} query={lastQuery} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-8">
          <p className="text-center text-xs text-neutral-400">
            © {new Date().getFullYear()} Indie Film Studio — Movie Database
            Search. For internal use only.
          </p>
        </div>
      </footer>
    </div>
  );
}
