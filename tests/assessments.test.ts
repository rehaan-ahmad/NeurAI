import { describe, it, expect } from "vitest";
import {
  validateModalityStatus,
  validateAssessmentSession,
  ValidationError,
} from "@/lib/validation";
import { demoRepositories } from "@/lib/demo/adaptor";
import type { DemoAssessmentSession } from "@/types/domain";

describe("assessment modality statuses", () => {
  it("accepts all four statuses", () => {
    expect(validateModalityStatus("missing")).toBe("missing");
    expect(validateModalityStatus("not-performed")).toBe("not-performed");
    expect(validateModalityStatus("unavailable")).toBe("unavailable");
    expect(validateModalityStatus("completed")).toBe("completed");
  });
  it("rejects invalid status", () => {
    expect(() => validateModalityStatus("unknown")).toThrow(ValidationError);
  });
});

describe("assessment session", () => {
  it("has compositeAvailable false and pending review by default", () => {
    const s = validateAssessmentSession({
      patientId: "p-1",
      clinicianId: "c-1",
      organizationId: "org-1",
      status: "scheduled",
      consent: {
        purposeDisclosed: true,
        retentionDisclosed: true,
        recordingConsent: false,
      },
    });
    expect(s.resultProvenance.compositeAvailable).toBe(false);
    expect(s.resultProvenance.reviewStatus).toBe("pending");
    expect(s.speech.status).toBe("missing");
    expect(s.gait.status).toBe("missing");
  });

  it("distinguishes missing vs completed cognitive observation", () => {
    const s = validateAssessmentSession({
      patientId: "p-1",
      clinicianId: "c-1",
      organizationId: "org-1",
      status: "in-progress",
      consent: {
        purposeDisclosed: true,
        retentionDisclosed: true,
        recordingConsent: false,
      },
    });
    s.cognitiveTests.push({
      testId: "cog-01",
      name: "Generic recall",
      score: 7,
      maxScore: 10,
      status: "completed",
      notes: undefined,
      assessedAt: new Date().toISOString(),
    });
    const completed = s.cognitiveTests.filter((t) => t.status === "completed");
    expect(completed.length).toBe(1);
    const missing = s.cognitiveTests.filter((t) => t.status === "missing");
    expect(missing.length).toBe(0);
  });
});

describe("assessment demo scope", () => {
  it("create + list stays within org", async () => {
    const created = (await demoRepositories.assessments.create({
      organizationId: "org-demo-0001",
      patientId: "patient-demo-001",
      clinicianId: "user-demo-clinician",
      status: "scheduled",
      cognitiveTests: [],
      speech: { status: "missing" },
      gait: { status: "missing" },
      resultProvenance: {
        clinicianId: "user-demo-clinician",
        reviewStatus: "pending",
        compositeAvailable: false,
      },
      consent: {
        purposeDisclosed: true,
        retentionDisclosed: true,
        recordingConsent: false,
        dataSharingConsent: false,
        consentVersion: "1.0.0",
      },
    })) as DemoAssessmentSession;
    expect(created.demo).toBe(true);
    const list = await demoRepositories.assessments.listAllByOrganization(
      "org-demo-0001",
    );
    expect(list.some((s) => s.id === created.id)).toBe(true);
    const other = await demoRepositories.assessments.listAllByOrganization(
      "org-other",
    );
    expect(other.some((s) => s.id === created.id)).toBe(false);
  });
});
