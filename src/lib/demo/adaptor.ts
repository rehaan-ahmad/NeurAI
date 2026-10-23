// Demo adaptor — synthetic fixtures only. Carries a literal `demo: true`
// marker on every record so demo mode is unmistakable and cannot be mistaken
// for production. No realistic identifiable data, no random risk scores.

import type {
  DemoPatient,
  DemoUser,
  DemoAssessmentSession,
  Patient,
  AssessmentSession,
  User,
} from "@/types/domain";
import { PatientRepository, AssessmentRepository, AuthRepository } from "@/lib/repositories";

const DEMO_ORG_ID = "org-demo-0001";

const DEMO_USER: DemoUser = {
  id: "user-demo-clinician",
  email: "clinician.demo@neurai.example",
  role: "clinician",
  organizationId: DEMO_ORG_ID,
  name: "Demo Clinician",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  demo: true,
};

const DEMO_PATIENTS: DemoPatient[] = [
  {
    id: "patient-demo-001",
    organizationId: DEMO_ORG_ID,
    displayId: "P-1001",
    age: 68,
    gender: "female",
    createdBy: DEMO_USER.id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    demo: true,
  },
  {
    id: "patient-demo-002",
    organizationId: DEMO_ORG_ID,
    displayId: "P-1002",
    age: 74,
    gender: "male",
    createdBy: DEMO_USER.id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    demo: true,
  },
];

const now = new Date().toISOString();

const DEMO_SESSIONS: DemoAssessmentSession[] = [
  {
    id: "session-demo-001",
    organizationId: DEMO_ORG_ID,
    patientId: "patient-demo-001",
    clinicianId: DEMO_USER.id,
    status: "completed",
    cognitiveTests: [
      {
        testId: "cog-generic-01",
        name: "Generic recall task",
        score: 8,
        maxScore: 10,
        status: "completed",
        notes: "Completed without assistance.",
        assessedAt: now,
      },
      {
        testId: "cog-generic-02",
        name: "Generic orientation task",
        score: 5,
        maxScore: 5,
        status: "completed",
        notes: undefined,
        assessedAt: now,
      },
    ],
    speech: { status: "completed", capturedAt: now, notes: "Local demo capture only." },
    gait: { status: "missing", notes: "Not performed in this session." },
    resultProvenance: {
      clinicianId: DEMO_USER.id,
      reviewedAt: now,
      reviewStatus: "reviewed",
      compositeAvailable: false,
    },
    consent: {
      purposeDisclosed: true,
      retentionDisclosed: true,
      recordingConsent: true,
      dataSharingConsent: false,
      consentedAt: now,
      consentVersion: "1.0.0",
    },
    clinicianNotes: "Descriptive summary only; not a diagnosis.",
    createdAt: now,
    updatedAt: now,
    demo: true,
  },
];

export class DemoPatientRepository implements PatientRepository {
  async listByOrganization(organizationId: string): Promise<Patient[]> {
    if (organizationId !== DEMO_ORG_ID) return [];
    return [...DEMO_PATIENTS];
  }
  async getById(id: string, organizationId: string): Promise<Patient | null> {
    if (organizationId !== DEMO_ORG_ID) return null;
    return DEMO_PATIENTS.find((p) => p.id === id) ?? null;
  }
  async create(patient: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
    const created: DemoPatient = {
      ...patient,
      id: `patient-demo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      demo: true,
    };
    DEMO_PATIENTS.push(created);
    return created;
  }
  async update(
    id: string,
    organizationId: string,
    patch: Partial<Pick<Patient, "displayId" | "age" | "gender">>,
  ): Promise<Patient> {
    const idx = DEMO_PATIENTS.findIndex((p) => p.id === id && p.organizationId === organizationId);
    if (idx === -1) throw new Error("Patient not found");
    DEMO_PATIENTS[idx] = { ...DEMO_PATIENTS[idx], ...patch, updatedAt: new Date().toISOString() };
    return DEMO_PATIENTS[idx];
  }
  async softDelete(id: string, organizationId: string): Promise<void> {
    const idx = DEMO_PATIENTS.findIndex((p) => p.id === id && p.organizationId === organizationId);
    if (idx === -1) throw new Error("Patient not found");
    DEMO_PATIENTS.splice(idx, 1);
  }
}

export class DemoAssessmentRepository implements AssessmentRepository {
  async listByPatient(patientId: string, organizationId: string): Promise<AssessmentSession[]> {
    if (organizationId !== DEMO_ORG_ID) return [];
    return DEMO_SESSIONS.filter((s) => s.patientId === patientId);
  }
  async getById(id: string, organizationId: string): Promise<AssessmentSession | null> {
    if (organizationId !== DEMO_ORG_ID) return null;
    return DEMO_SESSIONS.find((s) => s.id === id) ?? null;
  }
  async create(session: Omit<AssessmentSession, "id" | "createdAt" | "updatedAt">): Promise<AssessmentSession> {
    const created: DemoAssessmentSession = {
      ...session,
      id: `session-demo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      demo: true,
    };
    DEMO_SESSIONS.push(created);
    return created;
  }
  async update(
    id: string,
    organizationId: string,
    patch: Partial<AssessmentSession>,
  ): Promise<AssessmentSession> {
    const idx = DEMO_SESSIONS.findIndex((s) => s.id === id && s.organizationId === organizationId);
    if (idx === -1) throw new Error("Session not found");
    DEMO_SESSIONS[idx] = { ...DEMO_SESSIONS[idx], ...patch, updatedAt: new Date().toISOString() };
    return DEMO_SESSIONS[idx];
  }
}

export class DemoAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<User | null> {
    return DEMO_USER;
  }
  async hasRole(role: string): Promise<boolean> {
    return DEMO_USER.role === role;
  }
  async inOrganization(organizationId: string): Promise<boolean> {
    return DEMO_USER.organizationId === organizationId;
  }
}

export const demoRepositories = {
  patients: new DemoPatientRepository(),
  assessments: new DemoAssessmentRepository(),
  auth: new DemoAuthRepository(),
};
