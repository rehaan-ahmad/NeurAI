"use client";

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  if (typeof window !== "undefined" && error) {
    // Client error logging for diagnostics
    console.error("[NeurAI Error Boundary]", error.digest ?? error.message);
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
      <p className="mt-2 text-muted">An unexpected error occurred.</p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
