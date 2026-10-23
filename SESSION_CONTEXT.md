# SESSION_CONTEXT.md — NeurAI (formerly AI-MIND)

This file is the single source of truth for cross-session handoff between OpenCode, Claude Code, and Antigravity.
**Rule:** update this file on every code change / slice completion. Keep it concise.

## Identity
- Project name: **NeurAI** (product brief still refers to "AI-MIND"; do not claim diagnosis/clinical validity).
- Repo: `git@github.com:rehaan-ahmad/NeurAI.git`
- Working dir: `/home/rehaan-ahmad/projects/NeurAI`
- Status: clean-slate greenfield. Only `AGENTS.md` and `AI-MIND Rebuild Kit.md` exist. Not yet a git repo (initializing now).

## Product (from Rebuild Kit + AGENTS.md)
- Clinician-facing dementia **screening/workflow-support** web app. NOT a diagnostic system. No diagnosis, risk scores, treatment advice, or compliance claims.
- Default stack: Next.js App Router + TypeScript on Vercel. Backend: Supabase recommended to evaluate (Postgres + Auth + RLS + private storage); Firebase alternative. No backend provisioned yet.
- Demo-only until product decisions approved. Synthetic fixtures, visibly labeled demo mode, no real patient data, no live AI calls.

## Context files
- `AGENTS.md` — project guardrails (do not overwrite).
- `AI-MIND Rebuild Kit.md` — product brief + 15-prompt sequence + 17 decision questions.
- `SESSION_CONTEXT.md` — this file; update on every change.

## Blocking decisions (answers needed before real data/AI/backend)
See questions below. Until answered: demo defaults, no production persistence/AI.

## Last change
None yet (initial setup).
