import { getPatientAction } from "@/server/actions/patients";
import Link from "next/link";

export default async function PatientDetail({
  params,
}: Readonly<{ params: { id: string } }>) {
  const result = await getPatientAction(params.id);
  if (!result || "error" in result) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Not found</h1>
        <p className="mt-2 text-muted">Patient not found or you do not have access.</p>
        <Link href="/patients" className="mt-4 inline-block text-primary underline offset-4 hover:text-primary">Back to list</Link>
      </div>
    );
  }
  const patient = result as { id: string; displayId: string; age: number; gender: string; createdAt: string; updatedAt: string };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-medium mb-1">
            COHORT PROFILE
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Subject Ref: {patient.displayId}
          </h1>
        </div>
        <Link
          href="/patients"
          className="text-xs text-muted hover:text-foreground font-semibold px-3 py-1.5 rounded-lg border border-border/60 hover:bg-muted-subtle transition-colors"
        >
          ← Return to Registry
        </Link>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono mb-4">
          Demographic Telemetry & Identity
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Reference ID</dt>
            <dd className="mt-1 font-mono text-base font-semibold text-foreground">{patient.displayId}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Recorded Age</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{patient.age} years</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Gender</dt>
            <dd className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border border-border bg-muted-subtle text-foreground">
                {patient.gender}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Profile Created</dt>
            <dd className="mt-1 text-xs text-muted">
              {new Date(patient.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Last Synchronized</dt>
            <dd className="mt-1 text-xs text-muted">
              {new Date(patient.updatedAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Screening Action</dt>
            <dd className="mt-1">
              <Link
                href="/assessments/new"
                className="text-xs font-semibold text-teal hover:underline inline-flex items-center gap-1"
              >
                Launch Assessment →
              </Link>
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono mb-2">
          Assessment & Screening History
        </h2>
        <p className="text-xs text-muted">
          Access complete observational records via the assessments and results portal.
        </p>
      </div>

      <p className="text-xs text-muted">
        Synthetic demo cohort profile — no real patient identification or external transmission.
      </p>
    </div>
  );
}
