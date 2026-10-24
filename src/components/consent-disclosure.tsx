"use client";

// Consent disclosure placeholder — sourced from confirmed policy.
// Placeholder copy only; replace with approved policy text before production.
export function ConsentDisclosure() {
  return (
    <section className="rounded-2xl border border-border/60 bg-muted-subtle/30 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-teal" />
        <h2 className="text-sm font-bold text-foreground">Purpose & Informed Consent Protocol</h2>
      </div>
      <p className="text-xs text-muted leading-relaxed">
        This session documents clinician-entered cognitive test observations for dementia screening workflow support. It is <strong className="text-foreground">not an automated diagnostic system</strong> and produces no diagnosis, risk score, or treatment recommendation.
      </p>
      <p className="text-xs text-muted leading-relaxed">
        Data is processed strictly under the facility&apos;s approved local retention policy. Transient telemetry (speech / video) is executed in volatile memory and is never uploaded or retained in cloud repositories.
      </p>
      <fieldset className="space-y-3 pt-2">
        <legend className="text-[11px] font-semibold text-muted uppercase tracking-wider font-mono">Consent Acknowledgments</legend>
        <label className="flex items-start gap-3 text-xs text-foreground cursor-pointer select-none p-2.5 rounded-xl border border-border/40 bg-card/60 hover:bg-card transition-colors">
          <input type="checkbox" name="consentPurpose" className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4" required />
          <span>I have explained the purpose and screening scope of this assessment to the subject.</span>
        </label>
        <label className="flex items-start gap-3 text-xs text-foreground cursor-pointer select-none p-2.5 rounded-xl border border-border/40 bg-card/60 hover:bg-card transition-colors">
          <input type="checkbox" name="consentRetention" className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4" required />
          <span>Data handling, privacy boundaries, and disclosure terms have been formally communicated.</span>
        </label>
        <label className="flex items-start gap-3 text-xs text-foreground cursor-pointer select-none p-2.5 rounded-xl border border-border/40 bg-card/60 hover:bg-card transition-colors">
          <input type="checkbox" name="consentRecording" className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4" />
          <span>Optional: subject agreed to live biometric telemetry demonstration (not stored by default).</span>
        </label>
      </fieldset>
    </section>
  );
}
