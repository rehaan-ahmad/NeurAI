# SESSION_CONTEXT.md — NeurAI

This file is the single source of truth for cross-session handoff between OpenCode, Claude Code, and Antigravity.
**Rule:** update this file on every code change / slice completion. Keep it concise.

## Identity
- Project name: **NeurAI** (product was AI-MIND; fully rebranded to NeurAI, no AI-MIND branding left).
- Repo: `git@github.com:rehaan-ahmad/NeurAI.git`
- Working dir: `/home/rehaan-ahmad/projects/NeurAI`
- Status: clean-slate greenfield. `AGENTS.md`, `AI-MIND Rebuild Kit.md` (to be renamed), `SESSION_CONTEXT.md`. Git initialized, `main` pushed to origin.

## Confirmed product decisions (all 17 answered)
1. Intended use: prototype for Hackathon Judges demo. Screening workflow only; no diagnosis/risk/treatment claims.
2. Users/roles: clinicians + admin mainly; patients can view their own history, sessions, appointments (view-only self-service). No patient creation of records.
3. Jurisdiction: India (rural + urban). Follow India best practices; no compliance claims until reviewed.
4. Tenancy: multiple clinics (multi-tenant). One org default is superseded by multi-clinic.
5. Data/retention: India best practices; minimum necessary; synthetic dev fixtures; do not persist recordings unless approved.
9. Risk: best applicable choice; no invented composite score or AI care advice unless validated method approved.
11-13: Supabase fully configured (Postgres + Auth + RLS + private storage), code-level only (not provisioned). AI: Gemini + Grok, automatic model switching based on requirement. Voice chat option included. Server-side AI adapter only.
14/17: Public site (not private preview). Vercel frontend. Rebrand AI-MIND -> NeurAI everywhere; leave nothing.
16: Build everything from scratch; clean repo; no prior source.

## Context files
- `AGENTS.md` — project guardrails (rebranded to NeurAI).
- `NeurAI Rebuild Kit.md` — product brief + 15-prompt sequence + decision questions (renamed from AI-MIND Rebuild Kit.md).
- `SESSION_CONTEXT.md` — this file; update on every change.

## Docs (created)
- `docs/PRODUCT_DECISIONS.md` — confirmed answers vs assumptions.
- `docs/ARCHITECTURE.md` — Next.js App Router + Vercel + Supabase; Gemini/Grok adapter; voice chat; multi-tenant.

## Last change
Committed rebrand + docs + Prompt 2 foundation (Next.js 16 + TS + Tailwind, Inter, env validation, app shell, loading/error/not-found, .env.example, README, .gitignore). typecheck/lint/build all pass (exit 0). Pushed to origin main. Next: Prompt 3 (domain types, validation, demo boundary).
