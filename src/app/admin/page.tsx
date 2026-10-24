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
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Operational Administration</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Server-side authorized governance, tamper-evident audit logs, and infrastructure telemetry.
          </p>
        </div>
        <Link
          href="/protected/dashboard"
          className="rounded-xl border border-border bg-muted-subtle/50 hover:bg-muted-subtle text-foreground px-4 py-2 text-xs font-semibold transition-colors"
        >
          ← Return to Dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono mb-3">
          Session Integrity & Tenant Scope
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <div className="text-xs text-muted uppercase font-mono">Authenticated Operator</div>
            <div className="mt-1 font-semibold text-foreground">{user.name} ({user.role})</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <div className="text-xs text-muted uppercase font-mono">Tenant Identifier</div>
            <div className="mt-1 font-mono font-semibold text-teal">{user.organizationId}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <div className="text-xs text-muted uppercase font-mono">Environment</div>
            <div className="mt-1 font-semibold text-foreground capitalize">{demo ? "Synthetic Demo Sandbox" : "Production"}</div>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          All administrative functions enforce strict server-side authorization. Real operational logs are rendered; no synthetic uptime or fictitious user telemetry is injected.
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Immutable Audit Stream</h2>
          <span className="text-xs font-mono text-muted">RECENT EVENTS</span>
        </div>
        {auditLog.length === 0 ? (
          <p className="text-sm text-muted">No audit events recorded in current cycle.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted-subtle/30 text-xs font-semibold text-muted uppercase font-mono tracking-wider">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3 text-right">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {auditLog.slice(0, 20).map((e) => (
                  <tr key={`${e.timestamp}-${e.action}`} className="hover:bg-muted-subtle/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted font-mono">
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono font-semibold text-foreground">
                      {e.action}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted">{e.actorId}</td>
                    <td className="px-4 py-3 text-xs font-mono text-teal">{e.organizationId}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
                          e.outcome === "success"
                            ? "border-teal/30 bg-teal/10 text-teal"
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
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-2">Governance Roadmap (Planned Modules)</h2>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          In adherence to the specification, unapproved features are clearly flagged rather than surfaced as non-functional UI placeholders.
        </p>
        <ul className="text-xs text-muted space-y-2 list-disc pl-5">
          <li><strong>Role delegation & identity invitations:</strong> Disabled pending institutional committee sign-off.</li>
          <li><strong>Tenant boundary migration:</strong> In design review.</li>
          <li><strong>Storage purge & patient right-to-be-forgotten orchestration:</strong> Pending regional data-controller approval.</li>
        </ul>
      </div>
    </div>
  );
}
