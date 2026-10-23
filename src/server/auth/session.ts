// Server-side session — NeurAI
//
// Demo mode (DEMO_MODE=true, the default) returns the synthetic demo clinician
// and is visibly labeled everywhere; it cannot be mistaken for production.
// Production (DEMO_MODE=false) requires Supabase Auth to be provisioned and
// configured; until then it throws an actionable error rather than silently
// accepting a fixed user. No credentials are added by default.

import { validateEnv } from "@/lib/env";
import { UnauthorizedError } from "@/server/auth/errors";
import type { User } from "@/types/domain";

const DEMO_USER: User = {
  id: "user-demo-clinician",
  email: "clinician.demo@neurai.example",
  role: "clinician",
  organizationId: "org-demo-0001",
  name: "Demo Clinician",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export interface Session {
  user: User;
  organizationId: string;
  demo: boolean;
}

export function getSession(): Session | null {
  const config = validateEnv();

  if (config.demo) {
    return {
      user: DEMO_USER,
      organizationId: DEMO_USER.organizationId,
      demo: true,
    };
  }

  // Production path: Supabase Auth. Not provisioned; no client initialized
  // until the owner approves Supabase and adds credentials. Fail closed.
  throw new Error(
    "Authentication is not configured. Set DEMO_MODE=true for local demo, or "
    + "provision Supabase Auth and configure NEXT_PUBLIC_SUPABASE_URL, "
    + "NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.",
  );
}

export function requireSession(): Session {
  const session = getSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

export { UnauthorizedError };
