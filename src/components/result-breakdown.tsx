"use client";

import { useState } from "react";

type Assessment = {
  id: string;
  patientId: string;
  status: string;
  createdAt: string;
  cognitiveTests: Array<{
    testId: string;
    name: string;
    score?: number;
    maxScore?: number;
    status: string;
    notes?: string;
    assessedAt?: string;
  }>;
  speech: { status: string };
  gait: { status: string };
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

type ObsStatus = "missing" | "not-performed" | "unavailable" | "completed";

const statusLabel: Record<ObsStatus, string> = {
  missing: "Not captured",
  "not-performed": "Not performed",
  unavailable: "Unavailable",
  completed: "Completed",
};

const badgeCompleted =
  "inline-flex items-center rounded-md border border-teal bg-teal-subtle text-teal px-2 py-0.5 text-xs font-medium";
const badgeOther =
  "inline-flex items-center rounded-md border border-border bg-muted-subtle text-muted px-2 py-0.5 text-xs font-medium";

const scoreText = (
  score: number | undefined,
  maxScore: number | undefined,
): string => {
  if (score === undefined) return "—";
  let out = String(score);
  if (maxScore !== undefined) {
    out = out + " of " + String(maxScore);
  }
  return out;
};

export default function ResultBreakdown({
  assessment,
}: Readonly<{ assessment: Assessment }>) {
  const [notes, setNotes] = useState(assessment.clinicianNotes ?? "");

  const modalityRows = [
    { label: "Cognitive tests", value: assessment.cognitiveTests.length > 0 ? "completed" : "missing" },
    { label: "Speech", value: assessment.speech.status as ObsStatus },
    { label: "Gait", value: assessment.gait.status as ObsStatus },
  ];

  const reviewStatus = assessment.resultProvenance?.reviewStatus ?? "pending";
  const reviewingClinician = assessment.resultProvenance?.clinicianId ?? "—";

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="rounded-md border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground mb-2">Assessment summary</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Assessment</dt>
            <dd className="text-foreground">#{assessment.id}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Patient</dt>
            <dd className="text-foreground">{assessment.patientId}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Status</dt>
            <dd className="text-foreground">{assessment.status}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Started</dt>
            <dd className="text-foreground">
              {new Date(assessment.createdAt).toLocaleString()}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Composite result</dt>
            <dd className="text-danger font-medium">
              Unavailable — not validated
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Review status</dt>
            <dd className="text-foreground">{reviewStatus}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">
          Not a diagnosis. This view reports only recorded observations; no
          dementia probability, risk score, or care recommendation is provided.
        </p>
      </div>

      <div className="rounded-md border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Modality coverage</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left pb-2 text-muted">Modality</th>
              <th className="text-left pb-2 text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {modalityRows.map((m) => {
              const cls = m.value === "completed" ? badgeCompleted : badgeOther;
              return (
                <tr key={m.label} className="border-t border-border">
                  <td className="py-3 text-foreground">{m.label}</td>
                  <td className="py-3"><span className={cls}>{statusLabel[m.value as ObsStatus]}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted">
          missing = no data captured · not-performed = explicitly not done ·
          unavailable = attempted but could not be captured ·
          completed = data recorded.
        </p>
      </div>

      <div className="rounded-md border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Cognitive test observations</h2>
        <p className="text-xs text-muted mb-3">
          Component scores only — these are not combined into a risk score.
        </p>
        {assessment.cognitiveTests.length === 0 ? (
          <p className="text-muted">No cognitive test observations recorded.</p>
        ) : (
          <table className="w-full text-sm border-collapse border-t border-border">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 text-muted">Test</th>
                <th className="text-left pb-2 text-muted">Score</th>
                <th className="text-left pb-2 text-muted">Status</th>
                <th className="text-left pb-2 text-muted">Assessed</th>
              </tr>
            </thead>
            <tbody>
              {assessment.cognitiveTests.map((t) => {
                const cls =
                  t.status === "completed" ? badgeCompleted : badgeOther;
                return (
                  <tr key={t.testId} className="border-b border-border">
                    <td className="py-3 text-foreground">{t.name}</td>
                    <td className="py-3 text-muted">
                      {scoreText(t.score, t.maxScore)}
                    </td>
                    <td className="py-3">
                      <span className={cls}>
                        {statusLabel[t.status as ObsStatus]}
                      </span>
                    </td>
                    <td className="py-3 text-muted">
                      {t.assessedAt
                        ? new Date(t.assessedAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-md border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Result provenance and limitations</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Composite result</dt>
            <dd className="text-danger font-medium">
              Unavailable — no validated scoring method
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Review status</dt>
            <dd className="text-foreground">{reviewStatus}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="font-semibold text-muted">Reviewing clinician</dt>
            <dd className="text-foreground">{reviewingClinician}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">
          Limitations: observations are descriptive only; no validated
          algorithm converts them into a dementia probability or care
          recommendation; results require clinician review and are not a
          diagnosis.
        </p>
      </div>

      <div className="rounded-md border border-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Clinician notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          disabled
        />
        <p className="mt-2 text-xs text-muted">
          {assessment.clinicianNotes
            ? "Recorded at assessment time."
            : "No notes recorded."}
        </p>
      </div>
    </div>
  );
}
