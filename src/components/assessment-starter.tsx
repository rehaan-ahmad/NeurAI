"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAssessmentAction } from "@/server/actions/assessments";
import { ConsentDisclosure } from "@/components/consent-disclosure";

type Patient = { id: string; displayId: string };

type AssessmentStarterProps = { patients: Patient[] };

export function AssessmentStarter({ patients }: AssessmentStarterProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await createAssessmentAction(formData);
    if ("error" in result) {
      setError(result.error as string);
      return;
    }
    router.push(`/assessments/${(result as { assessment: { id: string } }).assessment.id}`);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">New assessment</h1>
        <button
          onClick={() => router.push("/patients")}
          className="text-sm text-muted underline offset-4 hover:text-primary"
        >
          Back to patients
        </button>
      </div>

      <form action={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div className="rounded-md border border-danger bg-danger-subtle p-3 text-danger text-sm">
            {error}
          </div>
        )}

        <div className="rounded-md border border-border bg-background p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Select patient</h2>
          {patients.length === 0 ? (
            <p className="text-sm text-muted">No patients in your organization. Create one first.</p>
          ) : (
            <div className="space-y-2">
              {patients.map((p) => (
                <label key={p.id} className="block">
                  <input
                    type="radio"
                    name="patientId"
                    value={p.id}
                    checked={selectedPatient === p.id}
                    onChange={() => setSelectedPatient(p.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-foreground">{p.displayId}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <ConsentDisclosure />

        <div className="flex items-center gap-3 pt-4">
          <input type="hidden" name="status" value="scheduled" />
          <button
            disabled={!selectedPatient}
            className="rounded-md border border-primary bg-primary px-5 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          >
            Start assessment
          </button>
        </div>
      </form>

      {patients.length > 0 && !selectedPatient && (
        <p className="text-xs text-muted">
          Select a patient to begin. Consent must be confirmed before starting.
        </p>
      )}
    </div>
  );
}
