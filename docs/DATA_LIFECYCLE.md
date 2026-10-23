# Data lifecycle — NeurAI

NeurAI collects only the minimum data necessary for the dementia-screening workflow. It is **not a diagnostic system** and does not store real patient data by default.

## Data minimization
- Fields collected are limited to those genuinely needed for the workflow: patient reference, age, gender, assessment session, cognitive test observations, consent metadata, and clinician notes.
- No realistic identifiable data is used; development fixtures are synthetic.
- Raw audio/video/transcripts are **not persisted by default**.
- Speech and gait capture are local-only demos: media is held in memory and not uploaded or stored.

## Retention
- No retention schedule is implemented in code; retention rules must be defined by the organization and approved before any production data is stored.
- Demo/synthetic data is ephemeral (in-memory adaptor) and does not persist across server restarts.

## Deletion
- Patient records support a server-side soft delete (audited) in the demo adaptor.
- Production deletion must follow the organization's approved retention/deletion policy and be audited.
- Audit events are append-only; deletion removes references but retains audit metadata (no raw payloads).

## Export
- No export function is implemented in this release. Data access is scoped to the authenticated user's organization and, for patients, their own records.

## Media
- Recordings, if capture is approved, are handled in-memory only and revoked after a short window. They are not written to disk or uploaded.
- Private object storage (never public URLs) with short-lived signed URLs would be required for any approved media retention.

## Limitations
- Code alone does not establish compliance with any data-protection law.
- Real patient data must not be introduced until compliance/legal review.
