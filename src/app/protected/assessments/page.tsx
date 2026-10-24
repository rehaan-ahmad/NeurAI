import { listAssessmentsAction } from "@/server/actions/assessments";
import Link from "next/link";

export default async function AssessmentsList() {
  const result = await listAssessmentsAction();
  const sessions = (result as Array<{
    id: string;
    patientId: string;
    status: string;
    createdAt: string;
  }>).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Screening Assessments</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Recorded cognitive test batteries, telemetry, and clinician review logs.
          </p>
        </div>
        <Link
          href="/assessments/new"
          className="rounded-xl bg-primary hover:bg-primary-hover text-white px-4 py-2 text-sm font-semibold transition-all duration-150 shadow-md shadow-primary/20 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Assessment
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-10 text-center text-muted">
          <p className="text-sm font-medium">No assessments recorded yet.</p>
          <p className="text-xs text-muted/80 mt-1">Start a session to begin capturing cognitive test scores and observations.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted-subtle/40 text-xs font-semibold text-muted uppercase font-mono tracking-wider">
                  <th className="px-5 py-3.5">Session ID</th>
                  <th className="px-5 py-3.5">Patient ID</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Started At</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-muted-subtle/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-medium text-foreground">
                      #{s.id}
                    </td>
                    <td className="px-5 py-4 font-mono font-medium text-foreground">
                      <Link
                        href={`/patients/${s.patientId}`}
                        className="text-primary hover:underline"
                      >
                        {s.patientId}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                        s.status === "completed"
                          ? "border-teal/30 bg-teal/10 text-teal"
                          : "border-primary/30 bg-primary/10 text-primary"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/assessments/${s.id}`}
                        className="rounded-lg border border-border/60 bg-muted-subtle/50 hover:bg-muted-subtle px-3 py-1.5 text-xs font-medium text-foreground transition-colors inline-flex items-center gap-1"
                      >
                        Resume / Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
