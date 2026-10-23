"use client";

// Gait capture — LOCAL-ONLY DEMO (Prompt 8).
//
// No validated gait measurement protocol or clinically validated inference
// method is approved. Therefore:
//  - No raw video is uploaded or retained.
//  - No stride, cadence, gait speed, or neurological condition is inferred.
//  - A visible warning states this is demo-only, not for clinical use.
//  - Media tracks are always stopped on stop/cancel/unmount.
//  - Any in-memory playback URL is revoked immediately; nothing persists.

import { useCallback, useEffect, useRef, useState } from "react";

export function GaitCapture() {
  const [status, setStatus] = useState<"idle" | "recording" | "paused" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const mediaRef = useRef<{ stream: MediaStream; recorder: MediaRecorder; chunks: Blob[] } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopTracks = useCallback(() => {
    if (mediaRef.current) {
      mediaRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRef.current = null;
    }
    clearTimer();
  }, []);

  const unsupported =
    typeof navigator === "undefined" ||
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia ||
    typeof MediaRecorder === "undefined";

  const start = async () => {
    setError(null);
    stopTracks();
    if (unsupported) {
      setError("Video capture is not supported in this browser.");
      setStatus("error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setTimeout(() => { URL.revokeObjectURL(url); setBlobUrl(null); }, 30_000);
        stopTracks();
        setStatus("idle");
      };
      recorder.onerror = () => {
        setError("Video recording failed.");
        setStatus("error");
        stopTracks();
      };
      mediaRef.current = { stream, recorder, chunks };
      recorder.start();
      setStatus("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      setError(err instanceof DOMException ? err.name : "Camera access denied.");
      setStatus("error");
      stopTracks();
    }
  };

  const togglePause = () => {
    if (!mediaRef.current) return;
    if (status === "recording") {
      mediaRef.current.recorder.pause();
      setStatus("paused");
      clearTimer();
    } else if (status === "paused") {
      mediaRef.current.recorder.resume();
      setStatus("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  };

  const handleStop = () => {
    if (mediaRef.current) mediaRef.current.recorder.stop();
    setStatus("idle");
  };

  const handleCancel = () => {
    stopTracks();
    setBlobUrl(null);
    setStatus("idle");
    setError(null);
  };

  useEffect(() => {
    return () => {
      stopTracks();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl, stopTracks]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timer = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <section className="rounded-md border border-border bg-background p-5 space-y-4">
      <div className="rounded-md border border-border bg-muted-subtle p-3">
        <h3 className="text-sm font-semibold text-foreground">Gait capture (demo)</h3>
        <p className="mt-1 text-xs text-danger">
          Demo only — video is captured in memory and <strong>not uploaded or
          stored</strong>. No stride, cadence, gait speed, or neurological
          condition is inferred. Not for clinical use.
        </p>
      </div>

      <div className="rounded-md border border-border bg-muted-subtle p-3 text-xs text-muted leading-relaxed">
        <p className="font-semibold mb-1">Capture protocol (demo placeholder)</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Position the camera at hip height, facing the walk path.</li>
          <li>Keep ~3 metres of clear, level walking space.</li>
          <li>Use even lighting; avoid strong backlight or glare.</li>
          <li>Walk at your normal pace, turn, and walk back.</li>
          <li>Stop if you feel unsteady; use a mobility aid if needed.</li>
        </ul>
        <p className="mt-2 text-xs text-danger">
          This is not a validated gait assessment. No clinical inference is
          performed.
        </p>
      </div>

      {status === "error" && (
        <div className="rounded-md border border-danger bg-danger-subtle p-3 text-danger text-sm">
          {error}
          <button
            onClick={() => { setError(null); setStatus("idle"); }}
            className="mt-2 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-sm font-mono text-foreground">{timer}</span>
        {status === "idle" && (
          <button
            disabled={unsupported}
            onClick={start}
            className="rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          >
            {unsupported ? "Unsupported" : "Start recording"}
          </button>
        )}
        {status === "recording" && (
          <>
            <button
              onClick={togglePause}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted hover:bg-muted-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border transition-colors"
            >
              Pause
            </button>
            <button
              onClick={handleStop}
              className="rounded-md border border-danger bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger transition-colors"
            >
              Stop
            </button>
          </>
        )}
        {status === "paused" && (
          <>
            <button
              onClick={togglePause}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted hover:bg-muted-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border transition-colors"
            >
              Resume
            </button>
            <button
              onClick={handleStop}
              className="rounded-md border border-danger bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger transition-colors"
            >
              Stop
            </button>
          </>
        )}
        {status === "idle" && blobUrl && (
          <button
            onClick={handleCancel}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted hover:bg-muted-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border transition-colors"
          >
            Clear demo playback
          </button>
        )}
        {status === "idle" && !blobUrl && (
          <button
            onClick={handleCancel}
            className="ml-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted hover:bg-muted-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {blobUrl && (
        <div className="text-xs text-muted">
          In-memory demo playback (revoked after 30s; not stored):{" "}
          <video src={blobUrl} controls className="mt-1 max-w-xs" />
        </div>
      )}
    </section>
  );
}
