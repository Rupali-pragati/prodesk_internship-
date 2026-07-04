export function LoadingSpinner() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16"
      role="status"
      aria-label="Loading search results"
    >
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-neutral-900" />
      </div>
      <p className="text-sm font-medium text-neutral-500">
        Searching movies…
      </p>
    </div>
  );
}
