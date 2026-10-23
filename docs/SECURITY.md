# Security — NeurAI

NeurAI is a clinician-facing dementia **screening and workflow-support** application. It is **not a diagnostic system**. This document describes security design and practices; it is **not** a compliance certification (no HIPAA, GDPR, or medical-device claims are made from code alone).

## Threat model & guardrails
- Protect patient health information (PHI) and clinician identity.
- Enforce server-side authorization on every protected route, server action, and API route. Hiding a UI button is not authorization.
- Scope all data access to the authenticated user's organization (multi-tenant) and, for patients, to their own records.
- Never log patient names, identifiers, recordings, transcripts, or clinical payloads.
- Never send identifiable health data to an external AI provider unless consent, contracts, region, retention, and organizational approval are confirmed.

## Authentication & authorization
- Server-side auth for every protected route/mutation. Identity, role, and organization/patient scope are checked independently on the server.
- No hard-coded mock user in production. Demo mode (`DEMO_MODE=true`) is visibly labeled and uses synthetic fixtures; it cannot be enabled accidentally in production.
- Admin routes require the `admin` role.

## Secrets
- All secrets are server-side only: `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GROK_API_KEY`, `NEXTAUTH_SECRET`.
- `.env.example` lists variable names with safe placeholders only. Real values are never committed.
- Environment validation runs at startup and throws actionable errors for missing required config when `DEMO_MODE=false`.

## Data
- Minimum necessary data collection.
- Synthetic development fixtures only; no realistic identifiable data.
- Raw audio/video/recordings are not persisted by default.
- Media, if ever retained, goes to private object storage with short-lived access — never public URLs — and only with explicit retention approval.
- Audit events are append-only, access-controlled, and contain no raw payloads.

## AI
- AI is server-side only. The browser never calls a provider directly.
- Input validation, output schema validation, timeout, rate limits, bounded payloads, safe errors, no sensitive logging.
- No diagnosis, risk score, or care recommendation. Model/provider/version, uncertainty, and human-review state are recorded.
- Visible "AI unavailable" state when credentials are missing.

## Dependencies & vulnerabilities
- Production dependencies (`npm audit --production`): 0 known vulnerabilities at time of writing.
- Dev dependencies may report vulnerabilities; keep them updated and do not install dev deps in production.

## Security review checklist
- [ ] No client-exposed secrets
- [ ] No unguarded routes/actions
- [ ] Patient scope enforced server-side on every read/write
- [ ] No PHI in logs, URLs, fixtures, or error messages
- [ ] Database RLS is least-privilege and org-scoped
- [ ] No raw media retention by default
- [ ] No fabricated clinical claims
- [ ] Demo mode visibly labeled, synthetic, not production
- [ ] Accessible, keyboard-operable controls
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all pass

## Limitations
- Code alone does not establish HIPAA, GDPR, or other compliance.
- A real clinical deployment requires expert review, validated methods, governance, contracts, and jurisdiction-specific controls.
