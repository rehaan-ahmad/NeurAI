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
    <div className="space-y-6 max-w-4xl">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Assessment Summary</h2>
            <p className="text-xs text-muted">Session ID: #{assessment.id}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-teal/30 bg-teal/10 text-teal">
            {assessment.status}
          </span>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Patient Subject</dt>
            <dd className="mt-1 font-mono text-base font-semibold text-foreground">{assessment.patientId}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Started Timestamp</dt>
            <dd className="mt-1 text-sm text-foreground">
              {new Date(assessment.createdAt).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Review Status</dt>
            <dd className="mt-1 text-sm font-medium capitalize text-teal">{reviewStatus}</dd>
          </div>
          <div className="sm:col-span-3 p-3.5 rounded-xl border border-danger/30 bg-danger-subtle/50 flex items-start gap-3">
            <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-xs text-muted leading-relaxed">
              <strong className="text-foreground">Composite Diagnostic Score:</strong> <span className="text-danger font-semibold">Unavailable — not validated</span>. In strict accordance with medical decision-support principles, individual battery scores are not converted into automated dementia risk scores.
            </div>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center justify-between">
          <span>Modality Telemetry Coverage</span>
          <span className="text-xs font-normal text-muted font-mono">3 MODALITIES REGISTERED</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse text-left">
            <thead>
              <tr className="border-b border-border/60 bg-muted-subtle/30 text-xs font-semibold text-muted uppercase font-mono tracking-wider">
                <th className="px-4 py-3">Modality Battery</th>
                <th className="px-4 py-3">Capture Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {modalityRows.map((m) => {
                const cls = m.value === "completed"
                  ? "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-teal/30 bg-teal/10 text-teal"
                  : "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-muted-subtle text-muted";
                return (
                  <tr key={m.label} className="hover:bg-muted-subtle/20 transition-colors">
                    <td className="px-4 py-3.5 text-foreground font-medium">{m.label}</td>
                    <td className="px-4 py-3.5">
                      <span className={cls}>{statusLabel[m.value as ObsStatus]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-1">Cognitive Test Observations</h2>
        <p className="text-xs text-muted mb-4">
          Component battery scores — isolated metrics without automated risk projection.
        </p>
        {assessment.cognitiveTests.length === 0 ? (
          <p className="text-muted text-sm">No cognitive test observations recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted-subtle/30 text-xs font-semibold text-muted uppercase font-mono tracking-wider">
                  <th className="px-4 py-3">Battery</th>
                  <th className="px-4 py-3">Score Achieved</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {assessment.cognitiveTests.map((t) => {
                  const cls =
                    t.status === "completed" ? badgeCompleted : badgeOther;
                  return (
                    <tr key={t.testId} className="hover:bg-muted-subtle/20 transition-colors">
                      <td className="px-4 py-3.5 text-foreground font-medium">{t.name}</td>
                      <td className="px-4 py-3.5 text-foreground font-mono font-semibold">
                        {scoreText(t.score, t.maxScore)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cls}>
                          {statusLabel[t.status as ObsStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted text-xs">
                        {t.assessedAt
                          ? new Date(t.assessedAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-4">Provenance & Governance Limitations</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Reviewing Clinician</dt>
            <dd className="mt-1 text-foreground font-medium">{reviewingClinician}</dd>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted-subtle/30">
            <dt className="text-xs font-semibold text-muted uppercase font-mono">Verification State</dt>
            <dd className="mt-1 text-teal font-medium capitalize">{reviewStatus}</dd>
          </div>
        </dl>
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-foreground">Operational Limitation Notice:</span> Observations are descriptive signals intended solely to reduce documentation burden during clinical screening. NeurAI does not perform unsupervised medical diagnoses or treatment planning.
        </p>
      </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Clinician Observations & Notes</h2>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-muted-subtle border border-border text-muted">
            IMMUTABLE AUDIT RECORD
          </span>
        </div>
                  <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-border/70 bg-card/60 px-4 py-3 text-sm text-foreground focus:outline-none transition-colors select-text"
            readOnly
          ></textarea>
        <p className="mt-2 text-xs text-muted">
          {assessment.clinicianNotes
            ? "Immutable notes recorded during clinical administration."
            : "No subjective clinician notes entered for this session."}
        </p>
      </div>

  );
}
