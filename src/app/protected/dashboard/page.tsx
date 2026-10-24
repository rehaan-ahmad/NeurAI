import { getSession } from "@/server/auth/session";
import { listPatientsAction } from "@/server/actions/patients";
import { listAssessmentsAction } from "@/server/actions/assessments";
import Link from "next/link";

export default async function Dashboard() {
  const session = getSession();
  const patientResult = await listPatientsAction();
  const assessmentResult = await listAssessmentsAction();

  const patientsCount = Array.isArray(patientResult) ? patientResult.length : 0;
  const assessmentsCount = Array.isArray(assessmentResult) ? assessmentResult.length : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-2">
            Clinical Console
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Clinician Workspace
          </h1>
          <p className="mt-1 text-sm text-muted">
            Logged in as <span className="text-foreground font-semibold">{session?.user.name}</span> ({session?.user.role}) · Tenant ID <code className="text-xs bg-muted-subtle px-1.5 py-0.5 rounded text-teal">{session?.organizationId}</code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/protected/assessments/new"
            className="rounded-xl bg-primary hover:bg-primary-hover text-white px-4 py-2.5 text-sm font-semibold transition-all duration-150 shadow-md shadow-primary/25 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Assessment
          </Link>
          <Link
            href="/protected/patients/create"
            className="rounded-xl border border-border bg-muted-subtle/60 hover:bg-muted-subtle text-foreground px-4 py-2.5 text-sm font-medium transition-all"
          >
            Add Patient
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 relative overflow-hidden shadow-sm">
          <div className="text-xs font-semibold text-muted uppercase font-mono">Active Cohort</div>
          <div className="mt-2 text-3xl font-bold text-foreground">{patientsCount}</div>
          <div className="mt-2 flex items-center text-xs text-teal font-medium">
            <span>Synthetic Demo Patients</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 relative overflow-hidden shadow-sm">
          <div className="text-xs font-semibold text-muted uppercase font-mono">Completed Batteries</div>
          <div className="mt-2 text-3xl font-bold text-foreground">{assessmentsCount}</div>
          <div className="mt-2 flex items-center text-xs text-purple-400 font-medium">
            <span>Observations Logged</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 relative overflow-hidden shadow-sm">
          <div className="text-xs font-semibold text-muted uppercase font-mono">Data Storage</div>
          <div className="mt-2 text-3xl font-bold text-foreground">Zero Retention</div>
          <div className="mt-2 flex items-center text-xs text-teal font-medium">
            <span>In-memory sandbox</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 relative overflow-hidden shadow-sm">
          <div className="text-xs font-semibold text-muted uppercase font-mono">Decision Protocol</div>
          <div className="mt-2 text-xl font-bold text-foreground pt-1">Screening Support</div>
          <div className="mt-2 flex items-center text-xs text-amber-400 font-medium">
            <span>Human review mandatory</span>
          </div>
        </div>
      </div>

      {/* Quick Action Clinical Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/protected/patients"
          className="rounded-2xl border border-border/60 bg-card p-6 group hover:border-primary/50 transition-all duration-200 block"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-foreground flex items-center justify-between">
            Patient Registry
            <span className="text-xs text-muted group-hover:text-primary transition-colors">View all →</span>
          </h3>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Manage demographics, display IDs, and individual assessment histories under tenant isolation.
          </p>
        </Link>

        <Link
          href="/protected/speech"
          className="rounded-2xl border border-border/60 bg-card p-6 group hover:border-teal/50 transition-all duration-200 block"
        >
          <div className="h-10 w-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center text-teal mb-4 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-foreground flex items-center justify-between">
            Speech Telemetry Demo
            <span className="text-xs text-muted group-hover:text-teal transition-colors">Test →</span>
          </h3>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            In-memory voice capture demonstration with client-side track termination and 30-second TTL.
          </p>
        </Link>

        <Link
          href="/protected/gait"
          className="rounded-2xl border border-border/60 bg-card p-6 group hover:border-purple-400/50 transition-all duration-200 block"
        >
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-foreground flex items-center justify-between">
            Gait Analysis Demo
            <span className="text-xs text-muted group-hover:text-purple-400 transition-colors">Test →</span>
          </h3>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Standard walking corridor protocol testing with video streams executed locally without cloud upload.
          </p>
        </Link>
      </div>

      {/* Audit & Compliance Transparency Callout */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal" />
            Clinical Verification & Operational Guardrails
          </h2>
          <Link href="/protected/admin" className="text-xs text-teal hover:underline font-mono">
            View Audit Log →
          </Link>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          NeurAI strictly separates observational data from diagnostic claims. All assessment scores reflect individual battery performance without synthetic machine risk weighting. Full operational events are recorded to the append-only audit stream.
        </p>
      </div>
    </div>
  );
}
