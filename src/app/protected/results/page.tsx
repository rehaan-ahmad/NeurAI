import Link from "next/link";
import { authorize } from "@/server/auth/authorize";
import { listPatientsAction } from "@/server/actions/patients";
import { listAssessmentsAction } from "@/server/actions/assessments";
type Patient = { id: string; displayId: string };
type Assessment = { id: string; patientId: string; status: string; createdAt: string };

export default async function ResultsPage() {
  authorize({ requiredRole: "clinician" });
  const patientResult = await listPatientsAction();
  if ("error" in patientResult) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Results</h1>
        <p className="mt-2 text-danger text-sm">{String(patientResult.error)}</p>
        <Link href="/" className="mt-4 inline-block text-primary underline offset-4">
          Back home
        </Link>
      </div>
    );
  }
  const patients = (patientResult as Array<Patient>).map((p) => ({
    id: p.id,
    displayId: p.displayId,
  }));

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground">Results</h1>
      <p className="text-sm text-muted">
        Transparent interpretation of recorded observations. No diagnosis, risk
        score, or care recommendation is provided.
      </p>

      {patients.length === 0 ? (
        <div className="rounded-md border border-border bg-muted-subtle p-6 text-center text-muted">
          No patients found. Create a patient first.
        </div>
      ) : (
        <div className="space-y-5">
          {patients.map((patient) => (
            <PatientResults key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}

async function PatientResults({ patient }: { patient: Patient }) {
  const sessionResult = await listAssessmentsAction();
  if ("error" in sessionResult) {
    return (
      <div className="rounded-md border border-border bg-background p-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">
          {patient.displayId}
        </h2>
        <p className="text-danger text-sm">{String(sessionResult.error)}</p>
      </div>
    );
  }
  const sessions = (sessionResult as Array<Assessment>).filter(
    (s) => s.patientId === patient.id,
  );

  if (sessions.length === 0) {
    return (
      <div className="rounded-md border border-border bg-background p-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">
          {patient.displayId}
        </h2>
        <p className="text-muted text-sm">No assessments recorded.</p>
        <Link
          href={`/assessments/new`}
          className="mt-2 inline-block text-primary underline offset-4 text-sm hover:text-primary"
        >
          Start assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-background p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-foreground">{patient.displayId}</h2>
        <p className="text-xs text-muted">
          {sessions.length} assessment{sessions.length !== 1 ? "s" : ""}
        </p>
      </div>
      <ul className="space-y-2">
        {sessions.map((s) => (
          <li key={s.id} className="border-b border-border pb-2 last:border-0">
            <Link
              href={`/results/${patient.id}/${s.id}`}
              className="text-primary underline offset-4 hover:text-primary"
            >
              Assessment #{s.id} — {s.status}
            </Link>
            <span className="ml-2 text-xs text-muted">
              {new Date(s.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
