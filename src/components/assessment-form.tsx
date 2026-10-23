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
    const status = String(formData.get("status") ?? "missing");
    const notes = String(formData.get("notes") ?? "");

    const next: Obs[] = [
      ...observations.slice(0, index),
      {
        testId,
        name,
        score: score === "" ? undefined : Number(score),
        maxScore: maxScore === "" ? undefined : Number(maxScore),
        status: status as ObsStatus,
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
    // Optimistically reflect completion; the server action is source of truth.
  };

  const c = assessment.consent ?? {};
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assessment</h1>
          <p className="text-sm text-muted">
            Patient {assessment.patientId} · {assessment.status}
          </p>
        </div>
        <Link
          href="/patients"
          className="text-sm text-muted underline offset-4 hover:text-primary"
        >
          Back to patients
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-danger bg-danger-subtle p-3 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="rounded-md border border-border bg-background p-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">
          Consent disclosures
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Purpose disclosed</dt>
            <dd className={`text-xs ${c.purposeDisclosed ? "text-success" : "text-muted"}`}>
              {String(c.purposeDisclosed)}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Retention disclosed</dt>
            <dd className={`text-xs ${c.retentionDisclosed ? "text-success" : "text-muted"}`}>
              {String(c.retentionDisclosed)}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Recording consent</dt>
            <dd className={`text-xs ${c.recordingConsent ? "text-success" : "text-muted"}`}>
              {String(c.recordingConsent)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-md border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Cognitive test observations
        </h2>
        <p className="text-xs text-muted mb-3">
          Component scores only — no dementia risk or composite result is
          calculated.
        </p>
        <div className="space-y-3">
          {observations.map((o, i) => (
            <div key={o.testId || String(i)} className="rounded-md border border-border p-3">
              <form
                action={(fd) => handleSaveObservation(i, fd)}
                className="space-y-3"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted">
                      Test
                    </label>
                    <input
                      name="testId"
                      defaultValue={o.testId}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted">
                      Name
                    </label>
                    <input
                      name="name"
                      defaultValue={o.name}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted">
                      Score
                    </label>
                    <input
                      name="score"
                      type="number"
                      defaultValue={o.score ?? ""}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted">
                      Max
                    </label>
                    <input
                      name="maxScore"
                      type="number"
                      defaultValue={o.maxScore ?? ""}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted">
                      Status
                    </label>
                    <select
                      name="status"
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-muted">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      defaultValue={o.notes ?? ""}
                      rows={2}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-2 pt-2">
                  <button
                    className="rounded-md border border-primary bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                  >
                    Save observation
                  </button>
                </div>
              </form>
            </div>
          ))}
          <button
            onClick={() =>
              setObservations([
                ...observations,
                { testId: "", name: "", status: "missing" },
              ])
            }
            className="text-sm text-primary underline offset-4 hover:text-primary"
          >
            Add observation
          </button>
        </div>
      </div>

      <div className="rounded-md border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Result provenance
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Composite result</dt>
            <dd className="text-danger font-medium">
              Unavailable — not validated
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Review status</dt>
            <dd className="text-foreground">
              {assessment.resultProvenance?.reviewStatus ?? "pending"}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Clinician</dt>
            <dd className="text-foreground">
              {assessment.resultProvenance?.clinicianId ?? "—"}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">
          Not a diagnosis. Descriptive observations only; overall risk
          calculation is unavailable until a validated, approved method exists.
        </p>
      </div>

      <div className="rounded-md border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Clinician notes
        </h2>
        <textarea
          defaultValue={assessment.clinicianNotes ?? ""}
          rows={4}
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        />
        <p className="mt-2 text-xs text-muted">
          Notes are part of the assessment record.
        </p>
      </div>

      {assessment.status !== "completed" ? (
        <button
          onClick={handleComplete}
          className="rounded-md border border-primary bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          Mark assessment complete
        </button>
      ) : (
        <p className="text-sm text-success">
          Assessment marked complete. Awaiting clinician review.
        </p>
      )}
    </div>
  );
}
