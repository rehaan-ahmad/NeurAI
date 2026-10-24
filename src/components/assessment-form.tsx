"use client";

import { useState } from "react";
import Link from "next/link";
import {
  updateObservationAction,
  completeAssessmentAction,
} from "@/server/actions/assessments";

type ObsStatus = "missing" | "not-performed" | "unavailable" | "completed";

type Obs = {
  testId: string;
  name: string;
  score?: number;
  maxScore?: number;
  status: ObsStatus;
  notes?: string;
  assessedAt?: string;
};

type AssessmentFormProps = {
  assessment: {
    id: string;
    patientId: string;
    status: string;
    cognitiveTests: Obs[];
    resultProvenance?: {
      clinicianId?: string;
      reviewStatus?: string;
      compositeAvailable?: boolean;
    };
    consent?: {
      purposeDisclosed?: boolean;
      retentionDisclosed?: boolean;
      recordingConsent?: boolean;
    };
    clinicianNotes?: string;
  };
};

export function AssessmentForm({
  assessment,
}: AssessmentFormProps) {
  const [observations, setObservations] = useState<Obs[]>(
    Array.isArray(assessment.cognitiveTests) ? assessment.cognitiveTests : [],
  );
  const [status, setStatus] = useState<string>(assessment.status);
  const [error, setError] = useState<string | null>(null);

  const statuses: Array<{ value: ObsStatus; label: string }> = [
    { value: "missing", label: "Not captured" },
    { value: "not-performed", label: "Not performed" },
    { value: "unavailable", label: "Unavailable" },
    { value: "completed", label: "Completed" },
  ];

  const handleSaveObservation = async (index: number, formData: FormData) => {
    const testId = String(formData.get("testId") ?? observations[index].testId);
    const name = String(formData.get("name") ?? observations[index].name);
    const score = formData.get("score");
    const maxScore = formData.get("maxScore");
    const obsStatus = String(formData.get("status") ?? "missing");
    const notes = String(formData.get("notes") ?? "");

    const next: Obs[] = [
      ...observations.slice(0, index),
      {
        testId,
        name,
        score: score === "" ? undefined : Number(score),
        maxScore: maxScore === "" ? undefined : Number(maxScore),
        status: obsStatus as ObsStatus,
        notes: notes || undefined,
        assessedAt: new Date().toISOString(),
      },
      ...observations.slice(index + 1),
    ];
    setObservations(next);

    const result = await updateObservationAction(assessment.id, formData);
    if ("error" in result) {
      setError(result.error as string);
    } else {
      setError(null);
    }
  };

  const handleComplete = async () => {
    setError(null);
    const result = await completeAssessmentAction(assessment.id);
    if ("error" in result) {
      setError(result.error as string);
      return;
    }
    setStatus("completed");
  };

  const c = assessment.consent ?? {};
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-teal/30 bg-teal/10 text-teal text-xs font-mono font-medium mb-1">
            SCREENING PROTOCOL #{assessment.id}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinical Battery Observations</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Subject ID: <span className="font-mono text-foreground font-semibold">{assessment.patientId}</span> · Status: <span className="capitalize font-semibold text-teal">{assessment.status}</span>
          </p>
        </div>
        <Link
          href="/patients"
          className="text-xs text-muted hover:text-foreground font-semibold px-3 py-1.5 rounded-lg border border-border/60 hover:bg-muted-subtle transition-colors"
        >
          ← Return to Registry
        </Link>
      </div>

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
          Verified Consent Disclosures
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Purpose Disclosed</dt>
            <dd className={`mt-1 font-semibold text-xs ${c.purposeDisclosed ? "text-teal" : "text-muted"}`}>
              {c.purposeDisclosed ? "✓ Verified" : "✗ Pending"}
            </dd>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Retention Terms</dt>
            <dd className={`mt-1 font-semibold text-xs ${c.retentionDisclosed ? "text-teal" : "text-muted"}`}>
              {c.retentionDisclosed ? "✓ Verified" : "✗ Pending"}
            </dd>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Recording Consent</dt>
            <dd className={`mt-1 font-semibold text-xs ${c.recordingConsent ? "text-teal" : "text-muted"}`}>
              {c.recordingConsent ? "✓ Granted" : "— Excluded"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Cognitive Test Observations</h2>
            <p className="text-xs text-muted">
              Individual component scores only — strictly unweighted and non-composite.
            </p>
          </div>
          <button
            onClick={() =>
              setObservations([
                ...observations,
                { testId: `custom-${observations.length + 1}`, name: "New Observation", status: "missing" },
              ])
            }
            className="text-xs text-primary hover:text-primary-hover font-semibold px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 transition-colors"
          >
            + Add Battery Field
          </button>
        </div>

        <div className="space-y-4">
          {observations.map((o, i) => (
            <div key={o.testId || String(i)} className="rounded-xl border border-border/60 bg-muted-subtle/30 p-4">
              <form
                action={(fd) => handleSaveObservation(i, fd)}
                className="space-y-4"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase font-mono mb-1">
                      Test Identifier
                    </label>
                    <input
                      name="testId"
                      defaultValue={o.testId}
                      className="w-full rounded-lg border border-border/70 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase font-mono mb-1">
                      Battery Name
                    </label>
                    <input
                      name="name"
                      defaultValue={o.name}
                      className="w-full rounded-lg border border-border/70 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase font-mono mb-1">
                      Score Attained
                    </label>
                    <input
                      name="score"
                      type="number"
                      defaultValue={o.score ?? ""}
                      className="w-full rounded-lg border border-border/70 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase font-mono mb-1">
                      Max Possible
                    </label>
                    <input
                      name="maxScore"
                      type="number"
                      defaultValue={o.maxScore ?? ""}
                      className="w-full rounded-lg border border-border/70 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase font-mono mb-1">
                      Protocol Status
                    </label>
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="w-full rounded-lg border border-border/70 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-muted uppercase font-mono mb-1">
                      Clinician Observational Notes
                    </label>
                    <textarea
                      name="notes"
                      defaultValue={o.notes ?? ""}
                      rows={2}
                      className="w-full rounded-lg border border-border/70 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    className="rounded-lg bg-primary hover:bg-primary-hover text-white px-4 py-1.5 text-xs font-semibold transition-colors shadow-sm shadow-primary/20"
                  >
                    Commit Observation Entry
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono mb-3">
          Result Provenance & Decision Guardrails
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Composite Result</dt>
            <dd className="mt-1 text-xs text-danger font-bold">
              Unavailable — Not Validated
            </dd>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Review Status</dt>
            <dd className="mt-1 text-xs text-teal font-semibold capitalize">
              {assessment.resultProvenance?.reviewStatus ?? "Pending Review"}
            </dd>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Clinician ID</dt>
            <dd className="mt-1 text-xs text-foreground font-mono">
              {assessment.resultProvenance?.clinicianId ?? "clinician-demo-001"}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-muted leading-relaxed">
          Not a diagnostic system. Descriptive observations only; overall risk calculation is unavailable until a clinically validated, approved method exists.
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono mb-3">
          Clinician Summary Notes
        </h2>
        <textarea
          defaultValue={assessment.clinicianNotes ?? ""}
          rows={3}
          placeholder="Subjective clinician impressions, situational factors, or patient comments..."
          className="w-full rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>

      <div className="pt-2">
        {status !== "completed" ? (
          <button
            onClick={handleComplete}
            className="rounded-xl bg-teal hover:bg-teal-hover text-white px-7 py-3 text-sm font-semibold transition-all shadow-md shadow-teal/20"
          >
            Mark Assessment Complete & Lock Registry →
          </button>
        ) : (
          <div className="p-4 rounded-xl border border-teal/30 bg-teal/10 text-teal text-sm font-medium">
            ✓ Assessment marked complete. Locked for clinician review.
          </div>
        )}
      </div>
    </div>
  );
}
