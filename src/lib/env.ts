const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GEMINI_API_KEY",
  "GROK_API_KEY",
  "NEXTAUTH_SECRET",
];

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  const demo = process.env.DEMO_MODE !== "false";

  if (missing.length && !demo) {
    throw new Error(
      `Missing required environment variables: ${missing.join(
        ", "
      )}. Set them in .env (see .env.example) or enable DEMO_MODE=true for local demo.`,
    );
  }

  return {
    demo,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    grokApiKey: process.env.GROK_API_KEY,
  } as const;
}
