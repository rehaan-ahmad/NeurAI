# SESSION_CONTEXT.md — NeurAI

Single source of truth for cross-session handoff between OpenCode, Claude Code, and Antigravity.
**Rule:** update this file on every code change / slice completion. Keep it concise.

## Identity
- Project name: **NeurAI** (product was AI-MIND; fully rebranded to NeurAI, no AI-MIND branding left).
- Repo: `git@github.com:rehaan-ahmad/NeurAI.git` — `main` pushed to origin.
- Working dir: `/home/rehaan-ahmad/projects/NeurAI`
- Git state: clean. Last commit `e72c372 feat: domain types, validation, demo adaptor, and unit tests (Prompt 3)`. A concurrent commit `96edff0 Include project license details` was rebased in.
- Status: clean-slate greenfield build.

## Confirmed product decisions (all 17 answered)
1. Intended use: Hackathon Judges demo prototype. Screening workflow only; no diagnosis/risk/treatment claims.
2. Users/roles: clinicians + admin mainly; patients view-only own history/sessions/appointments. No patient record creation.
3. Jurisdiction: India (rural + urban). India best practices; no compliance claims until reviewed.
4. Tenancy: multiple clinics (multi-tenant). Org-scoped access.
5. Data/retention: India best practices; minimum necessary; synthetic dev fixtures; do not persist recordings unless approved.
9. Risk: no invented composite score/AI care advice unless validated method approved.
11-13: Supabase (Postgres + Auth + RLS + private storage), code-level only, not provisioned. AI: Gemini + Grok server-side adapter, auto model switching by requirement. Voice chat option. No browser-to-provider calls.
14/17: Public site, Vercel frontend. Rebrand AI-MIND -> NeurAI everywhere.
16: Build everything from scratch; clean repo.

## Context files
- `AGENTS.md` — guardrails (rebranded to NeurAI).
- `NeurAI Rebuild Kit.md` — product brief + 15 prompts + decision questions (renamed from AI-MIND Rebuild Kit.md).
- `SESSION_CONTEXT.md` — this file; update on every change.

## Docs (created)
- `docs/PRODUCT_DECISIONS.md` — confirmed answers vs assumptions.
- `docs/ARCHITECTURE.md` — Next.js App Router + Vercel + Supabase; Gemini/Grok adapter; voice chat; multi-tenant.

## Progress (kit prompts)
- Prompt 0 reconnaissance: complete (clean repo, no prior source).
- Prompt 1 decisions/architecture: complete (docs created).
- Prompt 2 foundation: complete — Next.js 16 + TS + Tailwind v4 + Inter, App Router `src/`, env validation (`src/lib/env.ts`), app shell (`src/components/shell.tsx`), loading/error/not-found states, `.env.example`, README, `.gitignore`. typecheck/lint/build all exit 0.
- Prompt 3 domain/demo boundary: complete — `src/types/domain.ts`, `src/lib/validation.ts` (dependency-free, throws ValidationError), `src/lib/repositories/index.ts` (interfaces), `src/lib/demo/adaptor.ts` (synthetic fixtures, `demo: true` markers, cross-org scope isolation), `tests/domain.test.ts` (12 passing), `vitest.config.ts` (@/ alias). typecheck/lint/test/build all exit 0.
- Prompt 4 auth & authorization: complete — `src/server/auth/session.ts` (demo-mode session + fail-closed production Supabase path, no credentials), `src/server/auth/authorize.ts` (server-side identity + role + org/patient scope checks, fail-closed), `src/server/auth/errors.ts` (Unauthorized/Forbidden), `src/app/protected/layout.tsx` (server auth before render), `src/app/protected/dashboard/page.tsx`, `src/app/unauthorized/page.tsx`, `src/app/forbidden/page.tsx`, root public landing. `tests/auth.test.ts` (7 role-boundary tests).
- Prompt 5 patient workflow: complete — `src/app/protected/patients/{list,create,[id]}/page.tsx` (searchable/filterable list, create with validation errors, detail/timeline), `src/server/actions/patients.ts` (server actions with authorize+validate+audit), `src/lib/audit.ts` (append-only audit, no raw payloads). `tests/patients.test.ts` (validation + scope isolation + audit).
- Prompt 6 assessment & consent: complete — `src/server/actions/assessments.ts` (create/update/complete with authorize+validate+audit, compositeAvailable false), `src/app/protected/assessments/{list,new,[id]}/page.tsx` (org-scoped list, patient selection + consent, session detail with cognitive observations), `src/components/assessment-form.tsx` + `src/components/assessment-starter.tsx` (client forms), `src/components/consent-disclosure.tsx` (placeholder policy), `tests/assessments.test.ts` (modality statuses, composite unavailable, scope isolation). 29 tests total passing. typecheck/lint/build exit 0.

- Prompt 9 results view: complete — `src/app/protected/results/{page,[patientId]/[assessmentId]/page}.tsx` (patient list + transparent per-assessment breakdown), `src/components/result-breakdown.tsx` (modality coverage, cognitive observations, provenance & limitations, "composite result unavailable" banner). Added to shell nav. typecheck/lint/build exit 0; 33 tests passing.

## Next step
Prompt 10 — Persistence and audit: Supabase adapter (Postgres + RLS + private storage), migrations/indexes, least-privilege rules, backup/deletion approach, append-only audit events; code-level only (not provisioned). Integration tests for access rules and audit coverage.

## Quality gate status (last run)
- typecheck: 0 | lint: 0 | test: 33 passed | build: 0
