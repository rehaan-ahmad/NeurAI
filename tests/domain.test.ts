import { describe, it, expect } from "vitest";
import {
  validateRole,
  validateModalityStatus,
  validateAssessmentStatus,
  validatePatient,
  validateAssessmentSession,
  ValidationError,
} from "@/lib/validation";
import { demoRepositories } from "@/lib/demo/adaptor";
import type { DemoPatient } from "@/types/domain";

describe("validation", () => {
  it("accepts valid roles", () => {
    expect(validateRole("clinician")).toBe("clinician");
    expect(validateRole("admin")).toBe("admin");
    expect(validateRole("patient")).toBe("patient");
  });
  it("rejects invalid role", () => {
    expect(() => validateRole("superuser")).toThrow(ValidationError);
  });
  it("accepts valid modality statuses", () => {
    expect(validateModalityStatus("missing")).toBe("missing");
    expect(validateModalityStatus("completed")).toBe("completed");
  });
  it("rejects invalid modality status", () => {
    expect(() => validateModalityStatus("unknown")).toThrow(ValidationError);
  });
  it("accepts valid assessment statuses", () => {
    expect(validateAssessmentStatus("scheduled")).toBe("scheduled");
    expect(validateAssessmentStatus("completed")).toBe("completed");
  });
  it("validates a patient", () => {
    const p = validatePatient({
      displayId: "P-1001",
      age: 68,
      gender: "female",
      organizationId: "org-1",
      createdBy: "user-1",
    });
    expect(p.displayId).toBe("P-1001");
    expect(p.age).toBe(68);
  });
  it("rejects out-of-range age", () => {
    expect(() =>
      validatePatient({
        displayId: "P-1",
        age: 200,
        gender: "male",
        organizationId: "org-1",
        createdBy: "user-1",
      }),
    ).toThrow(ValidationError);
  });
  it("rejects empty displayId", () => {
    expect(() =>
      validatePatient({
        displayId: "",
        age: 68,
        gender: "male",
        organizationId: "org-1",
        createdBy: "user-1",
      }),
    ).toThrow(ValidationError);
  });
  it("builds a session with defaults", () => {
    const s = validateAssessmentSession({
      patientId: "p-1",
      clinicianId: "c-1",
      organizationId: "org-1",
      status: "scheduled",
      consent: {
        purposeDisclosed: true,
        retentionDisclosed: true,
        recordingConsent: true,
      },
    });
    expect(s.status).toBe("scheduled");
    expect(s.speech.status).toBe("missing");
    expect(s.gait.status).toBe("missing");
    expect(s.resultProvenance.compositeAvailable).toBe(false);
    expect(s.resultProvenance.reviewStatus).toBe("pending");
  });
});

describe("demo adaptor scope isolation", () => {
  it("lists only demo org patients", async () => {
    const all = await demoRepositories.patients.listByOrganization("org-demo-0001");
    expect(all.length).toBeGreaterThan(0);
    expect(
      all.every((p) => (p as DemoPatient).demo === true),
    ).toBe(true);
    const other = await demoRepositories.patients.listByOrganization("org-other");
    expect(other).toEqual([]);
  });
  it("patient create/update/delete stays in org scope", async () => {
    const created = await demoRepositories.patients.create({
      displayId: "P-999",
      age: 70,
      gender: "male",
      organizationId: "org-demo-0001",
      createdBy: "user-demo-clinician",
    });
    expect((created as DemoPatient).demo).toBe(true);
    expect(created.organizationId).toBe("org-demo-0001");

    const updated = await demoRepositories.patients.update(created.id, "org-demo-0001", { age: 71 });
    expect(updated.age).toBe(71);

    await demoRepositories.patients.softDelete(created.id, "org-demo-0001");
    const gone = await demoRepositories.patients.getById(created.id, "org-demo-0001");
    expect(gone).toBeNull();
  });
  it("cross-org reads are denied", async () => {
    const got = await demoRepositories.patients.getById("patient-demo-001", "org-other");
    expect(got).toBeNull();
  });
});
