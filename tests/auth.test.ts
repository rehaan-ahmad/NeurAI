import { describe, it, expect } from "vitest";
import { authorize } from "@/server/auth/authorize";
import { ForbiddenError } from "@/server/auth/errors";

describe("server-side authorization", () => {
  it("allows clinician when clinician required", () => {
    const { user } = authorize({ requiredRole: "clinician" });
    expect(user.role).toBe("clinician");
  });

  it("allows admin when clinician required (role hierarchy)", () => {
    // Demo user is a clinician; an admin would also pass. We test the actorRole
    // override to simulate an admin without provisioning real users.
    const { user } = authorize({
      requiredRole: "clinician",
      actorRole: "admin",
    });
    expect(user.role).toBe("clinician"); // session user stays demo clinician
  });

  it("denies clinician when admin required", () => {
    expect(() => authorize({ requiredRole: "admin" })).toThrow(ForbiddenError);
  });

  it("denies wrong organization scope", () => {
    expect(() =>
      authorize({ requiredRole: "clinician", organizationId: "org-other" }),
    ).toThrow(ForbiddenError);
  });

  it("denies patient cross-patient access", () => {
    expect(() =>
      authorize({
        requiredRole: "patient",
        actorRole: "patient",
        patientId: "patient-other",
      }),
    ).toThrow(ForbiddenError);
  });

  it("allows patient own-record access", () => {
    expect(() =>
      authorize({
        requiredRole: "patient",
        actorRole: "patient",
        patientId: "user-demo-clinician",
      }),
    ).not.toThrow();
  });

  it("succeeds with no required role", () => {
    const { user } = authorize({});
    expect(user.id).toBeDefined();
  });
});
