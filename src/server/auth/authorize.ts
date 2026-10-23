// Server-side authorization — NeurAI
//
// Every protected route/mutation independently checks identity, role and
// organization/patient scope on the server. Hiding a button is not
// authorization. Fail closed: missing config or insufficient scope => error.

import { requireSession } from "@/server/auth/session";
import { ForbiddenError } from "@/server/auth/errors";
import type { Role } from "@/types/domain";

export interface AuthorizeOptions {
  /** Minimum role required. Role hierarchy: admin > clinician > patient. */
  requiredRole?: Role;
  /** The organization the actor must belong to. */
  organizationId?: string;
  /** Patient scope: actor must be this patient (for patient self-service). */
  patientId?: string;
  actorRole?: Role;
}

const roleRank: Record<Role, number> = { patient: 0, clinician: 1, admin: 2 };

function roleSatisfies(actorRole: Role, requiredRole?: Role): boolean {
  if (!requiredRole) return true;
  return roleRank[actorRole] >= roleRank[requiredRole];
}

export function authorize(options: AuthorizeOptions = {}): {
  user: NonNullable<ReturnType<typeof requireSession>["user"]>;
  organizationId: string;
  demo: boolean;
} {
  const session = requireSession();
  const { user, demo } = session;
  const actorRole = options.actorRole ?? user.role;

  // Identity check
  if (!user || !user.id) {
    throw new ForbiddenError("No authenticated identity");
  }

  // Role check (least privilege)
  if (!roleSatisfies(actorRole, options.requiredRole)) {
    throw new ForbiddenError(
      `Role "${actorRole}" insufficient; requires "${options.requiredRole}"`,
    );
  }

  // Organization / tenancy scope check
  if (options.organizationId && user.organizationId !== options.organizationId) {
    throw new ForbiddenError(
      `Actor organization "${user.organizationId}" does not target "${options.organizationId}"`,
    );
  }

  // Patient self-service scope: patients may only touch their own records
  if (options.patientId && actorRole === "patient" && user.id !== options.patientId) {
    throw new ForbiddenError("Patients may only access their own records");
  }

  return { user, organizationId: user.organizationId, demo };
}

export type { ForbiddenError };
