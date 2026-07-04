interface EmptyStateProps {
  type: "initial" | "no-results" | "error";
  message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  return (
    <div
      className="..."
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
   >
      {type === "initial" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <svg
              className="h-8 w-8 text-neutral-400"
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
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-neutral-700">
              Search the Movie Database
            </p>
            <p className="text-sm text-neutral-500">
              Enter a movie title above to get started.
            </p>
          </div>
        </>
      )}

      {type === "no-results" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <svg
              className="h-8 w-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-neutral-700">
              No data found
            </p>
            <p className="text-sm text-neutral-500">
              No movies matched your search query. Try a different title or check
              your spelling.
            </p>
          </div>
        </>
      )}

      {type === "error" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-neutral-700">
              Something went wrong
            </p>
            <p className="text-sm text-red-600">
              {message || "An unexpected error occurred. Please try again."}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
