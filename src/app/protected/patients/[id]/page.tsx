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
    <div className="space-y-4 max-w-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Patient {patient.displayId}</h1>
        <Link
          href="/patients"
          className="text-sm text-muted underline offset-4 hover:text-primary"
        >
          Back to list
        </Link>
      </div>

      <div className="rounded-md border border-border bg-background p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-sm font-semibold text-muted">Reference</dt>
            <dd className="text-sm text-foreground">{patient.displayId}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-sm font-semibold text-muted">Age</dt>
            <dd className="text-sm text-foreground">{patient.age}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-sm font-semibold text-muted">Gender</dt>
            <dd className="text-sm text-foreground">{patient.gender}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-sm font-semibold text-muted">Created</dt>
            <dd className="text-sm text-foreground">
              {new Date(patient.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-sm font-semibold text-muted">Updated</dt>
            <dd className="text-sm text-foreground">
              {new Date(patient.updatedAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-md border border-border bg-background p-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Assessment history</h2>
        <p className="text-sm text-muted">No assessments recorded yet.</p>
      </div>

      <p className="text-xs text-muted">
        Synthetic demo data only — not a real patient record.
      </p>
    </div>
  );
}
