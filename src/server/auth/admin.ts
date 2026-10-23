// Admin authorization — NeurAI
//
// Server-side admin authorization (least privilege). Only the "admin" role may
// access admin operations. Every check runs on the server.

import { requireSession } from "@/server/auth/session";
import { ForbiddenError } from "@/server/auth/errors";
import type { Role } from "@/types/domain";

export function requireAdmin(): {
  user: NonNullable<ReturnType<typeof requireSession>["user"]>;
  organizationId: string;
  demo: boolean;
} {
  const session = requireSession();
  if (session.user.role !== "admin") {
    throw new ForbiddenError("Admin role required");
  }
  return { user: session.user, organizationId: session.organizationId, demo: session.demo };
}

export function isAdmin(role: Role): boolean {
  return role === "admin";
}
