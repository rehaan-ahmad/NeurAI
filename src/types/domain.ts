// Domain types — NeurAI
//
// All production-facing types are scoped to an organization (clinic) and a
// patient. Demo fixtures carry a literal `demo: true` marker and live under
// the `demo/` adaptor so they cannot be confused with real records.

export type Role = "clinician" | "admin" | "patient";

export interface User {
  id: string;
  email: string;
  role: Role;
  organizationId: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  // India-compatible region preferred given user base (rural + urban).
  region?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  organizationId: string;
  // Minimum necessary identifiers only. No real PHI in demo fixtures.
  displayId: string; // clinic-assigned reference, not a government ID
  age: number;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  createdBy: string; // user id
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalHistory {
  patientId: string;
  // Free-text clinician-entered summary only; no copied protected test content.
  presentingConcerns?: string;
  relevantHistory?: string;
  medications?: string;
  updatedAt: string;
}

export type AssessmentStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";

export type ModalityStatus =
  | "missing"       // no data captured
  | "not-performed" // explicitly not performed
  | "unavailable"   // attempted but could not be captured
  | "completed";

export interface CognitiveTestObservation {
  testId: string;      // generic configurable instrument reference
  name: string;        // generic name, no protected content
  score?: number;      // raw component score only — never a dementia probability
  maxScore?: number;
  status: ModalityStatus;
  notes?: string;
  assessedAt?: string;
}

export interface SpeechObservation {
  // Recording UI prototyped only; raw audio not persisted by default.
  status: ModalityStatus;
  // Demo/local-only placeholder; no transcript or audio stored.
  capturedAt?: string;
  notes?: string;
}

export interface GaitObservation {
  // Capture workflow documented only; no clinical inference from video.
  status: ModalityStatus;
  capturedAt?: string;
  notes?: string;
}

export interface ResultProvenance {
  // Source of each result; supports transparent interpretation.
  cognitiveTestVersion?: string;
  speechModel?: { provider: string; model: string; version: string } | null;
  gaitMethod?: string; // documented protocol, not a validated inference
  clinicianId: string;
  reviewedAt?: string;
  reviewStatus: "pending" | "reviewed" | "requires-clinician";
  // Composite screening result is unavailable unless a validated method exists.
  compositeAvailable: false;
}

export interface ConsentMetadata {
  // Consent/purpose/retention disclosure placeholders sourced from policy.
  purposeDisclosed: boolean;
  retentionDisclosed: boolean;
  recordingConsent: boolean; // opt-in only; never assumed
  dataSharingConsent: boolean;
  consentedAt?: string;
  consentVersion: string;
}

export interface AuditMetadata {
  // Append-only audit metadata; no raw payloads.
  action: string;
  actorId: string;
  actorRole: Role;
  organizationId: string;
  patientId?: string;
  timestamp: string;
  // outcome: "success" | "denied" | "error"
  outcome: "success" | "denied" | "error";
}

export interface AssessmentSession {
  id: string;
  organizationId: string;
  patientId: string;
  clinicianId: string;
  status: AssessmentStatus;
  cognitiveTests: CognitiveTestObservation[];
  speech: SpeechObservation;
  gait: GaitObservation;
  resultProvenance: ResultProvenance;
  consent: ConsentMetadata;
  clinicianNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  organizationId: string;
  clinicianId: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
}

// Demo marker — every synthetic fixture carries this literal so demo mode is
// unmistakable and impossible to mistake for production.
export interface DemoMarker {
  demo: true;
}

export type DemoPatient = Patient & DemoMarker;
export type DemoAssessmentSession = AssessmentSession & DemoMarker;
export type DemoUser = User & DemoMarker;

// Data minimization: collect only fields genuinely needed for the screening
// workflow. Raw audio/video/transcripts are not persisted by default.
