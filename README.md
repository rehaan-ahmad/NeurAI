# NeurAI

Clinician-facing dementia **screening and workflow-support** web application. Not a diagnostic system. No diagnosis, risk scoring, or treatment advice.

## Stack
- Next.js App Router + TypeScript (Vercel)
- Supabase (Postgres + Auth + RLS + private storage) — code-configured, not provisioned
- Tailwind CSS, Inter

## Prerequisites
- Node.js 20+ (v22 used)
- npm

## Install
```bash
npm install
```

## Environment
Copy `.env.example` to `.env.local` and fill in values. Never commit real secrets.

```bash
cp .env.example .env.local
```

Required variable names (placeholders only, never values):
- `DEMO_MODE` — `true` for local demo (default); `false` requires real config
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`, `GROK_API_KEY` — AI disabled until approved
- `NEXTAUTH_SECRET`

Startup throws actionable errors for missing required config when `DEMO_MODE=false`.

## Scripts
```bash
npm run dev        # dev server (Turbopack)
npm run build      # production build
npm run start      # production server
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # vitest
```

## Demo mode
`DEMO_MODE=true` (default) runs with synthetic fixtures and a visible "Demo mode — synthetic data" banner. Demo mode is impossible to mistake for production and cannot be enabled accidentally in production (`DEMO_MODE=false` requires real config).

## Clinical / privacy limitations
- Not a diagnostic system. No dementia probability, risk score, or care recommendation.
- No real patient data, recordings, or transcripts stored by default.
- AI calls are server-side only and disabled until provider/consent/region approved.
- No HIPAA/GDPR/compliance claims from code alone.

## Deployment
Frontend targets Vercel. Backend: Supabase (proposed default) — do not provision or deploy without explicit approval. See `docs/ARCHITECTURE.md` and `docs/PRODUCT_DECISIONS.md`.

## Repo
`git@github.com:rehaan-ahmad/NeurAI.git`


## 📄 License

This project is **UNLICENSED** — proprietary to Diya Sharma and Rehaan Ahmad. All rights reserved.
