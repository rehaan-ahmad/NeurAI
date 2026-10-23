import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpeechCapture } from "@/components/speech-capture";

const originalMediaDevices = navigator.mediaDevices;
const originalMediaRecorder = window.MediaRecorder;

describe("SpeechCapture (local-only demo)", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      get: () => undefined,
    });
    window.MediaRecorder = undefined as unknown as typeof MediaRecorder;
  });

  afterEach(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      get: () => originalMediaDevices,
    });
    window.MediaRecorder = originalMediaRecorder;
  });

  it("renders the local-only demo warning", () => {
    render(<SpeechCapture />);
    expect(screen.getByText(/demo only/i)).toBeTruthy();
    expect(screen.getByText(/not uploaded or stored/i)).toBeTruthy();
    expect(screen.getByText(/not for clinical use/i)).toBeTruthy();
  });

  it("blocks capture start when media is unsupported", () => {
    render(<SpeechCapture />);
    const buttons = screen.getAllByRole("button", { name: /Unsupported/i });
    expect(buttons.length).toBeGreaterThan(0);
    expect((buttons[0] as HTMLButtonElement).disabled).toBe(true);
  });
});
