// AI types — NeurAI
//
// All AI is server-side only. The browser never calls a provider directly.
// No validated clinical method exists, so AI never produces a diagnosis, risk
// score, or care recommendation. Results carry provenance, model version,
// uncertainty, and human-review state, and are shown with an explicit
// "not a diagnosis" limitation.

export type AIProvider = "gemini" | "grok";

export type AIModelKind = "speech" | "text" | "auto";

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  version: string;
}

export interface AIResult<T = unknown> {
  output: T;
  provider: AIProvider;
  model: string;
  version: string;
  uncertainty: "low" | "medium" | "high";
  reviewedBy?: string;
  reviewStatus: "pending" | "reviewed" | "requires-clinician";
  latencyMs: number;
}

export interface AITaskInput {
  // Bounded payload to keep calls small and safe.
  text?: string;
  maxChars?: number;
}

export interface AIUnavailable {
  unavailable: true;
  reason: "no-credentials" | "not-approved" | "provider-error" | "timeout";
  message: string;
}

export type AIResponse<T = unknown> =
  | { kind: "ok"; result: AIResult<T> }
  | { kind: "unavailable"; error: AIUnavailable };

// Tasks the adapter is approved to route. No clinical scoring or diagnosis.
export type AITask =
  | { kind: "speech-transcribe"; audioBytes: number; language?: string }
  | { kind: "text-summarize"; text: string }
  | { kind: "text-classify"; text: string; labels: string[] };

export const DEFAULT_MODELS: Record<AIModelKind, AIModelConfig> = {
  speech: { provider: "grok", model: "grok-1", version: "1" },
  text: { provider: "gemini", model: "gemini-1.5-flash", version: "1.5" },
  auto: { provider: "gemini", model: "gemini-1.5-flash", version: "1.5" },
};
