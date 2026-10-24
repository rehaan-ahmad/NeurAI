"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPatientAction } from "@/server/actions/patients";
import Link from "next/link";

export default function CreatePatient() {
  const router = useRouter();
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await createPatientAction(formData);
    if ("error" in result) {
      setError({ message: result.error as string, field: result.field });
      return;
    }
    router.push(`/patients/${String((result as { patient: { id: string } }).patient.id)}`);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Patient Profile</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Register a synthetic subject in your tenant-isolated clinical cohort.
          </p>
        </div>
        <Link href="/patients" className="text-xs text-muted hover:text-foreground font-semibold px-3 py-1.5 rounded-lg border border-border/60 hover:bg-muted-subtle transition-colors">
          ← Return to Registry
        </Link>
      </div>

      <form action={handleSubmit} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-5" noValidate>
        {error && (
          <div className="rounded-xl border border-danger/40 bg-danger-subtle p-4 text-danger text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted uppercase font-mono">Patient Reference</label>
            <input
              name="displayId"
              type="text"
              placeholder="e.g. P-1003"
              className="w-full rounded-xl border border-border/70 bg-background/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              required
            />
            {error?.field === "displayId" && (
              <p className="text-xs text-danger">Invalid patient reference identifier.</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted uppercase font-mono">Age (Years)</label>
            <input
              name="age"
              type="number"
              placeholder="e.g. 68"
              className="w-full rounded-xl border border-border/70 bg-background/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              required
            />
            {error?.field === "age" && (
              <p className="text-xs text-danger">Age must be between 0 and 120.</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted uppercase font-mono">Biological / Demographic Gender</label>
          <select
            name="gender"
            className="w-full rounded-xl border border-border/70 bg-background/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {error?.field === "gender" && (
            <p className="text-xs text-danger">Invalid gender option.</p>
          )}
        </div>

        <div className="pt-2">
          <button
            className="rounded-xl bg-primary hover:bg-primary-hover text-white px-7 py-3 text-sm font-semibold transition-all shadow-md shadow-primary/25"
          >
            Register Cohort Patient →
          </button>
        </div>
        <p className="text-xs text-muted">
          Synthetic demo data only — no external identifiers or PHI transmitted.
        </p>
      </form>
    </div>
  );
}
