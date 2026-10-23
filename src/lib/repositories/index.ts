// Repository interfaces — persistence/AI behind typed boundaries.
// A demo adapter cannot be confused with production; production adapters are
// wired only after Supabase is provisioned and approved.

import type {
  AssessmentSession,
  Patient,
  Role,
  User,
} from "@/types/domain";

export interface PatientRepository {
  listByOrganization(organizationId: string): Promise<Patient[]>;
  getById(id: string, organizationId: string): Promise<Patient | null>;
  create(patient: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient>;
  update(
    id: string,
    organizationId: string,
    patch: Partial<Pick<Patient, "displayId" | "age" | "gender">>,
  ): Promise<Patient>;
  // Destructive actions require confirmation at the service layer.
  softDelete(id: string, organizationId: string): Promise<void>;
}

export interface AssessmentRepository {
  listByPatient(patientId: string, organizationId: string): Promise<AssessmentSession[]>;
  getById(id: string, organizationId: string): Promise<AssessmentSession | null>;
  create(session: Omit<AssessmentSession, "id" | "createdAt" | "updatedAt">): Promise<AssessmentSession>;
  update(
    id: string,
    organizationId: string,
    patch: Partial<AssessmentSession>,
  ): Promise<AssessmentSession>;
  listAllByOrganization(organizationId: string): Promise<AssessmentSession[]>;
}

export interface AuthRepository {
  getCurrentUser(): Promise<User | null>;
  hasRole(role: string): Promise<boolean>;
  inOrganization(organizationId: string): Promise<boolean>;
}

export interface AuditRepository {
  record(entry: {
    action: string;
    actorId: string;
    actorRole: Role;
    organizationId: string;
    patientId?: string;
    outcome: "success" | "denied" | "error";
  }): Promise<void>;
}
