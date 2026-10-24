import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-teal flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-mono font-bold text-white text-lg">N</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              NeurAI
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider text-teal border border-teal/30 bg-teal/10 px-1.5 py-0.5 rounded">
              v0.1 Clinical Protocol
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex items-center gap-2 text-xs text-muted font-medium bg-muted-subtle/50 px-3 py-1.5 rounded-full border border-border/50">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
            Synthetic Demo Sandbox
          </span>
          <Link
            href="/protected/dashboard"
            className="rounded-lg bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold px-4 py-2 transition-all duration-200 shadow-md shadow-primary/25 hover:shadow-primary/40 active:scale-95"
          >
            Launch Console →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
          <span className="font-mono text-teal">01</span> Multimodal Screening Support for Clinicians
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-balance bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Intelligent Cognitive Screening & Clinical Workflow Orchestration
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          NeurAI streamlines clinical history, standardized cognitive assessment batteries, local-first speech observations, and gait capture telemetry into a unified, secure dashboard.
        </p>

        {/* Regulatory & Safety Notice Card */}
        <div className="mt-8 p-4 max-w-2xl rounded-xl border border-teal/20 bg-teal/5 text-teal text-xs sm:text-sm flex items-start gap-3 text-left">
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-semibold text-white">Clinical and Research Guardrails:</span> NeurAI is built as clinician-facing decision support. It is not an automated diagnostic system and generates no synthetic disease risk scores without human validation.
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm">
          <Link
            href="/protected/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-teal text-white px-7 py-3.5 text-sm font-semibold transition-all duration-200 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
          >
            Open Clinical Dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/protected/patients"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border bg-muted-subtle/50 hover:bg-muted-subtle text-foreground px-6 py-3.5 text-sm font-medium transition-all duration-200 hover:border-slate-500"
          >
            Explore Patient Cohorts
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          {/* Card 1 */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card to-background p-6 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
            <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary mb-4 font-mono text-base font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-foreground">Standardized Batteries</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Record MMSE, MoCA, Clock Drawing, and verbal recall observations with full audit trails and structured scoring breakdowns.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card to-background p-6 relative overflow-hidden group hover:border-teal/50 transition-all duration-300">
            <div className="h-10 w-10 rounded-lg bg-teal/20 border border-teal/30 flex items-center justify-center text-teal mb-4 font-mono text-base font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-foreground">Local-First Biometrics</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              In-memory speech and gait telemetric capture protocols. Privacy-preserving design ensures zero unconsented cloud video or audio retention.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card to-background p-6 relative overflow-hidden group hover:border-purple-400/50 transition-all duration-300">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 font-mono text-base font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-foreground">Enterprise Security & RLS</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Multi-tenant architecture with Row Level Security, append-only immutable audit logs, and strict server-side authorization boundaries.
            </p>
          </div>
        </div>

        {/* Technical Architecture Badge Bar */}
        <div className="mt-20 border-t border-border/40 pt-10 w-full flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
          <div>
            Built with <span className="text-foreground font-semibold">Next.js 16 App Router</span> + <span className="text-foreground font-semibold">Turbopack</span> & <span className="text-foreground font-semibold">TypeScript</span>
          </div>
          <div className="flex items-center gap-6 font-mono">
            <span>READY FOR VERCEL DEPLOYMENT</span>
            <span>•</span>
            <span className="text-teal font-semibold">ALL GATES VERIFIED</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted bg-background/50">
        NeurAI Research & Clinical Decision Support Demo — Clean Rebuild Stack.
      </footer>
    </div>
  );
}
