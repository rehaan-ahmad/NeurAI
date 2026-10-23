# Product Decisions — NeurAI

Confirmed answers recorded separately from assumptions. All decisions below are owner-confirmed unless marked "(assumption)". Until a decision is marked confirmed, demo-only defaults apply and production integrations remain blocked.

## 1. Intended use
- Confirmed: Prototype to be deployed and shown to Hackathon Judges.
- Claims the UI may make: dementia-screening workflow support only. **No diagnosis, no individual risk probability, no treatment advice, no clinical efficacy claim.** Labeled "not a diagnosis / not clinically validated."

## 2. Users and roles
- Confirmed roles: clinician, admin, patient.
- Clinicians: create/read/update patients, assessments, results within their clinic(s).
- Admins: manage clinics, users, roles, audit logs (least privilege).
- Patients: view-only self-service of their own history, sessions, and appointments. Patients cannot create records or edit clinical data.
- Patient self-service in scope: read-only own data.

## 3. Jurisdiction and compliance
- Confirmed: India (rural and urban). Follow India best practices for health data.
- No HIPAA/GDPR compliance claimed from code alone. No real patient data until compliance/legal review.
- Compliance owner: not yet assigned (assumption: product owner).

## 4. Identity and tenancy
- Confirmed: multiple clinics (multi-tenant). Each clinic is a tenant/organization.
- Real provider auth required before production (Supabase Auth).
- SSO/MFA/invitations: not confirmed; design for least privilege, add later if approved.

## 5. Data and persistence
- Confirmed: India best practices; minimum necessary fields.
- Synthetic development fixtures only. Do not persist raw audio/video/recordings unless explicit retention is approved.
- Retention/deletion/export rules: to be defined after legal review (assumption).

## 6. Speech model
- Not confirmed: external AI disabled by default. Recording UI may be prototyped locally; no identifiable audio leaves environment without consent/contracts/region approval.

## 7. Gait measurement
- Not confirmed: document protocol and show capture workflow only; no clinical inference from video.

## 8. Cognitive tests
- Not confirmed: generic configurable score fields; no copied protected test content.

## 9. Risk and recommendations
- Confirmed: best applicable choice. No invented composite risk score or AI-generated care advice unless a validated, approved method is supplied.

## 10. Admin/audit
- Assumption: least privilege; append-only audit metadata for production mutations; no raw payloads in audit.

## 11. Deployment
- Confirmed: Vercel frontend. Public site (not private preview).
- Vercel team/project/domain: not yet provided (assumption: to be configured at deploy time).

## 12. Backend
- Confirmed: Supabase (Postgres + Auth + RLS + private storage), configured at code level only. **Not provisioned; no credentials added.** Firebase not used.
- Region: to be confirmed (India-compatible preferred given user base).

## 13. AI provider and cost controls
- Confirmed: Gemini + Grok as AI providers with automatic model switching based on requirement. Server-side adapter only; browser never calls a provider directly. Voice chat option included.
- Keys/project access, budget caps: not yet provided (blocker for live AI calls).
- Until credentials confirmed: AI integration disabled, visible AI-unavailable state.

## 14. Design and scope
- Assumption: muted purple/teal and Inter; WCAG 2.2 AA target; English UI.
- Mandatory first-release screens: dashboard, patient list/create/detail, assessment shell, results, admin status.

## 15. Languages/accessibility
- Assumption: English; WCAG 2.2 AA target.

## 16. Starting point
- Confirmed: clean repository, no prior READMEs/source code. Build everything from scratch. No logos/design assets supplied. No patient data migration.

## 17. Release target
- Confirmed: public demo/site. No public PHI. Domain, email sender, monitoring, backup: not yet provided.

## Demo-vs-production boundary
- Demo mode: visibly labeled, synthetic fixtures, impossible to mistake for production.
- Production: disabled until Supabase provisioned, auth configured, region/consent/legal approved.

## Non-goals
- No diagnosis, no clinical validation, no compliance certification, no raw media storage by default, no AI-generated care advice, no patient record creation.
