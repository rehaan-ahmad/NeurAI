# AI-MIND Rebuild Kit

This kit is self-contained: the coding agent does **not** need the old repository, its README files, or the original context document. It is written for Claude Code or Antigravity working in a new repository. Copy `AGENTS.md` and this kit into the new repository root, then use the prompts in order. The prompts explicitly restate the product context so the agent does not rely on inaccessible prior documentation. Do not ask an agent to implement all features in one mega-prompt.

## Standalone product brief (the agent should use this, not old READMEs)
Build **AI-MIND**, a modern clinician-facing web application that supports a dementia-screening workflow. The intended features are clinician authentication; patient profiles and clinical history; cognitive test observations; optional speech and gait assessment capture; a transparent results/review screen; patient assessment history; and a limited admin/operations area. The application may later connect to AI services for speech/gait observations, but no validated algorithm, clinical evidence, data-processing approval, or production backend has been specified. Therefore, treat the project as a demo/research prototype unless the owner confirms otherwise. Never claim diagnosis, validated detection, clinical efficacy, regulatory approval, or compliance. Never invent risk scores or recommendations.

The prior implementation used Next.js/TypeScript, Firebase/Firestore, Genkit/Gemini, and a muted purple/teal, accessible healthcare-oriented design. It was a prototype: auth and patient records were mocked, AI results could be static/random, gait upload/analysis was incomplete, and admin functions were mostly placeholders. This is useful product history only—not a dependency, source repo, README, migration plan, or proof of clinical validity. Recreate from scratch and improve the product, architecture, and quality. Preserve a clean distinction between synthetic demo and production data.

## Recommended rebuild stance
Start with a polished, deployable clinician workflow using **synthetic demo data only**, then connect approved production services after product decisions are answered. Use a provider abstraction for persistence and AI so that a demo adapter cannot be confused with production. Do not generate overall dementia probabilities or clinical recommendations unless you supply a validated and approved clinical method. The initial trustworthy result view can present recorded inputs, transparent descriptive measures, missing-data indicators, and a clear “not a diagnosis / not clinically validated” state.

### Recommended default architecture
Use **Next.js App Router + TypeScript on Vercel** for the web frontend and lightweight server routes. For the managed backend, the simplest default to evaluate is **Supabase**: managed Postgres, Auth, row-level security, and private object storage in one service. Use server-side access through a typed repository layer, enforce tenant/patient access with both server checks and database RLS, and keep service-role credentials server-only. Choose a project region compatible with the data policy. Do not store recordings unless explicitly approved. This is a practical starting point, not a claim that Supabase alone makes a clinical product compliant.

Alternatives: **Firebase** (Auth + Firestore + Storage) is appropriate if the owner already uses Google Cloud and prefers its ecosystem; carefully enforce Security Rules and data ownership. **Neon or managed Postgres + Clerk/Auth.js** gives more modularity but requires wiring multiple providers and operations. **Convex** can be quick for realtime app development but should be assessed against required data residency, access controls, audit, and governance. **Vercel Postgres is not the default recommendation**; Vercel's managed database offerings have changed over time, so choose a separately managed database provider and verify current Vercel integrations before implementation. For approved AI, call a provider from a server-side adapter (e.g. Gemini/Vertex AI or another approved API), never directly from the browser. External APIs must not receive identifiable health data until consent, contracts, retention, region, and organizational approval are confirmed.

Keep persistence and AI behind interfaces; use synthetic fixtures for the first build. Use current stable, mutually compatible versions rather than copying stale version pins. If the user has no backend preference, start with a local/demo adapter and design for Supabase, then only create/connect cloud services after they approve the provider, region, and account setup.

## Questions to answer before production
You asked for any/all questions. These are the decisions that materially change architecture, safety, scope, and deployment. You can answer in shorthand (e.g. `1) ... 2) ...`). Until answered, use the safe defaults in parentheses and keep sensitive/AI integrations in demo or disabled mode.

