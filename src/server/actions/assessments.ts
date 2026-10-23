"use server";

// Server actions — assessment sessions. Every action independently checks
// identity, role and org scope on the server, validates input, and records
// an audit event. No dementia risk score or composite result is ever
// calculated; resultProvenance.compositeAvailable stays false.

import { authorize } from "@/server/auth/authorize";
import { recordAudit } from "@/lib/audit";
import {
  validateAssessmentSession,
  ValidationError,
} from "@/lib/validation";
import { demoRepositories } from "@/lib/demo/adaptor";
import type {
  AssessmentSession,
  CognitiveTestObservation,
} from "@/types/domain";
export async function listAssessmentsAction() {
  const session = authorize({ requiredRole: "clinician" });
  return demoRepositories.assessments.listAllByOrganization(
    session.organizationId,
  );
}

export async function getAssessmentAction(id: string) {
  const session = authorize({ requiredRole: "clinician" });
  return demoRepositories.assessments.getById(id, session.organizationId);
}

export async function createAssessmentAction(formData: FormData) {
  const session = authorize({ requiredRole: "clinician" });
  const patientId = String(formData.get("patientId") ?? "");
  const status = String(formData.get("status") ?? "scheduled");
  const consent = {
    purposeDisclosed: formData.get("consentPurpose") === "on",
    retentionDisclosed: formData.get("consentRetention") === "on",
    recordingConsent: formData.get("consentRecording") === "on",
    dataSharingConsent: false,
    consentVersion: "1.0.0",
  };

  const raw = {
    patientId,
    clinicianId: session.user.id,
    organizationId: session.organizationId,
    status,
    consent,
  };
  let assessment: AssessmentSession;
  try {
    assessment = validateAssessmentSession(raw);
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: error.message, field: error.field };
    }
    throw error;
  }
  const created = await demoRepositories.assessments.create(assessment);
  recordAudit({
    action: "assessment.create",
    actorId: session.user.id,
    actorRole: session.user.role,
    organizationId: session.organizationId,
    patientId: created.patientId,
    outcome: "success",
  });
  return { assessment: created };
}

export async function updateObservationAction(
  assessmentId: string,
  formData: FormData,
) {
  const session = authorize({ requiredRole: "clinician" });
  const existing = await demoRepositories.assessments.getById(
    assessmentId,
    session.organizationId,
  );
  if (!existing) return { error: "Assessment not found" };

  const testId = String(formData.get("testId") ?? "");
  const name = String(formData.get("name") ?? "");
  const status = String(formData.get("status") ?? "missing");
  const notes = String(formData.get("notes") ?? "");

  const parseScore = (v: FormDataEntryValue | null | undefined): number | undefined => {
    if (v === null || v === undefined || v === "") return undefined;
    return Number(v);
  };

  const observation: CognitiveTestObservation = {
    testId,
    name,
    score: parseScore(formData.get("score")),
    maxScore: parseScore(formData.get("maxScore")),
    status: status as CognitiveTestObservation["status"],
    notes: notes || undefined,
    assessedAt: new Date().toISOString(),
  };

  const cognitiveTests = [
    ...existing.cognitiveTests.filter((t) => t.testId !== testId),
    observation,
  ];

  const updated = await demoRepositories.assessments.update(assessmentId, session.organizationId, {
    cognitiveTests,
  } as Partial<AssessmentSession>);
  recordAudit({
    action: "assessment.update_observation",
    actorId: session.user.id,
    actorRole: session.user.role,
    organizationId: session.organizationId,
    patientId: existing.patientId,
    outcome: "success",
  });
  return { assessment: updated };
}

export async function completeAssessmentAction(assessmentId: string) {
  const session = authorize({ requiredRole: "clinician" });
  const existing = await demoRepositories.assessments.getById(
    assessmentId,
    session.organizationId,
  );
  if (!existing) return { error: "Assessment not found" };

  const updated = await demoRepositories.assessments.update(assessmentId, session.organizationId, {
    status: "completed",
    resultProvenance: {
      ...existing.resultProvenance,
      clinicianId: session.user.id,
      reviewStatus: "pending",
      compositeAvailable: false,
    },
  } as Partial<AssessmentSession>);
  recordAudit({
    action: "assessment.complete",
    actorId: session.user.id,
    actorRole: session.user.role,
    organizationId: session.organizationId,
    patientId: existing.patientId,
    outcome: "success",
  });
  return { assessment: updated };
}
