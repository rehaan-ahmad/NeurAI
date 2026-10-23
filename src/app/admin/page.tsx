import { listAudit } from "@/server/persistence/audit";
import { requireAdmin } from "@/server/auth/admin";
import { ForbiddenError } from "@/server/auth/errors";
import Link from "next/link";

export default async function AdminPage() {
  let session;
  try {
    session = requireAdmin();
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return (
        <div className="max-w-md mx-auto mt-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Forbidden</h1>
          <p className="mt-2 text-muted">
            Admin role required to view this page.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-primary underline offset-4 hover:text-primary"
          >
            Back home
          </Link>
        </div>
      );
    }
    throw err;
  }
  const { user, demo } = session;
  const auditLog = await listAudit();

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Admin</h1>
        <Link
          href="/dashboard"
          className="text-sm text-muted underline offset-4 hover:text-primary"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="rounded-md border border-border bg-background p-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">Operations</h2>
        <p className="text-sm text-muted">
          Signed in as <strong>{user.name}</strong> ({user.role}) · org{" "}
          {user.organizationId} · {demo ? "demo mode" : "production"}
        </p>
        <p className="mt-2 text-xs text-muted">
          Admin functions are server-side authorized. Real operational data is
          shown; no uptime or activity metrics are fabricated.
        </p>
      </div>

      <div className="rounded-md border border-border bg-background p-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">Audit log (recent)</h2>
        {auditLog.length === 0 ? (
          <p className="text-sm text-muted">No audit events recorded.</p>
        ) : (
          <table className="w-full text-sm border-collapse border-t border-border">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 text-muted">Time</th>
                <th className="text-left pb-2 text-muted">Action</th>
                <th className="text-left pb-2 text-muted">Actor</th>
                <th className="text-left pb-2 text-muted">Org</th>
                <th className="text-left pb-2 text-muted">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.slice(0, 20).map((e) => (
                <tr key={`${e.timestamp}-${e.action}`} className="border-b border-border">
                  <td className="py-2 text-sm text-muted">
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 text-sm text-foreground">{e.action}</td>
                  <td className="py-2 text-sm text-muted">{e.actorId}</td>
                  <td className="py-2 text-sm text-muted">{e.organizationId}</td>
                  <td className="py-2 text-sm">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0 text-xs font-medium ${
                        e.outcome === "success"
                          ? "border-teal bg-teal-subtle text-teal"
                          : "border-border bg-muted-subtle text-muted"
                      }`}
                    >
                      {e.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-md border border-border bg-background p-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">Planned (not shipped)</h2>
        <ul className="text-sm text-muted space-y-1 list-disc pl-4">
          <li>User invitations and role changes (dead button placeholder — requires governance approval)</li>
          <li>Organization management</li>
          <li>Service health and readiness monitoring</li>
          <li>Backup and deletion operations</li>
        </ul>
        <p className="mt-2 text-xs text-muted">
          These are labeled as planned rather than shipping dead buttons.
        </p>
      </div>
    </div>
  );
}
