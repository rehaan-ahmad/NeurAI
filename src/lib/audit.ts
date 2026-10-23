// Audit recording — Neurai
//
// Append-only audit metadata for approved mutations. Demo mode keeps an
// in-memory store; production wires to Supabase. No raw payloads are stored.

import type { AuditMetadata } from "@/types/domain";

const auditLog: AuditMetadata[] = [];

export function recordAudit(entry: Omit<AuditMetadata, "timestamp">): AuditMetadata {
  const record: AuditMetadata = { ...entry, timestamp: new Date().toISOString() };
  auditLog.push(record);
  return record;
}

export function listAudit(): AuditMetadata[] {
  return [...auditLog].reverse();
}

export function clearAuditForDemo() {
  auditLog.length = 0;
}
