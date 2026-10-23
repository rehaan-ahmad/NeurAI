// Validation — dependency-free typed validators for domain boundaries.
// All untrusted input validated at the edge; safe error responses.

import type {
  Patient,
  AssessmentSession,
  Role,
  ModalityStatus,
  AssessmentStatus,
} from "@/types/domain";

export class ValidationError extends Error {
  public readonly field: string;
  public readonly value: unknown;

  constructor(message: string, field: string, value: unknown) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.value = value;
  }
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} is required`, field, value);
  }
  return value.trim();
}

export function validateRole(value: unknown): Role {
  const r = requiredString(value, "role");
  if (r !== "clinician" && r !== "admin" && r !== "patient") {
    throw new ValidationError(`Invalid role: ${r}`, "role", value);
  }
  return r;
}

export function validateModalityStatus(value: unknown): ModalityStatus {
  const s = requiredString(value, "status");
  const valid: ModalityStatus[] = [
    "missing",
    "not-performed",
    "unavailable",
    "completed",
  ];
  if (!valid.includes(s as ModalityStatus)) {
    throw new ValidationError(`Invalid modality status: ${s}`, "status", value);
  }
  return s as ModalityStatus;
}

export function validateAssessmentStatus(value: unknown): AssessmentStatus {
  const s = requiredString(value, "status");
  const valid: AssessmentStatus[] = [
    "scheduled",
    "in-progress",
    "completed",
    "cancelled",
  ];
  if (!valid.includes(s as AssessmentStatus)) {
    throw new ValidationError(`Invalid assessment status: ${s}`, "status", value);
  }
  return s as AssessmentStatus;
}

export function validatePatient(input: unknown): Patient {
  const obj = input as Record<string, unknown>;
  const displayId = requiredString(obj.displayId, "displayId");
  if (displayId.length < 2 || displayId.length > 32) {
    throw new ValidationError(
      "displayId must be 2–32 characters",
      "displayId",
      displayId,
    );
  }
  const age = obj.age;
  if (typeof age !== "number" || !Number.isInteger(age) || age < 0 || age > 120) {
    throw new ValidationError("age must be an integer 0–120", "age", age);
  }
  const gender = requiredString(obj.gender, "gender");
  const validGender = [
    "male",
    "female",
    "other",
    "prefer-not-to-say",
  ] as const;
  if (!validGender.includes(gender as (typeof validGender)[number])) {
    throw new ValidationError(`Invalid gender: ${gender}`, "gender", gender);
  }
  const organizationId = requiredString(obj.organizationId, "organizationId");
  const createdBy = requiredString(obj.createdBy, "createdBy");

  return {
    id: obj.id as string ?? "",
    organizationId,
    displayId,
    age,
    gender: gender as Patient["gender"],
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Patient;
}

export function validateAssessmentSession(
  input: unknown,
): AssessmentSession {
  const obj = input as Record<string, unknown>;
  const patientId = requiredString(obj.patientId, "patientId");
  const clinicianId = requiredString(obj.clinicianId, "clinicianId");
  const organizationId = requiredString(obj.organizationId, "organizationId");
  const status = validateAssessmentStatus(obj.status);
  const consent = obj.consent as Record<string, unknown> | undefined;
  const consentPurpose = Boolean(consent?.purposeDisclosed);
  const consentRetention = Boolean(consent?.retentionDisclosed);
  const consentRecording = Boolean(consent?.recordingConsent);

  return {
    id: obj.id as string ?? "",
    organizationId,
    patientId,
    clinicianId,
    status,
    cognitiveTests: [],
    speech: { status: "missing" },
    gait: { status: "missing" },
    resultProvenance: {
      clinicianId,
      reviewStatus: "pending",
      compositeAvailable: false,
    },
    consent: {
      purposeDisclosed: consentPurpose,
      retentionDisclosed: consentRetention,
      recordingConsent: consentRecording,
      dataSharingConsent: false,
      consentVersion: "1.0.0",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as AssessmentSession;
}
