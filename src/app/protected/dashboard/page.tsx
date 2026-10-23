import { getSession } from "@/server/auth/session";

export default async function Dashboard() {
  const session = getSession();
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted">
        Clinician screening workflow — {session?.demo ? "demo mode (synthetic data)" : "production"}.
      </p>
      <p className="mt-4 text-sm text-muted">
        Signed in as {session?.user.name} ({session?.user.role}) ·
        org {session?.organizationId}
      </p>
    </div>
  );
}
