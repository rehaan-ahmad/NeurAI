# Changelog — NeurAI

## Unreleased
- Rebranded product from AI-MIND to NeurAI across the repository.
- All 17 product decisions documented in `docs/PRODUCT_DECISIONS.md`.
- Architecture documented in `docs/ARCHITECTURE.md`.

### Prompt 0 — Repository reconnaissance
- Confirmed clean-slate greenfield repository; no prior source/READMEs provided.

### Prompt 1 — Product decisions & architecture record
- Created `docs/PRODUCT_DECISIONS.md` and `docs/ARCHITECTURE.md`.
- Decisions: hackathon demo prototype; clinicians + admin + view-only patients; India; multi-tenant; Supabase backend (code-level, not provisioned); Gemini + Grok AI (server-side, not provisioned); voice chat; public site on Vercel; build from scratch.

### Prompt 2 — Foundation
- Next.js 16 + TypeScript + Tailwind v4 + Inter, App Router (`src/`).
- Muted purple/teal design system, accessible shell, loading/error/not-found states.
- Environment validation, `.env.example`, README, scripts (dev/build/start/lint/typecheck/test).
- `typecheck`/`lint`/`build` pass.

### Prompt 3 — Domain types, validation & demo boundary
- Typed domain schemas (users/roles, patients, clinical history, assessments, cognitive/speech/gait observations, provenance, consent, audit).
- Dependency-free validation (`ValidationError`) and synthetic demo adaptor with visible `demo: true` markers.
- Cross-organization scope isolation; 12 unit tests.

### Prompt 4 — Authentication & authorization
- Server-side session (demo-mode + fail-closed Supabase path, no credentials).
- Server-side identity/role/org/patient scope checks; `UnauthorizedError`/`ForbiddenError`.
- Protected routes: `/dashboard`, `/patients/*`, `/assessments/*`, `/speech`, `/gait`, `/results/*`, `/admin`.
- 7 role-boundary tests.

### Prompt 5 — Patient workflow
- Searchable/filterable patient list, create/edit, detail/timeline.
- Server actions with authorize + validate + audit; empty/loading/error states.
- Append-only audit (no raw payloads); 5 patient tests.

### Prompt 6 — Assessment workflow & consent
- Assessment create/update/complete; consent disclosures; cognitive observations.
- Modality statuses: missing / not-performed / unavailable / completed.
- No composite dementia risk; `compositeAvailable: false`.
- 5 assessment tests.

### Prompt 7 — Speech capture (local-only demo)
- Browser media in client component; permission after explicit user action; recording timer; stop all tracks; unsupported/denial handling.
- No upload/storage/transcription; explicit "not for clinical use" warning.
- 2 speech tests.

### Prompt 8 — Gait capture (local-only demo)
- Camera protocol documentation; explicit consent; preview/discard; track stop; permission/error handling.
- No clinical inference (no stride/cadence/speed/condition); no video persistence.
- 2 gait tests.

### Prompt 9 — Results view
- Transparent per-assessment breakdown; modality coverage; cognitive observations; provenance & limitations.
- "Composite result unavailable — not validated" banner; no risk score or care recommendation.
- Accessible tables with textual equivalents.

### Prompt 10 — Persistence & audit (code-level only)
- Supabase client factory (fail-closed), Supabase repository implementations, RLS schema (`rls.sql`, not applied), append-only audit, repo factory (Supabase when configured else demo).
- Integration tests for access rules/scope isolation/audit.

### Prompt 11 — AI provider integration (not enabled)
- Gemini + Grok server-side adapter with auto model switching; timeout, rate limits, bounded payloads, output validation, safe errors; provenance/uncertainty/review state.
- Mocked-provider, failure, and timeout tests; visible AI-unavailable state.
- Disabled until credentials/governance approved.

### Prompt 12 — Admin & operations
- Server-side admin authorization; audit log viewer; health/readiness endpoint; planned-features labeling (no dead buttons).
- Admin authorization tests.

### Prompt 13 — Security/privacy/accessibility/quality review
- Protected previously unguarded results routes; verified production npm audit = 0 vulnerabilities.
- `lint`/`typecheck`/`test`/`build` pass.

## Released
None yet. This is a pre-release, hackathon-demo prototype. Do not deploy to production or process real patient data without explicit owner approval and legal/compliance review.
