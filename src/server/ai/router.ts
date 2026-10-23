// AI provider selection — NeurAI
//
// Automatic model switching based on task requirement. No provider is called
// directly from the browser; all routing happens here, server-side.
// Until credentials and governance are approved, the adapter returns an
// explicit AI-unavailable state rather than fabricating output.

import {
  AIProvider,
  AIResponse,
  AIUnavailable,
  DEFAULT_MODELS,
  type AITask,
} from "@/server/ai/types";

export function selectModel(task: AITask): AIProvider {
  switch (task.kind) {
    case "speech-transcribe":
      return DEFAULT_MODELS.speech.provider;
    case "text-summarize":
    case "text-classify":
      return DEFAULT_MODELS.text.provider;
    default:
      return DEFAULT_MODELS.auto.provider;
  }
}

export function isAIConfigured(): boolean {
  const gemini = Boolean(process.env.GEMINI_API_KEY);
  const grok = Boolean(process.env.GROK_API_KEY);
  return gemini || grok;
}

export function unavailable(reason: AIUnavailable["reason"], message: string): AIResponse<never> {
  return {
    kind: "unavailable",
    error: { unavailable: true, reason, message },
  };
}
