# Deployment — NeurAI

This document prepares NeurAI for deployment. **Do not deploy or create any paid/cloud resources without explicit owner approval.** Until approval, the app runs in local demo mode (`DEMO_MODE=true`) with synthetic fixtures only.

## Stack
- Frontend: Next.js App Router + TypeScript → Vercel
- Backend (proposed, not provisioned): Supabase — Postgres + Auth + RLS + private object storage
- AI: Gemini + Grok server-side adapter (disabled until credentials/consent/region approved)

## Prerequisites
- Node.js 22 (used in development)
- npm
- A Vercel account/team/project (frontend)
- A Supabase account/project (backend, proposed default — not provisioned)
- AI provider credentials (GEMINI_API_KEY, GROK_API_KEY) — only after approval

## Install (clean clone)
```bash
git clone git@github.com:rehaan-ahmad/NeurAI.git
cd NeurAI
npm install
```

## Environment
Copy `.env.example` to `.env.local` (local) or set the same variables in your hosting provider (Vercel / Supabase). Never commit real values.

```bash
cp .env.example .env.local
```

Required variable names (placeholders only — never values):
- `DEMO_MODE` — `true` for local demo (default); `false` requires real backend config
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `GEMINI_API_KEY` (server-side only; AI disabled until approved)
- `GROK_API_KEY` (server-side only; AI disabled until approved)
- `NEXTAUTH_SECRET` (server-side only)

Startup throws actionable errors for missing required config when `DEMO_MODE=false`.

## Scripts
```bash
npm run dev        # dev server (Turbopack)
npm run build      # production build (Vercel-compatible)
npm run start      # production server
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # vitest
```

## Vercel frontend deployment (documented, not executed)
1. Do **not** create or deploy anything without explicit approval.
2. Push this repository to GitHub (done: `git@github.com:rehaan-ahmad/NeurAI.git`, branch `main`).
3. In Vercel: Add Project → Import this Git repo → Framework preset: Next.js.
4. Configure build command: `npm run build`; output: `.next`.
5. Add all required environment variables (see "Environment") as Vercel project secrets.
6. Set the production domain and enable TLS (Vercel manages this).
7. Configure auth callback URLs if using an identity provider (Supabase Auth / NextAuth).
8. Connect the Git repo to Vercel so pushes to `main` trigger preview deployments; merge to `main` deploys production (only after approval).

## Backend (Supabase) — proposed, not provisioned
1. Do **not** provision Supabase or add credentials without explicit approval.
2. Create a Supabase project in a region compatible with your data policy (India preferred for this user base).
3. Apply `src/server/persistence/rls.sql` (schema + row-level security + indexes) through the Supabase SQL editor, after legal/data-residency review.
4. Configure Supabase Auth (providers, MFA, invitations) per your org requirements.
5. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (service role key: server-side only).
6. Enable RLS and verify least-privilege rules (org-scoped reads/writes) with tests in `tests/persistence.test.ts`.
7. Configure private object storage for any media (only if retention is explicitly approved); never public URLs.
8. Set up backups/point-in-time recovery via Supabase platform; document the deletion process.

## AI provider (disabled until approved)
- AI calls are server-side only (`src/server/ai/adapter.ts`).
- No credentials are configured by default; the adapter returns a visible "AI unavailable" state.
- Enable only after provider, data-processing terms, region, retention, and consent approvals.

## Auth callbacks
If using NextAuth/Supabase Auth, configure the redirect/callback URLs in your identity provider to point at your Vercel production domain (e.g. `https://<your-domain>/api/auth/callback`). Do not use `localhost` in production.

## Backups, region, rollback
- Region: choose a Supabase region compatible with India data policy; document it.
- Backups: use Supabase platform backups + point-in-time recovery; verify restore process.
- Rollback: revert the Git commit and redeploy the previous Vercel deployment; database migrations are additive and reviewed before applying.

## Demo vs production
- Local default: `DEMO_MODE=true` → synthetic fixtures, visibly labeled, no real patient data.
- Production: `DEMO_MODE=false` requires Supabase provisioned, auth configured, region/consent/legal approved.
- No real patient data, recordings, or transcripts are stored by default.
- No diagnosis, risk score, or compliance claim is made by the code.

## Checklist before deploy (owner approval required)
- [ ] Vercel project created and linked to this Git repo
- [ ] All environment variables set (no real values in Git)
- [ ] Auth callback URLs configured
- [ ] Supabase provisioned (if backend approved) and RLS applied
- [ ] Region and data-residency review complete
- [ ] AI credentials and governance approved (or AI left disabled)
- [ ] Backup and rollback process documented and tested
- [ ] Explicit approval for deployment obtained

## For Claude Code / Antigravity / human operators
Run the local checks first:
```bash
npm install && npm run lint && npm run typecheck && npm test && npm run build
```
All must pass before any deployment step. Do not provision or deploy without explicit approval.