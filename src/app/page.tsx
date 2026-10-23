import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">NeurAI</h1>
      <p className="mt-2 text-muted max-w-md mx-auto">
        Clinician-facing dementia screening and workflow-support application.
        Not a diagnostic system. No diagnosis, risk scoring, or treatment advice.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center">
        <Link
          href="/dashboard"
          className="rounded-md border border-primary bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          Open dashboard
        </Link>
      </div>
      <p className="mt-6 text-xs text-muted">
        Demo mode — synthetic data only. Not production.
      </p>
    </main>
  );
}
