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
    <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6">
      <div className="rounded-xl border border-teal/20 bg-teal/5 p-4 flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-teal/10 border border-teal/30 flex items-center justify-center text-teal shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Gait capture (demo)</h3>
          <p className="mt-1 text-xs text-danger leading-relaxed">
            Demo only — video is captured in memory and <strong>not uploaded or stored</strong>. No stride, cadence, gait speed, or neurological condition is inferred. Not for clinical use.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-muted-subtle/30 p-4 text-xs text-muted leading-relaxed">
        <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-teal" />
          Corridor Calibration Guide
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Position the camera at hip height, parallel to the straight walking corridor.</li>
          <li>Ensure ~3 metres of unobstructed, well-lit walkway without glare.</li>
          <li>Subject initiates steady walking pace, pivots at boundary marker, and returns.</li>
        </ul>
        <p className="mt-2 text-[11px] text-danger font-medium">
          Safety Notice: This is not a validated gait assessment. No clinical inference is performed.
        </p>
      </div>

      {status === "error" && (
        <div className="rounded-xl border border-danger/40 bg-danger-subtle p-4 text-danger text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => { setError(null); setStatus("idle"); }}
            className="text-xs font-semibold underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Video Viewfinder Stage */}
      <div className="p-8 rounded-2xl border border-border/60 bg-muted-subtle/20 flex flex-col items-center justify-center text-center">
        <div className="relative mb-4">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${
            status === "recording"
              ? "bg-danger text-white shadow-lg shadow-danger/30 animate-pulse"
              : status === "paused"
              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
              : "bg-muted-subtle border border-border text-muted"
          }`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          {status === "recording" && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-danger" />
            </span>
          )}
        </div>

        <div className="text-3xl font-mono font-bold tracking-wider text-foreground mb-1">
          {timer}
        </div>
        <div className="text-xs text-muted uppercase font-mono tracking-widest">
          {status === "recording" ? "OPTICAL TELEMETRY BUFFERING..." : status === "paused" ? "OPTICAL STREAM PAUSED" : "CAMERA READY"}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {status === "idle" && (
          <button
            disabled={unsupported}
            onClick={start}
            className="rounded-xl bg-primary hover:bg-primary-hover text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/25"
          >
            {unsupported ? "Unsupported in this browser" : "Start Video Protocol"}
          </button>
        )}
        {status === "recording" && (
          <>
            <button
              onClick={togglePause}
              className="rounded-xl border border-border bg-muted-subtle px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted-subtle/80 transition-colors"
            >
              Pause Stream
            </button>
            <button
              onClick={handleStop}
              className="rounded-xl bg-danger hover:bg-danger/90 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-md shadow-danger/20"
            >
              Stop & Review Buffer
            </button>
          </>
        )}
        {status === "paused" && (
          <>
            <button
              onClick={togglePause}
              className="rounded-xl border border-border bg-muted-subtle px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted-subtle/80 transition-colors"
            >
              Resume Stream
            </button>
            <button
              onClick={handleStop}
              className="rounded-xl bg-danger hover:bg-danger/90 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-md shadow-danger/20"
            >
              Stop & Review Buffer
            </button>
          </>
        )}
        {status === "idle" && blobUrl && (
          <button
            onClick={handleCancel}
            className="rounded-xl border border-border bg-muted-subtle px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Clear Demo Buffer
          </button>
        )}
      </div>

      {blobUrl && (
        <div className="rounded-xl border border-border/60 bg-muted-subtle/30 p-4">
          <div className="text-xs font-semibold text-muted mb-2 font-mono uppercase tracking-wider">
            In-Memory Playback (Ephemeral 30s TTL · Zero Persistent Storage)
          </div>
          <video src={blobUrl} controls className="w-full max-w-md mx-auto rounded-lg" />
        </div>
      )}
    </section>
  );
}
