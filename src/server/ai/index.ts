// AI module index — NeurAI
export { runAI, unavailable } from "@/server/ai/adapter";
export { isAIConfigured } from "@/server/ai/router";
export type {
  AIResponse,
  AIResult,
  AIUnavailable,
  AIProvider,
  AIModelConfig,
  AITask,
} from "@/server/ai/types";
