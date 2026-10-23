// Append-only audit events via Supabase — NeurAI
//
// Records only metadata (action, actor, org, patient, outcome, timestamp).
// Raw payloads are never stored. Code-configured only; uses the demo in-memory
// audit (src/lib/audit.ts) until Supabase is provisioned and approved.

import { Role } from "@/types/domain";
import { getSupabase, isSupabaseConfigured } from "@/server/persistence/supabase";
import { recordAudit as recordDemoAudit, listAudit as listDemoAudit } from "@/lib/audit";

export async function recordAudit(entry: {
  action: string;
  actorId: string;
  actorRole: Role;
  organizationId: string;
  patientId?: string;
  outcome: "success" | "denied" | "error";
}) {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { error } = await sb.from("audit_events").insert({
      organization_id: entry.organizationId,
      patient_id: entry.patientId ?? null,
      actor_id: entry.actorId,
      actor_role: entry.actorRole,
      action: entry.action,
      outcome: entry.outcome,
    });
    if (error) throw error;
    return;
  }
  // Demo fallback: in-memory, visibly labeled adaptor.
  return recordDemoAudit(entry);
}

type AuditOutcome = "success" | "denied" | "error";

export async function listAudit(): Promise<Array<{
  action: string;
  actorId: string;
  actorRole: string;
  organizationId: string;
  patientId?: string;
  outcome: AuditOutcome;
  timestamp: string;
}>> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("audit_events")
      .select("*")
      .order("timestamp", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => ({
      action: String(row.action),
      actorId: String(row.actor_id),
      actorRole: String(row.actor_role),
      organizationId: String(row.organization_id),
      patientId: row.patient_id ? String(row.patient_id) : undefined,
      outcome: (row.outcome as AuditOutcome),
      timestamp: String(row.timestamp),
    }));
  }
  return listDemoAudit();
}
