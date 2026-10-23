# AGENTS.md — NeurAI

## Mission
Build NeurAI as a secure, clinician-facing **screening and workflow-support** web application for documenting patient history and assessment signals (cognitive tests, speech, gait, and optional MRI summaries). It is not a diagnostic system. Do not claim that it diagnoses dementia, detects disease, predicts an individual's outcome, or replaces a clinician. Treat any model output as experimental decision support that requires professional review.

## Product context
This is a clean-slate rebuild; the prior repository and README files are not available to the coding agent. This file and the accompanying rebuild kit define the complete context. NeurAI is intended as a clinician-facing dementia-screening workflow application with provider login and roles, patient onboarding/history, cognitive test observations, optional speech and gait capture, transparent results/review, longitudinal records, and limited admin operations. Historical implementation details are only background: the old prototype used mocked patients/auth, static or random AI responses, incomplete gait submission, and placeholder admin tools. Do not depend on old source code or claim the prototype validated any feature. The default frontend deployment target is Vercel. Backend provider is not confirmed; Supabase is a proposed practical default, with Firebase as an alternative. Do not provision backend services without approval.

## First principles
1. Before implementation, inspect this file, `README.md`, package scripts, repository structure, existing tests, deployment config, and git status. Preserve unrelated user changes. Do not assume an empty repository or overwrite working code.
2. Use the repository's existing framework and conventions when sound. If greenfield, prefer a currently supported Next.js App Router + TypeScript stack, accessible component system, schema validation, and a deployment target selected with the user. Pin compatible versions and document prerequisites.
3. Keep domain logic and persistence behind typed interfaces. Separate demo fixtures from production services. A demo mode must be explicit, visibly labeled, and never silently become production fallback.
4. Use server-side authorization for every protected page, server action, API route, and data operation. Hiding a button or navigation item is not authorization.
5. Validate all untrusted input at boundaries. Use typed schemas and safe error responses. Keep secrets server-only; never expose keys or privileged database credentials in client bundles.
6. Minimize sensitive health information. Collect only necessary data, use synthetic data in development, and avoid logging patient names, identifiers, recordings, transcripts, or clinical payloads. Do not store raw audio/video by default; obtain explicit product/security approval before implementing retention.
7. Add audit events for meaningful access and mutations where production persistence is enabled. Audit records should be append-only, access-controlled, and avoid duplicating sensitive payloads.
8. Any AI analysis must have a documented purpose, inputs, limitations, provenance/model version, uncertainty, and human-review state. No invented clinical thresholds or fake risk percentages. Fail closed and show unavailable/insufficient-data states rather than fabricating outputs.
9. Ensure accessible, responsive clinical UI: keyboard operation, visible focus, semantic HTML, adequate contrast, clear permission and error states, and no color-only risk communication. Account for reduced motion.
10. No direct writes from a browser to privileged collections. Avoid unsafe admin database browsers, destructive bulk actions, or unaudited data export.

## Clinical and privacy guardrails
- Describe outputs as screening indicators or research/demo signals, not diagnoses. Do not provide treatment instructions or imply a clinical recommendation has been validated.
- Do not infer a risk score from arbitrary LLM prose. If a validated, approved scoring method is not supplied, show component observations and explicitly mark overall risk calculation as unavailable/not validated.
- Do not send identifiable patient data or recordings to an external model provider unless the user has approved the provider, data-processing terms, region, retention, and required consent/legal basis. Keep AI integration behind a server-side provider interface and make local/demo mode possible.
- Never assert HIPAA, GDPR, or other compliance from code alone. Compliance depends on operational controls, contracts, deployment configuration, and jurisdiction-specific review. Do not claim certification.
- Provide clear consent, purpose, retention, and deletion UX for recording features once product/legal requirements are known. Permission-denied, interrupted, unsupported codec, and upload-failure states must be handled.

