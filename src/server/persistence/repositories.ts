// Supabase-backed repository implementations — NeurAI
//
// These are wired only when Supabase is provisioned and approved. Until then,
// the demo adaptor (src/lib/demo/adaptor.ts) is used and is visibly labeled.
// Every method enforces organization/patient scope server-side.

import type { SupabaseClient } from "@/server/persistence/supabase";
import { getSupabase } from "@/server/persistence/supabase";
import type {
  AssessmentSession,
  Patient,
  User,
} from "@/types/domain";

type DbPatient = {
  id: string;
  organization_id: string;
  display_id: string;
  age: number;
  gender: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type DbAssessment = {
  id: string;
  organization_id: string;
  patient_id: string;
  clinician_id: string;
  status: string;
  cognitive_tests: unknown;
  speech: unknown;
  gait: unknown;
  result_provenance: unknown;
  consent: unknown;
  clinician_notes: string | null;
  created_at: string;
  updated_at: string;
};

export class SupabasePatientRepository {
  private readonly sb: SupabaseClient;

  constructor() {
    this.sb = getSupabase();
  }

  async listByOrganization(organizationId: string): Promise<Patient[]> {
    const { data, error } = await this.sb
      .from("patients")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: DbPatient) => ({
      id: row.id,
      organizationId: row.organization_id,
      displayId: row.display_id,
      age: row.age,
      gender: row.gender as Patient["gender"],
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async getById(id: string, organizationId: string): Promise<Patient | null> {
    const { data, error } = await this.sb
      .from("patients")
      .select("*")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const row = data as DbPatient;
    return {
      id: row.id,
      organizationId: row.organization_id,
      displayId: row.display_id,
      age: row.age,
      gender: row.gender as Patient["gender"],
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(patient: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
    const { data, error } = await this.sb
      .from("patients")
      .insert([
        {
          organization_id: patient.organizationId,
          display_id: patient.displayId,
          age: patient.age,
          gender: patient.gender,
          created_by: patient.createdBy,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    const row = data as DbPatient;
    return {
      id: row.id,
      organizationId: row.organization_id,
      displayId: row.display_id,
      age: row.age,
      gender: row.gender as Patient["gender"],
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async update(
    id: string,
    organizationId: string,
    patch: Partial<Pick<Patient, "displayId" | "age" | "gender">>,
  ): Promise<Patient> {
    const { data, error } = await this.sb
      .from("patients")
      .update({
        ...(patch.displayId !== undefined && { display_id: patch.displayId }),
        ...(patch.age !== undefined && { age: patch.age }),
        ...(patch.gender !== undefined && { gender: patch.gender }),
      })
      .eq("id", id)
      .eq("organization_id", organizationId)
      .select()
      .single();
    if (error) throw error;
    const row = data as DbPatient;
    return {
      id: row.id,
      organizationId: row.organization_id,
      displayId: row.display_id,
      age: row.age,
      gender: row.gender as Patient["gender"],
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async softDelete(id: string, organizationId: string): Promise<void> {
    const { error } = await this.sb
      .from("patients")
      .delete()
      .eq("id", id)
      .eq("organization_id", organizationId);
    if (error) throw error;
  }
}

export class SupabaseAssessmentRepository {
  private readonly sb: SupabaseClient;

  constructor() {
    this.sb = getSupabase();
  }

  async listByPatient(patientId: string, organizationId: string): Promise<AssessmentSession[]> {
    const { data, error } = await this.sb
      .from("assessments")
      .select("*")
      .eq("patient_id", patientId)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: DbAssessment) => this.mapRow(row));
  }

  async getById(id: string, organizationId: string): Promise<AssessmentSession | null> {
    const { data, error } = await this.sb
      .from("assessments")
      .select("*")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return this.mapRow(data as DbAssessment);
  }

  async listAllByOrganization(organizationId: string): Promise<AssessmentSession[]> {
    const { data, error } = await this.sb
      .from("assessments")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: DbAssessment) => this.mapRow(row));
  }

  async create(session: Omit<AssessmentSession, "id" | "createdAt" | "updatedAt">): Promise<AssessmentSession> {
    const { data, error } = await this.sb
      .from("assessments")
      .insert([
        {
          organization_id: session.organizationId,
          patient_id: session.patientId,
          clinician_id: session.clinicianId,
          status: session.status,
          cognitive_tests: session.cognitiveTests,
          speech: session.speech,
          gait: session.gait,
          result_provenance: session.resultProvenance,
          consent: session.consent,
          clinician_notes: session.clinicianNotes ?? null,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return this.mapRow(data as DbAssessment);
  }

  async update(
    id: string,
    organizationId: string,
    patch: Partial<AssessmentSession>,
  ): Promise<AssessmentSession> {
    const { data, error } = await this.sb
      .from("assessments")
      .update({
        ...(patch.status !== undefined && { status: patch.status }),
        ...(patch.cognitiveTests !== undefined && { cognitive_tests: patch.cognitiveTests }),
        ...(patch.speech !== undefined && { speech: patch.speech }),
        ...(patch.gait !== undefined && { gait: patch.gait }),
        ...(patch.resultProvenance !== undefined && { result_provenance: patch.resultProvenance }),
        ...(patch.consent !== undefined && { consent: patch.consent }),
        ...(patch.clinicianNotes !== undefined && { clinician_notes: patch.clinicianNotes }),
      })
      .eq("id", id)
      .eq("organization_id", organizationId)
      .select()
      .single();
    if (error) throw error;
    return this.mapRow(data as DbAssessment);
  }

  private mapRow(row: DbAssessment): AssessmentSession {
    return {
      id: row.id,
      organizationId: row.organization_id,
      patientId: row.patient_id,
      clinicianId: row.clinician_id,
      status: row.status as AssessmentSession["status"],
      cognitiveTests: (row.cognitive_tests ?? []) as AssessmentSession["cognitiveTests"],
      speech: (row.speech ?? { status: "missing" }) as AssessmentSession["speech"],
      gait: (row.gait ?? { status: "missing" }) as AssessmentSession["gait"],
      resultProvenance: (row.result_provenance ?? {
        clinicianId: row.clinician_id,
        reviewStatus: "pending",
        compositeAvailable: false,
      }) as AssessmentSession["resultProvenance"],
      consent: (row.consent ?? {
        purposeDisclosed: false,
        retentionDisclosed: false,
        recordingConsent: false,
        dataSharingConsent: false,
        consentVersion: "1.0.0",
      }) as AssessmentSession["consent"],
      clinicianNotes: row.clinician_notes ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export class SupabaseUserRepository {
  private readonly sb: SupabaseClient;

  constructor() {
    this.sb = getSupabase();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.sb.auth.getUser();
    const u = data?.user;
    if (!u) return null;
    return {
      id: u.id,
      email: u.email ?? "",
      role: "clinician",
      organizationId: u.user_metadata?.organization_id ?? "",
      name: u.user_metadata?.full_name ?? undefined,
      createdAt: u.created_at ?? "",
      updatedAt: u.updated_at ?? "",
    };
  }

  async hasRole(role: string): Promise<boolean> {
    const u = await this.getCurrentUser();
    return Boolean(u && u.role === role);
  }

  async inOrganization(organizationId: string): Promise<boolean> {
    const u = await this.getCurrentUser();
    return Boolean(u && u.organizationId === organizationId);
  }
}