1. **Intended use:** Is this a student/demo/research prototype, internal clinician workflow tool, or a product intended for clinical care? What exact claims may the UI make? (Default: demo/research prototype; screening workflow only; no diagnosis or individual risk probability.)
2. **Users and roles:** Who uses it (clinicians, coordinators, admins, patients), and what can each role view/edit/export? Is patient self-service in scope? (Default: clinician and admin only; no patient login.)
3. **Jurisdiction and compliance:** Which countries/states will host and use it? Are HIPAA, GDPR, local health-data rules, institutional review, or medical-device obligations applicable? Who is the compliance owner? (Default: no compliance claims; no real patient data until reviewed.)
4. **Identity and tenancy:** Is it one organization or multiple clinics/tenants? Do you need SSO, MFA, invitations, or a specific identity provider? (Default: one organization; real provider auth required before production.)
5. **Data & persistence:** Which fields are genuinely needed? What retention/deletion/export rules apply? May the app store raw audio/video, transcripts, derived features, or only final clinician-entered summaries? (Default: minimum necessary; synthetic development fixtures; do not persist recordings.)
6. **Speech model:** Which languages and standardized speech tasks? Do you have a validated model or a model provider with approved processing terms and data region? Can identifiable audio leave your environment? (Default: recording UI may be prototyped locally; external AI disabled.)
7. **Gait measurement:** What recording protocol, camera setup, distance/calibration, and clinically validated method should be used? Is video capture truly required? (Default: document protocol and show capture workflow only; no clinical inference.)
8. **Cognitive tests:** Which instruments are licensed/authorized for digital use, and who enters/scores them? (Default: generic configurable score fields; no copied protected test content.)
9. **Risk and recommendations:** Do you have an approved scoring algorithm, validation evidence, thresholds, and clinician governance? (Default: no composite risk score or AI-generated care advice.)
10. **Admin/audit:** Which admin actions are needed? What must be recorded, who can inspect logs, and how long are logs retained? (Default: least privilege; append-only audit metadata for production mutations; no raw payloads.)
11. **Deployment:** Frontend is confirmed for Vercel. Is this a private preview or public demo, and do you have a Vercel team/project/domain? (Default: Vercel, private preview until approved.)
12. **Backend:** Shall we use Supabase (recommended default: Postgres + Auth + RLS + private storage) or Firebase (Auth + Firestore + Storage), or do you have another provider/account? (Default: code against a repository interface and use demo fixtures until provider/region is confirmed; no real data.)
13. **AI provider and cost controls:** Gemini/Vertex AI, another provider, or no hosted AI? Do you have keys/project access, budget caps, logging/retention requirements? (Default: no live AI call; server-only adapter with rate limits and usage visibility.)
14. **Design and scope:** Keep muted purple/teal and Inter, or do you have brand assets? Which first-release screens are mandatory? (Default: preserve palette, improve accessibility; dashboard, patient list/create/detail, assessment shell, results, admin status.)
15. **Languages/accessibility:** Which UI languages and accessibility target? (Default: English; WCAG 2.2 AA target.)
16. **Starting point:** Confirm this is a clean repository with no prior READMEs/source code provided to the agent. Are there logos/design assets to supply? (Default: clean build; use this kit as the complete product context; no patient data migration.)
17. **Release target:** Is a public demo acceptable, or must access be restricted? What domain, email sender, monitoring and backup requirements exist? (Default: restricted/private preview; no public PHI.)

## Prompt sequence
Run one prompt at a time in Claude Code or Antigravity. After each, review the diff and checks before continuing. Ask the coding agent to stop and list blockers rather than inventing clinical, legal, or deployment assumptions.

### Prompt 0 — Repository reconnaissance and plan
```text
Read AGENTS.md and this rebuild kit fully; this kit is the complete product context. The old repository and README files are intentionally not provided and must not be required. Inspect the new repository, git status, package scripts, tests, and deployment configuration. Do not edit files yet. Treat the project as greenfield unless files already exist. Summarize the state, propose a phased plan and acceptance criteria, and list decisions blocking real patient data or AI. Assume Vercel for frontend hosting; recommend Supabase as default backend for owner approval, but do not provision services or add credentials. Do not invent clinical/legal assumptions. Preserve existing user changes.
```

### Prompt 1 — Product decisions and architecture record
```text
Using only AGENTS.md and the standalone product brief in this rebuild kit (no old repository READMEs are available), create docs/PRODUCT_DECISIONS.md and docs/ARCHITECTURE.md. Record confirmed answers separately from assumptions. Include Vercel frontend deployment and a Supabase-vs-Firebase backend decision, with Supabase as a proposed default rather than silently committed choice. Cover intended use, roles, data lifecycle, demo-vs-production boundary, auth, database, media retention, AI provider, audit, region, deployment, and non-goals. If unanswered, use demo-only defaults and mark production integrations blocked. Do not provision services or claim compliance/clinical validation.
```

### Prompt 2 — Foundation, configuration, and design system
```text
Create a clean, production-quality Next.js App Router + TypeScript foundation suitable for Vercel. Add accessible typography/colors/components, responsive clinician app shell, route-level loading/error/not-found states, strict environment validation, .env.example with placeholders, and scripts for dev/lint/typecheck/test/build/start. Add a README that is complete without any old documentation. Do not set up or deploy Vercel/backend projects; no mock login bypass in production, no patient data, and no AI calls. Run checks and report them.
```

