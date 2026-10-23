import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GaitCapture } from "@/components/gait-capture";

const originalMediaDevices = navigator.mediaDevices;
const originalMediaRecorder = window.MediaRecorder;

describe("GaitCapture (local-only demo)", () => {
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

  it("renders the local-only demo warning and no-inference notice", () => {
    render(<GaitCapture />);
    expect(screen.getByText(/demo only/i)).toBeTruthy();
    expect(screen.getByText(/not uploaded or stored/i)).toBeTruthy();
    expect(screen.getByText(/No clinical inference is performed/i)).toBeTruthy();
  });

  it("blocks capture start when media is unsupported", () => {
    render(<GaitCapture />);
    const buttons = screen.getAllByRole("button", { name: /Unsupported/i });
    expect(buttons.length).toBeGreaterThan(0);
    expect((buttons[0] as HTMLButtonElement).disabled).toBe(true);
  });
});
