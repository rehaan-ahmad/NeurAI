"use client";

// Consent disclosure placeholder — sourced from confirmed policy.
// Placeholder copy only; replace with approved policy text before production.
export function ConsentDisclosure() {
  return (
    <section className="rounded-md border border-border bg-muted-subtle p-5">
      <h2 className="text-sm font-semibold text-foreground">Purpose and data handling</h2>
      <p className="mt-1 text-sm text-muted leading-relaxed">
        This session records clinician-entered cognitive test observations for
        dementia screening workflow support. It is <strong>not a diagnostic
        system</strong> and produces no diagnosis, risk score, or treatment
        recommendation.
      </p>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        Data is retained per the clinic&apos;s approved retention policy. Recordings
        or transcripts are not stored by default. You may withdraw consent at
        any time; withdrawn data is excluded from results.
      </p>
      <fieldset className="mt-4 space-y-2">
        <legend className="text-xs font-semibold text-muted uppercase">Consent</legend>
        <label className="flex items-start gap-2 text-sm text-foreground cursor-pointer select-none">
          <input type="checkbox" name="consentPurpose" className="mt-1 rounded border-border text-primary focus:ring-primary" required />
          <span>I have explained the purpose of this assessment to the patient.</span>
        </label>
        <label className="flex items-start gap-2 text-sm text-foreground cursor-pointer select-none">
          <input type="checkbox" name="consentRetention" className="mt-1 rounded border-border text-primary focus:ring-primary" required />
          <span>Retention and disclosure terms have been communicated.</span>
        </label>
        <label className="flex items-start gap-2 text-sm text-foreground cursor-pointer select-none">
          <input type="checkbox" name="consentRecording" className="mt-1 rounded border-border text-primary focus:ring-primary" />
          <span>Optional: patient agreed to speech/gait capture (not stored by default).</span>
        </label>
      </fieldset>
      <p className="mt-3 text-xs text-muted">
        Placeholder policy text — replace with approved clinic policy before
        production use.
      </p>
    </section>
  );
}