### Prompt 3 — Domain types, validation, and demo boundary
```text
Implement typed domain schemas for users/roles, patient profiles, clinical history, assessment sessions, cognitive test observations, speech observations, gait observations, result provenance, consent metadata, and audit metadata based on confirmed decisions. Add a clearly named synthetic demo fixture/adaptor and a service/repository interface. Do not use realistic identifiable data, random risk scores, or fabricate outputs. Add schema/unit tests and ensure demo mode is visibly labeled and impossible to mistake for production. Document fields and data minimization.
```

### Prompt 4 — Authentication and authorization
```text
Implement the confirmed authentication provider and server-side authorization. Every protected route and mutation must independently check identity, role, and patient/organization scope on the server. Add unauthorized/forbidden states and tests for role boundaries. Use only a local development auth emulator/demo mechanism if explicitly configured; never silently accept a fixed user in production. Document setup and security assumptions. Do not add real user administration unless confirmed.
```

### Prompt 5 — Patient workflow
```text
Implement the clinician dashboard, searchable/filterable patient list, patient creation/edit flow, and patient detail/timeline using the domain schemas and repository interface. Use server-side authorization and validation; include empty/loading/error states, accessible forms, confirmation for destructive actions, and audit events for approved mutations. Use synthetic fixtures only until a production data store is configured. No fake patient records in production. Add tests for validation, scope isolation, and main user journey.
```

### Prompt 6 — Assessment workflow and consent
```text
Implement the assessment-session workflow: instructions, consent/purpose/retention disclosure placeholders sourced from confirmed policy, cognitive observations, assessment status, timestamps, and clinician notes. Clearly distinguish missing, not performed, unavailable, and completed data. Do not reproduce protected test content without authorization. Do not calculate an overall dementia risk. Add tests and keyboard/screen-reader-friendly flows.
```

### Prompt 7 — Speech capture (only after approval)
```text
Implement speech recording only as permitted by PRODUCT_DECISIONS.md. Keep browser media access in a small client component; request permissions only after explicit user action; show recording state/timer; stop all tracks; handle unsupported browser, denial, interruption, cancel, and upload failure. Do not retain or upload raw recordings unless approved. Any analysis must go through a server-only provider interface, record provenance/model version and uncertainty, and be labeled non-diagnostic. If provider/consent/retention approvals are absent, implement a local-only demo capture with no upload and an explicit warning. Test lifecycle and failure states; never log audio or transcripts.
```

### Prompt 8 — Gait capture (only after approval)
```text
Implement the gait capture workflow only to the approved protocol. Explain camera position, distance, lighting, task and safety instructions; obtain explicit recording action/consent; show preview and discard controls; stop camera tracks; handle permission/errors on mobile and desktop. Do not infer stride, cadence, gait speed, or neurological condition from video unless a specified validated method and measurement setup are approved. No raw video persistence or external upload without approval. Test media lifecycle and failure states.
```

### Prompt 9 — Results and transparent interpretation
```text
Build a results view that reports only actual recorded observations and outputs available from approved methods. Show data sources, timestamps, missing modalities, model/method version, uncertainty, clinician review status, and limitations. Do not create arbitrary percentages, thresholds, causal contribution charts, or care recommendations. If no validated scoring method exists, explicitly show “composite screening result unavailable” and provide descriptive summaries only. Use accessible charts/tables and ensure values have textual equivalents. Add tests for unavailable/partial/complete data.
```

### Prompt 10 — Persistence and audit (after decisions)
```text
Implement the confirmed production database/storage adapters, migration/index/configuration, least-privilege security rules, backup/deletion approach, and append-only audit events. Keep secrets server-side. Enforce organization and patient access on every read/write. Do not store media unless explicit retention is approved; keep media in private object storage, never a public URL, with short-lived access if required. Add integration tests for access rules and audit coverage. Update docs with setup, data lifecycle, and limitations.
```

### Prompt 11 — AI provider integration (after governance approval)
```text
Integrate only the approved AI provider and exact approved task. Read PRODUCT_DECISIONS.md. The browser must never call the provider directly; use a server-side adapter with input validation, output schema validation, timeout, rate limits, bounded payloads, safe errors, and no sensitive logging. Do not make or imply a diagnosis. Do not produce a composite score or recommendations unless the approved validated method explicitly defines them. Record model/provider/version and review status. Include deterministic tests with mocked provider, failure/timeout tests, and a visible AI-unavailable state. If approvals/credentials are missing, leave integration disabled and explain the blocker.
```

