# Architecture — NeurAI

## Stack
- Frontend: Next.js App Router + TypeScript, hosted on Vercel.
- Backend (proposed, code-level only, not provisioned): Supabase — managed Postgres + Auth + row-level security (RLS) + private object storage.
- AI: server-side adapter supporting Gemini + Grok with automatic model switching based on requirement; browser never calls a provider directly.
- Styling: accessible typography/colors, muted purple/teal palette, Inter, responsive clinician app shell.

## Module boundaries
- `src/app/` — routes/layouts; server components by default; client components only for browser APIs (media/voice).
- `src/features/patients/`, `assessments/`, `results/`, `admin/` — UI and feature logic.
- `src/server/auth/`, `services/`, `repositories/`, `ai/`, `audit/` — server-only business logic.
- `src/lib/schemas/`, `types/`, `config/` — shared schemas/types/config (no secrets imported by client components).
- `tests/` — unit, integration, end-to-end.

## Persistence abstraction
- Persistence and AI behind typed interfaces; demo adapter (synthetic fixtures) used until Supabase is provisioned and approved. Demo adapter cannot be confused with production.
- Multi-tenant: every row scoped to organization/clinic; server-side org + patient scope checks on every read/write, enforced also by Supabase RLS.

## Auth
- Server-side authorization for every protected route, server action, API route, and data operation. Hiding a button is not authorization.
- No hard-coded mock user in production. Local dev auth emulator/demo mechanism only if explicitly configured.

## AI
- Server-side provider interface with input validation, output schema validation, timeout, rate limits, bounded payloads, safe errors, no sensitive logging.
- Record model/provider/version, uncertainty, and human-review state. No diagnosis, no composite score or recommendations unless a validated method defines them.
- Visible AI-unavailable state when credentials missing.

## Media
- Voice chat recording UI in a small client component; permissions requested only after explicit user action; stop all tracks; handle denial/interruption/cancel/upload failure.
- Do not retain or upload raw recordings unless approved. No raw audio/video in ordinary database documents; private object storage only if retention approved.

## Audit
- Append-only audit events for approved mutations; access-controlled; avoid duplicating sensitive payloads.

## Environment
- Strict environment validation at startup. `.env.example` with names and safe placeholders only; secrets server-side.
- Required variables (names only): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GROK_API_KEY`, `NEXTAUTH_SECRET` (or equivalent).

## Non-goals / blocked until approved
- No real patient data, no live AI calls, no Supabase provisioning, no compliance claims, no diagnosis/risk scoring.