## Suggested architecture boundaries
Use feature-oriented modules with explicit boundaries, for example:
- `src/app/` — routes/layouts; server components by default.
- `src/features/patients/`, `assessments/`, `results/`, `admin/` — UI and feature logic.
- `src/server/auth/`, `services/`, `repositories/`, `ai/`, `audit/` — server-only business logic.
- `src/lib/schemas/`, `types/`, `config/` — shared schemas/types/config (no secret-bearing modules imported by client components).
- `tests/` — unit, integration, and end-to-end coverage.

These are guidelines, not a mandate to churn an existing structure. Use server components by default; mark browser-API features as client components. Keep recording controls isolated and stop media tracks on completion/unmount. Do not place large media payloads in ordinary database documents; use a reviewed private object-storage strategy if retention is approved.

## Security requirements
- Use a real authentication provider for production. Enforce least-privilege roles on the server; define and test provider/admin permissions. Never ship a hard-coded mock user as production auth.
- Set secure session/cookie options and CSRF protections appropriate to the chosen auth mechanism. Add rate limits and abuse controls to expensive/model endpoints.
- Apply restrictive security headers, safe redirects, output escaping, and strict server-side validation. Do not trust client-supplied roles, assessment scores, patient ownership, or storage paths.
- Provide environment variable validation at startup. Commit `.env.example` with names and safe placeholders only; ignore `.env*` except the example. Rotate exposed secrets.
- Define database access rules, indexes, backup/restore and deletion processes for the chosen store. Test authorization rules rather than assuming them.
- Never put sensitive health data in analytics, error monitoring, URLs, client logs, or fixtures.

## Implementation workflow
1. Confirm product decisions that affect data handling, auth, AI, and hosting. If answers are not yet available, implement only safe, clearly labeled demo scaffolding and document assumptions.
2. Write/maintain a concise implementation plan and acceptance criteria before large changes. Work in small vertical slices.
3. For each slice: implement, test, run lint/typecheck/build, inspect changed files and diff, then summarize risks and remaining work.
4. Prefer maintained dependencies. Avoid adding packages without need; explain major architectural choices.
5. Include loading, empty, error, permission-denied, unavailable, and success states. No dead buttons or fake live status.
6. Update README and deployment docs whenever commands, env vars, schema, or hosting change.
7. Never deploy, migrate, delete data, create paid resources, or publish publicly without explicit user approval for that action. Make deployment repeatable and reversible where possible.

## Quality gates
Before claiming completion, run the available equivalents of:
- package install using the repository lockfile;
- formatter/linter;
- TypeScript typecheck;
- unit and integration tests;
- production build;
- end-to-end smoke tests for login, patient creation/list/detail, assessment workflow, result state, role boundaries, and error states where implemented.

Do not suppress errors just to pass checks. Report unavailable checks and genuine failures. Tests must not use real patient data or production credentials.

## Deployment expectations
Make deployment straightforward for Claude Code, Antigravity, and a human developer. Target Vercel for the frontend unless the owner changes this decision. For backend, propose Supabase (managed Postgres, Auth, RLS, private storage) as the simplest default to evaluate; Firebase is a reasonable alternative if the owner prefers Google Cloud. Do not assume the provider has been approved or create resources:
- Include a clear README with exact prerequisites and commands for install, dev, lint, typecheck, test, build, and start.
- Include `.env.example`, validated config, health/readiness endpoint if appropriate, and documented required external services.
- Document Vercel frontend deployment and the approved backend path; if backend is still undecided, document Supabase and Firebase trade-offs and keep real persistence disabled.
- Keep build/start commands standard and avoid requiring an agent-specific runtime. Provide Docker only if it improves the agreed hosting path.
- Explain storage, auth, model-provider setup, migrations/rules, secrets, domain/TLS, backups, and rollback. Never claim deployability until a clean production build and the documented path have been checked.

## Completion summary format
State: what changed; user-visible routes/features; architecture and assumptions; commands/checks with pass/fail; environment variables/services; deployment steps; known limitations and clinical/privacy risks. Link files with absolute paths when delivering outside the repo.
