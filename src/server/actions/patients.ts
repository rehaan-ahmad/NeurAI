"use server";

// Server actions — patient management. Every action independently checks
// identity, role and org scope on the server, validates input, and records
// an audit event. Demo mode uses synthetic fixtures only.

import { authorize } from "@/server/auth/authorize";
import { recordAudit } from "@/lib/audit";
import {
  validatePatient,
  ValidationError,
} from "@/lib/validation";
import { demoRepositories } from "@/lib/demo/adaptor";
import type { Patient } from "@/types/domain";

export async function listPatientsAction() {
  const { organizationId } = authorize({ requiredRole: "clinician" });
  return demoRepositories.patients.listByOrganization(organizationId);
}

export async function getPatientAction(id: string) {
  const session = authorize({ requiredRole: "clinician" });
  return demoRepositories.patients.getById(id, session.organizationId);
}

export async function createPatientAction(formData: FormData) {
  const session = authorize({ requiredRole: "clinician" });
  const raw = {
    displayId: formData.get("displayId"),
    age: Number(formData.get("age")),
    gender: formData.get("gender"),
    organizationId: session.organizationId,
    createdBy: session.user.id,
  };
  let patient: Patient;
  try {
    patient = validatePatient(raw);
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: error.message, field: error.field };
    }
    throw error;
  }
  const created = await demoRepositories.patients.create(patient);
  recordAudit({
    action: "patient.create",
    actorId: session.user.id,
    actorRole: session.user.role,
    organizationId: session.organizationId,
    patientId: created.id,
    outcome: "success",
  });
  return { patient: created };
}

export async function updatePatientAction(
  id: string,
  formData: FormData,
) {
  const session = authorize({ requiredRole: "clinician" });
  const existing = await demoRepositories.patients.getById(
    id,
    session.organizationId,
  );
  if (!existing) return { error: "Patient not found" };

  const patch: Partial<Pick<Patient, "displayId" | "age" | "gender">> = {};
  const displayId = formData.get("displayId");
  const age = formData.get("age");
  const gender = formData.get("gender");
  if (displayId !== null) patch.displayId = String(displayId);
  if (age !== null) patch.age = Number(age);
  if (gender !== null) patch.gender = String(gender) as Patient["gender"];

  try {
    const updated = await demoRepositories.patients.update(
      id,
      session.organizationId,
      patch,
    );
    recordAudit({
      action: "patient.update",
      actorId: session.user.id,
      actorRole: session.user.role,
      organizationId: session.organizationId,
      patientId: id,
      outcome: "success",
    });
    return { patient: updated };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: error.message, field: error.field };
    }
    throw error;
  }
}

export async function deletePatientAction(id: string) {
  const session = authorize({ requiredRole: "admin" });
  await demoRepositories.patients.softDelete(id, session.organizationId);
  recordAudit({
    action: "patient.delete",
    actorId: session.user.id,
    actorRole: session.user.role,
    organizationId: session.organizationId,
    patientId: id,
    outcome: "success",
  });
  return { ok: true };
}
