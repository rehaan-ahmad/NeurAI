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
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Initiate Screening Assessment</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Associate an observational battery with a cohort patient under tenant scope.
          </p>
        </div>
        <button
          onClick={() => router.push("/patients")}
          className="text-xs text-muted hover:text-foreground font-semibold px-3 py-1.5 rounded-lg border border-border/60 hover:bg-muted-subtle transition-colors"
        >
          ← Return to Registry
        </button>
      </div>

      <form action={handleSubmit} className="space-y-6" noValidate>
        {error && (
          <div className="rounded-xl border border-danger/40 bg-danger-subtle p-4 text-danger text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono mb-4">
            Select Cohort Subject
          </h2>
          {patients.length === 0 ? (
            <p className="text-sm text-muted">No patient profiles in current tenant registry. Create one first.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patients.map((p) => {
                const isSelected = selectedPatient === p.id;
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm shadow-primary/20"
                        : "border-border/60 bg-muted-subtle/30 hover:bg-muted-subtle/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="patientId"
                      value={p.id}
                      checked={isSelected}
                      onChange={() => setSelectedPatient(p.id)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="font-mono text-xs font-semibold text-foreground">{p.displayId}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <ConsentDisclosure />

        <div className="pt-2">
          <input type="hidden" name="status" value="scheduled" />
          <button
            disabled={!selectedPatient}
            className="rounded-xl bg-primary hover:bg-primary-hover text-white px-7 py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/25"
          >
            Start Assessment Battery →
          </button>
        </div>
      </form>
    </div>
  );
}
