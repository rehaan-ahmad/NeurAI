import { GaitCapture } from "@/components/gait-capture";

export default function GaitPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Gait capture</h1>
        <a
          href="/dashboard"
          className="text-sm text-muted underline offset-4 hover:text-primary"
        >
          Back to dashboard
        </a>
      </div>
      <p className="mt-2 text-sm text-muted">
        Local-only demo capture. Video is never uploaded, stored, or analyzed
        for gait parameters.
      </p>
      <GaitCapture />
    </div>
  );
}
