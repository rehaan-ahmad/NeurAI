import { describe, it, expect } from "vitest";
import {
  getPatientRepository,
  getAssessmentRepository,
} from "@/server/persistence";
import { recordAudit, listAudit } from "@/server/persistence/audit";
import { isSupabaseConfigured } from "@/server/persistence/supabase";

describe("persistence access rules (demo adaptor)", () => {
  it("patient list is org-scoped", async () => {
    const repo = getPatientRepository();
    const all = await repo.listByOrganization("org-demo-0001");
    const other = await repo.listByOrganization("org-other");
    expect(all.length).toBeGreaterThan(0);
    expect(other).toEqual([]);
  });

  it("patient getById denies cross-org access", async () => {
    const repo = getPatientRepository();
    const all = await repo.listByOrganization("org-demo-0001");
    const target = all[0];
    const got = await repo.getById(target.id, "org-other");
    expect(got).toBeNull();
  });

  it("assessment list is org-scoped", async () => {
    const repo = getAssessmentRepository();
    const other = await repo.listAllByOrganization("org-other");
    expect(other).toEqual([]);
  });
});

describe("audit (demo adaptor)", () => {
  it("records append-only metadata without raw payloads", async () => {
    await recordAudit({
      action: "patient.create",
      actorId: "user-1",
      actorRole: "clinician",
      organizationId: "org-1",
      patientId: "patient-1",
      outcome: "success",
    });
    const log = await listAudit();
    const last = log[log.length - 1];
    expect(last.action).toBe("patient.create");
    expect(last.timestamp).toBeDefined();
    expect(last).not.toHaveProperty("displayId");
    expect(last).not.toHaveProperty("age");
    expect(last).not.toHaveProperty("clinicianNotes");
  });
});

describe("supabase fail-closed", () => {
  it("reports not configured until credentials are present", () => {
    // In the demo environment Supabase is intentionally not configured.
    expect(isSupabaseConfigured()).toBe(false);
  });
});
