# SESSION_CONTEXT.md — NeurAI

Single source of truth for cross-session handoff between OpenCode, Claude Code, and Antigravity.
**Rule:** update this file on every code change / slice completion. Keep it concise.

## Identity
- Project name: **NeurAI** (product was AI-MIND; fully rebranded to NeurAI, no AI-MIND branding left).
- Repo: `git@github.com:rehaan-ahmad/NeurAI.git` — `main` pushed to origin.
- Working dir: `/home/rehaan-ahmad/projects/NeurAI`
- Git state: clean. All 15 kit prompts implemented and committed.
- Status: pre-release demo prototype (not deployed, no backend provisioned, no credentials).

## Confirmed product decisions (all 17 answered)
1. Intended use: Hackathon Judges demo prototype. Screening workflow only; no diagnosis/risk/treatment claims.
2. Users/roles: clinicians + admin mainly; patients view-only own history/sessions/appointments. No patient record creation.
3. Jurisdiction: India (rural + urban). India best practices; no compliance claims until reviewed.
4. Tenancy: multiple clinics (multi-tenant). Org-scoped access.
5. Data/retention: India best practices; minimum necessary; synthetic dev fixtures; do not persist recordings unless approved.
9. Risk: no invented composite score/AI care advice unless validated method approved.
11-13: Supabase (Postgres + Auth + RLS + private storage), code-level only, not provisioned. AI: Gemini + Grok server-side adapter, auto model switching. Voice chat. No browser-to-provider calls.
14/17: Public site, Vercel frontend. Rebrand AI-MIND -> NeurAI everywhere.
16: Build everything from scratch; clean repo.

## Context files
- `AGENTS.md` — guardrails (rebranded to NeurAI).
- `NeurAI Rebuild Kit.md` — product brief + 15 prompts + decision questions.
- `SESSION_CONTEXT.md` — this file; update on every change.
- `NEXT_STEPS.md` — owner-facing next steps + decisions still required.

## Docs (created)
- `docs/PRODUCT_DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/SECURITY.md`, `docs/DATA_LIFECYCLE.md`, `CHANGELOG.md`, `README.md`.

## Progress (all 15 kit prompts complete)
- P0 reconnaissance: clean repo, no prior source.
- P1 decisions/architecture: docs created.
- P2 foundation: Next.js 16 + TS + Tailwind v4 + Inter, App Router `src/`, env validation, app shell, loading/error/not-found, `.env.example`, README, `.gitignore`.
- P3 domain/demo boundary: `src/types/domain.ts`, `src/lib/validation.ts`, `src/lib/repositories/index.ts`, `src/lib/demo/adaptor.ts` (`demo: true` markers), vitest, 12 tests.
- P4 auth & authorization: server session (demo + fail-closed Supabase), `authorize()` identity/role/org/patient scope, unauthorized/forbidden pages, 7 role tests.
- P5 patient workflow: list/create/detail, server actions + validate + audit, `src/lib/audit.ts`, 5 tests.
- P6 assessment & consent: create/update/complete, consent disclosure, modality statuses (missing/not-performed/unavailable/completed), `compositeAvailable: false`, 5 tests.
- P7 speech capture: local-only demo, no upload/storage/transcription, explicit warning, media lifecycle, 2 tests.
- P8 gait capture: local-only demo, protocol doc, no inference, no persistence, media lifecycle, 2 tests.
- P9 results view: transparent breakdown, modality coverage, "composite result unavailable," accessible tables.
- P10 persistence & audit: Supabase client factory (fail-closed), Supabase repos, `rls.sql` (not applied), append-only audit, repo factory, `tests/persistence.test.ts`.
- P11 AI provider integration: Gemini + Grok server-side adapter, auto model switching, timeout/rate limits/bounded payloads/safe errors, provenance/uncertainty/review state, AI-unavailable state, mocked-provider/failure/timeout tests.
- P12 admin & operations: `requireAdmin`, admin page, health/readiness endpoint, planned-features labeling, admin tests.
- P13 security/privacy/accessibility/quality review: protected unguarded results routes, prod npm audit = 0 vulns.
- P14 deployment prep: `docs/DEPLOYMENT.md` (documented, not executed).
- P15 release handoff: README, SECURITY, DATA_LIFECYCLE, CHANGELOG, DEPLOYMENT complete.

## Quality gate status (last run)
- typecheck: 0 | lint: 0 (1 harmless warning in src/app/error.tsx) | test: 44 passed | build: 0
- `npm audit --production`: 0 vulnerabilities

## Next step (owner-facing)
See `NEXT_STEPS.md`. Decisions still required: backend (Supabase provision vs demo-only), AI credentials/governance, region/data residency, compliance owner, deploy approval. Nothing is deployed or provisioned until you approve.
