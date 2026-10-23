import { describe, it, expect, beforeEach } from "vitest";
import { validatePatient, ValidationError } from "@/lib/validation";
import { demoRepositories } from "@/lib/demo/adaptor";
import { clearAuditForDemo, listAudit, recordAudit } from "@/lib/audit";

describe("patient validation", () => {
  it("accepts a valid patient", () => {
    const p = validatePatient({
      displayId: "P-2001",
      age: 70,
      gender: "female",
      organizationId: "org-1",
      createdBy: "user-1",
    });
    expect(p.displayId).toBe("P-2001");
    expect(p.age).toBe(70);
  });

  it("rejects blank displayId", () => {
    expect(() =>
      validatePatient({
        displayId: "   ",
        age: 70,
        gender: "male",
        organizationId: "org-1",
        createdBy: "user-1",
      }),
    ).toThrow(ValidationError);
  });

  it("rejects age out of range", () => {
    expect(() =>
      validatePatient({
        displayId: "P-1",
        age: -1,
        gender: "male",
        organizationId: "org-1",
        createdBy: "user-1",
      }),
    ).toThrow(ValidationError);
  });
});

describe("patient demo scope isolation", () => {
  beforeEach(() => {
    clearAuditForDemo();
  });

  it("create + list stays within org", async () => {
    const created = await demoRepositories.patients.create({
      displayId: "P-999",
      age: 72,
      gender: "male",
      organizationId: "org-demo-0001",
      createdBy: "user-demo-clinician",
    });
    expect(created.organizationId).toBe("org-demo-0001");
    const list = await demoRepositories.patients.listByOrganization("org-demo-0001");
    expect(list.some((p) => p.id === created.id)).toBe(true);
    const other = await demoRepositories.patients.listByOrganization("org-other");
    expect(other.some((p) => p.id === created.id)).toBe(false);
  });
});

describe("audit", () => {
  beforeEach(() => {
    clearAuditForDemo();
  });

  it("records append-only audit metadata without raw payloads", () => {
    recordAudit({
      action: "patient.create",
      actorId: "user-1",
      actorRole: "clinician",
      organizationId: "org-1",
      patientId: "patient-1",
      outcome: "success",
    });
    const log = listAudit();
    expect(log.length).toBe(1);
    expect(log[0].action).toBe("patient.create");
    expect(log[0].timestamp).toBeDefined();
    // No raw patient payload stored
    expect(log[0]).not.toHaveProperty("displayId");
    expect(log[0]).not.toHaveProperty("age");
  });
});
