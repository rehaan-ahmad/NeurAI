"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Speech capture — LOCAL-ONLY DEMO (Prompt 7).
//
// Voice chat was approved as a feature, but no AI provider credentials,
// consent framework, or media retention approval is configured. Therefore:
//  - No raw audio is uploaded or retained.
//  - No audio or transcripts are logged.
//  - A visible warning states this is demo-only, not for clinical use.
//  - Media tracks are always stopped on stop/cancel/unmount.
//  - Any in-memory playback URL is revoked immediately; nothing persists.

export function SpeechCapture() {
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
      setError("Audio capture is not supported in this browser.");
      setStatus("error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        // Revoke after a short demo window; nothing is retained.
        setTimeout(() => { URL.revokeObjectURL(url); setBlobUrl(null); }, 30_000);
        stopTracks();
        setStatus("idle");
      };
      recorder.onerror = () => {
        setError("Audio recording failed.");
        setStatus("error");
        stopTracks();
      };
      mediaRef.current = { stream, recorder, chunks };
      recorder.start();
      setStatus("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      setError(err instanceof DOMException ? err.name : "Microphone access denied.");
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
        <h3 className="text-sm font-semibold text-foreground">Speech capture (demo)</h3>
        <p className="mt-1 text-xs text-danger">
          Demo only — audio is captured in memory and <strong>not uploaded or
          stored</strong>. No transcripts are logged. Not for clinical use.
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
          <audio src={blobUrl} controls className="mt-1" />
        </div>
      )}
    </section>
  );
}
