// AI server-side adapter — NeurAI
//
// Routes approved non-clinical tasks to Gemini or Grok with automatic model
// switching. The browser never calls a provider directly. Until credentials
// and governance are approved, returns an explicit AI-unavailable state.
// No diagnosis, risk score, or care recommendation is ever produced.

import { selectModel, unavailable, isAIConfigured } from "@/server/ai/router";
import { getLimiter } from "@/server/ai/rateLimiter";

export { unavailable };
import type {
  AIResponse,
  AITask,
  AIModelConfig,
  AIResult,
} from "@/server/ai/types";
import { DEFAULT_MODELS } from "@/server/ai/types";

const MAX_CHARS = 4000;
const REQUEST_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("AI request timed out")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

function geminiCall(config: AIModelConfig, text: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini API key not configured");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${encodeURIComponent(key)}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: { maxOutputTokens: 512, temperature: 0.2 },
    }),
  }).then(async (res) => {
    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  });
}

function grokCall(config: AIModelConfig, text: string): Promise<string> {
  const key = process.env.GROK_API_KEY;
  if (!key) throw new Error("Grok API key not configured");
  return fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${encodeURIComponent(key)}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: text }],
      temperature: 0.2,
      max_tokens: 512,
    }),
  }).then(async (res) => {
    if (!res.ok) throw new Error(`Grok error: ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? "";
  });
}

function callProvider(config: AIModelConfig, text: string): Promise<string> {
  switch (config.provider) {
    case "gemini":
      return geminiCall(config, text);
    case "grok":
      return grokCall(config, text);
  }
}

function validateOutput(raw: string): string {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new Error("AI provider returned empty output");
  }
  return raw.trim();
}

export async function runAI(task: AITask): Promise<AIResponse> {
  // Input validation / bounded payload
  let text = "";
  if (task.kind === "text-summarize" || task.kind === "text-classify") {
    text = task.text;
  }
  if (text.length > MAX_CHARS) {
    text = text.slice(0, MAX_CHARS);
  }

  if (!isAIConfigured()) {
    return unavailable(
      "no-credentials",
      "No AI provider credentials are configured. AI assistance is disabled until approved.",
    );
  }

  const config: AIModelConfig = {
    ...DEFAULT_MODELS.auto,
    provider: selectModel(task),
  };

  // Rate limit
  const limiter = getLimiter(`ai:${config.provider}`);
  if (!limiter.tryConsume()) {
    return unavailable("provider-error", "AI rate limit exceeded. Try again later.");
  }

  // Build a safe, non-clinical prompt
  const prompt =
    task.kind === "text-summarize"
      ? `Summarize the following text briefly and factually. Do not provide medical advice or a diagnosis.\n\nTEXT:\n${text}`
      : task.kind === "text-classify"
        ? `Classify the following text into exactly one of these labels: ${task.labels.join(
            ", ",
          )}. Return only the label.\n\nTEXT:\n${text}`
        : `Transcribe the following audio metadata (byte count: ${(task as { audioBytes?: number }).audioBytes ?? "unknown"}) into a brief descriptive note. No clinical inference.\n`;

  try {
    const raw = await withTimeout(callProvider(config, prompt), REQUEST_TIMEOUT_MS);
    const output = validateOutput(raw);
    const result: AIResult = {
      output,
      provider: config.provider,
      model: config.model,
      version: config.version,
      uncertainty: "medium",
      reviewStatus: "pending",
      latencyMs: 0,
    };
    return { kind: "ok", result };
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI provider error";
    if (message.includes("timed out")) {
      return unavailable("timeout", "AI request timed out. Try again later.");
    }
    return unavailable("provider-error", message);
  }
}
