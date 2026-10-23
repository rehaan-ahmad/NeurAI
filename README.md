# NeurAI

Clinician-facing dementia **screening and workflow-support** web application.

> **Not a diagnostic system.** NeurAI does not diagnose dementia, detect disease, predict individual outcomes, or recommend treatment. It records screening signals (cognitive tests, optional speech/gait capture) and presents them transparently for professional review. No dementia probability, risk score, or care recommendation is ever generated.

## What this is
A clean-slate rebuild of a clinician workflow for documenting patient history and assessment signals. Built to be shown to Hackathon Judges as a working prototype. Intended users are clinicians and admins; patients can view (read-only) their own history, sessions, and appointments.

## Current status
Pre-release demo prototype. Runs in **demo mode by default** with synthetic data and a visible "Demo mode — synthetic data" banner. No real patient data, no live AI calls, no production backend provisioned.

## Features (implemented)
- Clinician authentication & server-side authorization (role + organization scope)
- Multi-tenant: multiple clinics, each isolated
- Patient profiles: create, list (searchable/filterable), detail/timeline
- Assessment sessions: cognitive observations, consent disclosures, timestamps, clinician notes
- Modality status transparency: missing / not-performed / unavailable / completed
- Speech capture (local-only demo): permission on explicit action, timer, track stop, no upload/storage
- Gait capture (local-only demo): camera protocol, consent, preview/discard, no clinical inference
- Results view: recorded observations only, provenance, clinician review status, "composite result unavailable — not validated"
- Admin area: audit log, health/readiness endpoint, planned-features labeling (no dead buttons)
- Append-only audit events (no raw payloads)
- Accessible UI: keyboard-operable, visible focus, semantic HTML, WCAG 2.2 AA target, English

## Features (planned / not shipped)
- Production Supabase backend (Postgres + Auth + RLS + private storage) — code-configured, not provisioned
- Gemini + Grok AI providers (server-side, disabled until credentials/governance approved)
- User invitations, role changes, organization management
- Real patient data import/migration

## Not a diagnostic system
NeurAI makes **no** diagnosis, **no** validated detection claim, **no** clinical efficacy claim, **no** treatment advice, and **no** compliance certification (HIPAA/GDPR/etc. are not claimed from code alone). Outputs are screening indicators requiring professional review.

## Tech stack
- Next.js 16 + TypeScript + Tailwind v4 (App Router)
- React 19, Inter typography
- Vercel (frontend target)
- Supabase (proposed backend: Postgres + Auth + RLS + private storage — code-level only)
- Gemini + Grok (AI, server-side, disabled until approved)

## Quick start
```bash
# Clone
git clone git@github.com:rehaan-ahmad/NeurAI.git
cd NeurAI

# Install
npm install

# Configure environment (placeholders only — never commit real values)
cp .env.example .env.local

# Run (demo mode by default)
npm run dev
```

Open `http://localhost:3000`. The app runs in demo mode with synthetic data. A banner marks it "Demo mode — synthetic data — not production."

## Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build (Vercel-compatible) |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript typecheck |
| `npm run test` | vitest unit tests |

## Environment variables
Variable names only — placeholders in `.env.example`; real values never committed.

| Variable | Purpose |
|----------|---------|
| `DEMO_MODE` | `true` = local demo (default); `false` requires real backend config |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (server + client) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-side only) |
| `GEMINI_API_KEY` | Gemini (server-side only; AI disabled until approved) |
| `GROK_API_KEY` | Grok (server-side only; AI disabled until approved) |
| `NEXTAUTH_SECRET` | Auth secret (server-side only) |

Missing required config throws an actionable error at startup when `DEMO_MODE=false`.

## Clinical & privacy limitations
- No real patient data, recordings, or transcripts stored by default.
- No HIPAA/GDPR/compliance claims from code alone.
- AI is server-side only and disabled until provider, consent, region, and retention approvals.
- Not validated for clinical use; outputs require professional review.

## Deployment
Frontend targets Vercel. Backend (Supabase) is proposed and code-configured but **not provisioned**. See `docs/DEPLOYMENT.md` for exact steps. **Do not deploy or create paid resources without explicit owner approval.**

## Repository
`git@github.com:rehaan-ahmad/NeurAI.git` (branch `main`)

## License
This project is **UNLICENSED** — proprietary to Diya Sharma and Rehaan Ahmad. All rights reserved. No license is granted for use, modification, or distribution.
