import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from "vitest";
import { runAI, unavailable } from "@/server/ai/adapter";
import type { AIResponse } from "@/server/ai/types";

const originalEnv = process.env;
const originalFetch = global.fetch;

function setKeys(gemini?: string, grok?: string) {
  process.env = { ...originalEnv, GEMINI_API_KEY: gemini ?? "", GROK_API_KEY: grok ?? "" };
}

function mockFetch(response: {
  ok?: boolean;
  status?: number;
  json?: Record<string, unknown>;
  error?: string;
}) {
  if (response.error) {
    global.fetch = vi.fn(() => Promise.reject(new Error(response.error))) as unknown as typeof fetch;
    return;
  }
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: response.ok,
      status: response.status ?? 200,
      json: () => Promise.resolve(response.json ?? {}),
    } as Response)
  ) as unknown as typeof fetch;
}

function asUnavailable(res: AIResponse) {
  expect(res.kind).toBe("unavailable");
  return res as { kind: "unavailable"; error: { reason: string } };
}

describe("AI adapter", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("is unavailable when no credentials configured", async () => {
    setKeys(undefined, undefined);
    const res = await runAI({ kind: "text-summarize", text: "hello world" });
    const u = asUnavailable(res);
    expect(u.error.reason).toBe("no-credentials");
  });

  it("produces a traced result from a mocked gemini provider", async () => {
    setKeys("gemini-key", undefined);
    mockFetch({
      ok: true,
      json: { candidates: [{ content: { parts: [{ text: "A brief summary." }] } }] },
    });
    const res = await runAI({ kind: "text-summarize", text: "A long piece of text to summarize." });
    expect(res.kind).toBe("ok");
    if (res.kind === "ok") {
      expect(res.result.output).toBe("A brief summary.");
      expect(res.result.provider).toBe("gemini");
      expect(res.result.reviewStatus).toBe("pending");
      expect(res.result.uncertainty).toBe("medium");
    }
  });

  it("returns provider-error when the gemini provider fails", async () => {
    setKeys("gemini-key", undefined);
    mockFetch({ ok: false, status: 500 });
    const res = await runAI({ kind: "text-summarize", text: "hello" });
    const u = asUnavailable(res);
    expect(u.error.reason).toBe("provider-error");
  });

  it("returns timeout when the provider does not respond", async () => {
    setKeys("gemini-key", undefined);
    mockFetch({ error: "AI request timed out" });
    const res = await runAI({ kind: "text-summarize", text: "hello" });
    const u = asUnavailable(res);
    expect(u.error.reason).toBe("timeout");
  });

  it("bounds the payload and does not send raw long text unchanged", async () => {
    setKeys("gemini-key", undefined);
    mockFetch({ ok: true, json: { candidates: [{ content: { parts: [{ text: "ok" }] } }] } });
    const longText = "x".repeat(10000);
    await runAI({ kind: "text-summarize", text: longText });
    const fetchMock = global.fetch as unknown as Mock;
    const call = fetchMock.mock.calls[0][1] as { body?: string };
    const body = JSON.parse(call.body ?? "{}");
    const promptText: string = body.contents[0].parts[0].text;
    expect(promptText.length).toBeLessThanOrEqual(4000 + 200);
  });

  it("unavailable() helper builds an unavailable response", () => {
    const res = unavailable("no-credentials", "AI disabled.");
    expect(res.kind).toBe("unavailable");
    const u = res as { kind: "unavailable"; error: { unavailable: boolean; reason: string } };
    expect(u.error.unavailable).toBe(true);
    expect(u.error.reason).toBe("no-credentials");
  });
});