### Prompt 12 — Admin and operations
```text
Implement only confirmed admin functions. Use server-side admin authorization, least privilege, explicit confirmation for high-impact actions, and audit logging. Show real operational data only; do not invent uptime, activity, or analytics. Avoid a generic unrestricted database browser. Add account/session controls, service health/readiness where appropriate, and admin access tests. Clearly label planned features rather than shipping dead buttons.
```

### Prompt 13 — Security, privacy, accessibility, and quality review
```text
Perform a focused review against AGENTS.md. Inspect for client-exposed secrets, unguarded routes/actions, insecure patient scope checks, PHI in logs/URLs/fixtures, overbroad database rules, unsafe media retention, fabricated clinical claims, misleading demo data, missing consent/deletion states, inaccessible controls, keyboard/focus problems, invalid HTML/hydration issues, and dependency vulnerabilities. Fix verified issues, add regression tests, and report unresolved risks honestly. Run lint, typecheck, unit/integration/e2e tests, and production build.
```

### Prompt 14 — Deployment preparation (do not deploy without approval)
```text
Prepare the frontend for Vercel deployment and the backend for the provider explicitly approved in PRODUCT_DECISIONS.md (propose Supabase if undecided, but do not provision it). Do not deploy or create paid/cloud resources. Verify Vercel build/runtime compatibility, environment variables, auth callback URLs, database RLS/migrations/indexes, private storage permissions, region, backups, and rollback. Document exact steps for a human, Claude Code, or Antigravity, including how to connect the Git repository to Vercel and configure secrets safely. If backend choice or data approvals remain unanswered, keep it demo-only and clearly state the blockers.
```

### Prompt 15 — Release candidate handoff
```text
Review the final diff and create/update README.md, docs/DEPLOYMENT.md, docs/SECURITY.md, docs/DATA_LIFECYCLE.md, and CHANGELOG.md as appropriate. Provide exact clean-clone install, env setup, test, build and run commands; hosting-specific steps; and rollback. Clearly list actual implemented features vs demo-only/planned features, external services, required secrets by variable name (never values), and clinical/privacy limitations. Run all checks. Do not deploy. Finish with a concise release checklist and any decisions still required.
```

## Recommended sequence and gates
1. **Answer questions 1–5, 9, 11–13, 16 first.** Confirm intended use, roles, jurisdiction, data/retention, risk method, Vercel access and backend choice (Supabase recommended to evaluate; Firebase if already in use). Keep demo-only until data decisions are approved.
2. **Prompts 0–3:** inspect, document decisions, establish app foundation, domain model and explicit demo boundary. Gate: clean build and demo/production separation tested.
3. **Prompts 4–6:** auth, patient records and assessment workflow. Gate: server-side role/scope tests and main journey pass.
4. **Prompts 7–9:** implement only the approved modality capture and transparent results. Gate: consent/media lifecycle checked; no unsupported clinical inference.
5. **Prompts 10–12:** production persistence, approved AI, and admin/operations only after provider, region, retention, and roles are confirmed. Gate: access rules, audit, provider failures, and data lifecycle tests pass.
6. **Prompts 13–15:** security/privacy/accessibility review, Vercel deployment preparation, release handoff. Gate: production build and documented deployment verified. Obtain explicit approval before actual deployment, migration, public release, or paid resource creation.

## Local and deployment acceptance checklist
- A clean clone can install with the checked-in lockfile and documented runtime version.
- `.env.example` lists all required variable names and safe placeholders; startup gives actionable errors for missing required configuration.
- Demo mode is unmistakable, synthetic, and cannot be enabled accidentally in production.
- `lint`, `typecheck`, unit/integration tests, end-to-end smoke tests, and production build pass (or exceptions are listed).
- Unauthenticated, wrong-role, and wrong-tenant requests are denied server-side.
- No real patient data, secrets, recordings, or transcripts appear in logs, analytics, URLs, fixtures, or screenshots.
- Capture permissions are opt-in; media tracks stop; data retention and deletion behavior match the approved policy.
- AI has an approved provider/method, server-side controls, provenance and uncertainty—or is disabled.
- Deployment guide covers the selected host, runtime, secrets, auth callbacks, database/storage access rules, backups, TLS/domain, monitoring, and rollback.
- User explicitly approves deployment and any production data migration before execution.

## Important note
This kit is implementation guidance, not clinical, legal, regulatory, security certification, or medical-device advice. A real clinical deployment requires appropriate expert review, validated methods, organizational governance, contracts, privacy/security controls, and jurisdiction-specific assessment.
