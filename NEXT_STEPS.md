# Next steps — NeurAI

All 15 prompts from the `NeurAI Rebuild Kit.md` are implemented and the quality gate passes
(`lint`, `typecheck`, `test`, `build` all exit 0; 44 tests passing). The repo is on GitHub at
`git@github.com:rehaan-ahmad/NeurAI.git` (branch `main`).

This document tells you, the owner, what remains and **how** to do each step. Nothing is deployed
and no paid/cloud resources have been created.

## Where things stand
Status: pre-release demo prototype.
- Runs locally in **demo mode** (`DEMO_MODE=true`) with synthetic data and a visible banner.
- Not a diagnostic system; no diagnosis, risk score, or treatment advice.
- No real patient data, no live AI calls, no backend provisioned.
- Backend (Supabase) and AI (Gemini + Grok) are code-configured but **not provisioned** and no
  credentials have been added.

## Step 1 — Review the code (you, now)
**How:** Browse the repository. Key entry points:
- `src/app/page.tsx` — public landing
- `src/app/protected/layout.tsx` — server auth guard for all `/protected/*` routes
- `src/app/protected/dashboard/page.tsx` — clinician dashboard
- `src/app/protected/patients/` — patient list/create/detail
- `src/app/protected/assessments/` — assessment create/detail
- `src/app/protected/results/` — transparent results ("composite result unavailable")
- `src/app/protected/speech/page.tsx` — local-only speech capture demo
- `src/app/protected/gait/page.tsx` — local-only gait capture demo
- `src/app/admin/page.tsx` — admin audit log + planned features
- `src/app/api/health/route.ts` — readiness endpoint
- `src/server/auth/authorize.ts` — server-side identity/role/org scope checks
- `src/server/ai/adapter.ts` — server-side AI adapter (disabled until credentials)
- `docs/PRODUCT_DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/DATA_LIFECYCLE.md`, `docs/DEPLOYMENT.md`

## Step 2 — Run the local quality gate (you, now)
**How:**
```bash
cd /home/rehaan-ahmad/projects/NeurAI
npm install
npm run lint
npm run typecheck
npm test
npm run build
```
All must pass. They do as of the last commit. If any fail after your changes, fix before proceeding.

## Step 3 — Decide: stay demo, or move toward production (decision needed)
The app is deliberately demo-only. To go further you must decide and approve:
- **Backend:** Provision Supabase (Postgres + Auth + RLS + private storage), or keep demo-only.
  - Recommended region: one compatible with India data policy (your user base).
  - Apply `src/server/persistence/rls.sql` only after legal/data-residency review.
- **AI:** Provide `GEMINI_API_KEY` and/or `GROK_API_KEY` and approve governance, or leave AI disabled
  (it already shows a visible "AI unavailable" state).
- **Auth/identity:** Real provider auth required before production (demo auth is synthetic).
- **Compliance:** HIPAA/GDPR/local health-data rules are **not claimed**. You own the compliance review.
- **Deployment:** Vercel frontend + Supabase backend. See `docs/DEPLOYMENT.md`.

**How:** Tell me (the coding agent) your decisions in shorthand, e.g.:
```
1) Backend: Supabase (provision it) / keep demo-only
2) AI: enable Gemini+Grok with keys / keep disabled
3) Region: <your region>
4) Compliance owner: <name>
5) Deploy to Vercel: yes / not yet
```

## Step 4 — Provide secrets (only if you approved Step 3)
**How:** Never send secret values to me. Add them yourself:
- Locally: `cp .env.example .env.local` and fill in values (never commit `.env.local`).
- On Vercel: add the same variable names as project environment variables.
- On Supabase: configure in the Supabase dashboard.
Required names (never values): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GROK_API_KEY`, `NEXTAUTH_SECRET`.

## Step 5 — Deploy (only after Steps 3–4 and explicit approval)
**How:** I will not deploy or create paid resources without your explicit approval.
1. Connect this Git repo to Vercel (Import project → this repo → Next.js preset).
2. Set environment variables in Vercel (see `docs/DEPLOYMENT.md`).
3. Configure auth callback URLs to your Vercel domain.
4. Push to `main` → Vercel deploys production (only after your approval).
5. Rollback: revert the Git commit and redeploy the previous Vercel deployment.

## Step 6 — Clinical / privacy go-or-no-go (decision needed)
Before processing any real patient data:
- Confirm jurisdiction (India rural/urban) and applicable health-data rules.
- Name a compliance owner.
- Define retention/deletion/export rules.
- Confirm no raw audio/video retention unless explicitly approved.
- Review that no diagnosis/risk claims are made in the UI.

## Decisions still required (tell me when ready)
1. Backend: Supabase (provision) vs keep demo-only?
2. AI: Gemini + Grok credentials/governance vs keep disabled?
3. Region & data residency for India user base?
4. Compliance owner named?
5. Approve deployment to Vercel?

**Nothing is deployed and nothing is provisioned until you tell me to.** When you're ready, give me
the decisions above and I'll wire up the backend/AI and prepare for deployment (still without
deploying until you give final deploy approval).

## Unlocking Demo Restrictions

The app runs in demo mode by default (`DEMO_MODE=true`). To unlock the full functionality locally:

1. **Create/modify a local `.env` file** at the repository root (it is ignored by Git) and add:
   ```dotenv
   DEMO_MODE=false
   ```
2. **Restart the development server** (`npm run dev` or `yarn dev`).
   - The `validateEnv()` function will now treat `demo` as `false`.
   - Required environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.) will be validated.
   - The synthetic demo repositories will be replaced by the real Supabase‑backed ones.

*Optional*: If you prefer the code to be opt‑in for demo mode, change the default flag in `src/lib/env.ts`:

```diff
- const demo = process.env.DEMO_MODE !== "false";
+ const demo = process.env.DEMO_MODE === "true";
```

This makes demo mode only active when `DEMO_MODE=true` is explicitly set.

After applying either approach, the UI banner disappears and the application behaves as the production‑ready version (subject to provisioned back‑end services).

