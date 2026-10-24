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
    <div className="space-y-6">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Screening Results & Interpretations</h1>
        <p className="text-xs sm:text-sm text-muted mt-1 max-w-3xl leading-relaxed">
          Transparent clinical breakdown of recorded cognitive batteries and telemetry. In accordance with safety guardrails, component observations are presented without automated risk percentages or unsupervised diagnostic claims.
        </p>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-10 text-center text-muted">
          <p className="text-sm font-medium">No patient records found.</p>
          <p className="text-xs text-muted/80 mt-1">Create a patient and record an assessment to inspect result summaries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
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
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Patient: {patient.displayId}
          </h2>
          <span className="text-xs text-muted">0 assessments</span>
        </div>
        <p className="text-muted text-xs mt-2">No completed or in-progress assessments recorded.</p>
        <Link
          href={`/assessments/new`}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:text-primary-hover"
        >
          Start assessment now →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 border-b border-border/40 pb-3">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <span className="font-mono text-primary font-semibold">{patient.displayId}</span>
          <span className="text-xs font-normal text-muted">Cohort Record</span>
        </h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-muted-subtle text-foreground">
          {sessions.length} battery record{sessions.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="space-y-2">
        {sessions.map((s) => (
          <li key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted-subtle/30 hover:bg-muted-subtle/60 border border-border/40 transition-colors">
            <Link
              href={`/results/${patient.id}/${s.id}`}
              className="font-mono text-xs font-medium text-primary hover:text-primary-hover inline-flex items-center gap-2"
            >
              <span>Session #{s.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold border ${
                s.status === "completed"
                  ? "border-teal/30 bg-teal/10 text-teal"
                  : "border-primary/30 bg-primary/10 text-primary"
              }`}>
                {s.status}
              </span>
            </Link>
            <span className="text-xs text-muted">
              {new Date(s.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
