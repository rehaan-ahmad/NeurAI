-- NeurAI — Supabase schema and row-level security (RLS)
--
-- Code-configured only. This migration is NOT applied automatically. Review,
-- approve, and apply it through your Supabase project only after the backend
-- decision and data-retention/legal review are complete. Do not run against
-- production without explicit approval.
--
-- Multi-tenant design: every patient and assessment is scoped to an
-- organization (clinic). RLS enforces organization/patient access on the
-- database side, in addition to the server-side checks in the repository
-- layer. Secrets (service role key) are never exposed to the browser.

-- Enable RLS
alter table if exists public.patients enable row level security;
alter table if exists public.assessments enable row level security;
alter table if exists public.audit_events enable row level security;

-- Organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  created_at timestamptz not null default now()
);

-- Patients (scoped to organization)
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  display_id text not null,
  age integer not null check (age >= 0 and age <= 120),
  gender text not null,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Assessment sessions (scoped to organization + patient)
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  clinician_id uuid not null,
  status text not null check (status in ('scheduled','in-progress','completed','cancelled')),
  cognitive_tests jsonb not null default '[]'::jsonb,
  speech jsonb not null default '{}'::jsonb,
  gait jsonb not null default '{}'::jsonb,
  result_provenance jsonb not null default '{}'::jsonb,
  consent jsonb not null default '{}'::jsonb,
  clinician_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Append-only audit events (no raw payloads)
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete set null,
  actor_id uuid not null,
  actor_role text not null,
  action text not null,
  outcome text not null check (outcome in ('success','denied','error')),
  timestamp timestamptz not null default now()
);

-- Indexes for access patterns
create index if not exists idx_patients_org on public.patients(organization_id);
create index if not exists idx_assessments_org_patient on public.assessments(organization_id, patient_id);
create index if not exists idx_assessments_patient on public.assessments(patient_id);
create index if not exists idx_audit_org on public.audit_events(organization_id);
create index if not exists idx_audit_patient on public.audit_events(patient_id);

-- RLS policies: actors may only read/write rows within their organization.
create policy if not exists patients_org_select
  on public.patients for select
  using (auth.uid() = created_by and organization_id = (select organization_id from public.profiles where id = auth.uid()));
create policy if not exists patients_org_insert
  on public.patients for insert
  with check (auth.uid() = created_by);
create policy if not exists patients_org_update
  on public.patients for update
  using (auth.uid() = created_by and organization_id = (select organization_id from public.profiles where id = auth.uid()));
create policy if not exists patients_org_delete
  on public.patients for delete
  using (auth.uid() = created_by and organization_id = (select organization_id from public.profiles where id = auth.uid()));

create policy if not exists assessments_org_select
  on public.assessments for select
  using (organization_id = (select organization_id from public.profiles where id = auth.uid()));
create policy if not exists assessments_org_insert
  on public.assessments for insert
  with check (organization_id = (select organization_id from public.profiles where id = auth.uid()));
create policy if not exists assessments_org_update
  on public.assessments for update
  using (organization_id = (select organization_id from public.profiles where id = auth.uid()));
create policy if not exists assessments_org_delete
  on public.assessments for delete
  using (organization_id = (select organization_id from public.profiles where id = auth.uid()));

create policy if not exists audit_events_org_select
  on public.audit_events for select
  using (organization_id = (select organization_id from public.profiles where id = auth.uid()));
create policy if not exists audit_events_org_insert
  on public.audit_events for insert
  with check (organization_id = (select organization_id from public.profiles where id = auth.uid()));

-- NOTE: The `public.profiles` table and `auth.uid()` integration depend on
-- your Supabase Auth setup and are shown here as the intended pattern. Adjust
-- to match your actual auth/user schema before applying.

-- Backup/deletion: use Supabase platform backups + point-in-time recovery.
-- Deletion: cascade deletes remove a patient's assessments and audit events.
-- Do not store raw audio/video in these tables; use private object storage
-- with short-lived signed URLs only if media retention is explicitly approved.
