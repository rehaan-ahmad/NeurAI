import Link from "next/link";

export default function Forbidden({
  reason,
}: Readonly<{ reason?: string }>) {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Forbidden</h1>
      <p className="mt-2 text-muted">
        You do not have permission to view this page.
        {reason ? ` (${reason})` : ""}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
      >
        Go home
      </Link>
    </main>
  );
}
