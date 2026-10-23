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
    <div className="space-y-4 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Assessments</h1>
        <Link
          href="/assessments/new"
          className="rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          New assessment
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-md border border-border bg-muted-subtle p-6 text-center text-muted">
          No assessments yet. Start one to begin recording observations.
        </div>
      ) : (
        <table className="w-full rounded-md border border-border bg-background">
          <thead>
            <tr className="border-b border-border bg-muted-subtle">
              <th className="text-left px-4 py-2 text-sm font-semibold text-muted">Patient</th>
              <th className="text-left px-4 py-2 text-sm font-semibold text-muted">Status</th>
              <th className="text-left px-4 py-2 text-sm font-semibold text-muted">Started</th>
              <th className="text-right px-4 py-2 text-sm font-semibold text-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm text-foreground">
                  {s.patientId}
                </td>
                <td className="px-4 py-3 text-sm text-muted">{s.status}</td>
                <td className="px-4 py-3 text-sm text-muted">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <Link
                    href={`/assessments/${s.id}`}
                    className="text-primary underline offset-4 hover:text-primary"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
