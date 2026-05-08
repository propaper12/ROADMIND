import dotenv from "dotenv";

dotenv.config();

function optional(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

function required(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v.trim();
}

function asProvider(v: string | undefined): "cloud" | "local" | "auto" {
  if (v === "cloud" || v === "local" || v === "auto") return v;
  return "auto";
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? "3001"),
  DATABASE_URL: required("DATABASE_URL"),

  AI_PROVIDER: asProvider(optional("AI_PROVIDER")),

  OLLAMA_LOCAL_BASE_URL: (optional("OLLAMA_LOCAL_BASE_URL") ?? "http://localhost:11434").replace(/\/$/, ""),
  OLLAMA_CLOUD_BASE_URL: (optional("OLLAMA_CLOUD_BASE_URL") ?? "https://ollama.com").replace(/\/$/, ""),

  OLLAMA_MODEL: optional("OLLAMA_MODEL") ?? "auto",
  OLLAMA_CLOUD_MODEL: optional("OLLAMA_CLOUD_MODEL") ?? "auto",
  OLLAMA_LOCAL_MODEL: optional("OLLAMA_LOCAL_MODEL") ?? "qwen2.5-coder:1.5b",

  OLLAMA_API_KEY: optional("OLLAMA_API_KEY"),

  // Deprecated v1 aliases for backward compatibility inside services
  AI_BASE_URL: (optional("OLLAMA_LOCAL_BASE_URL") ?? "http://localhost:11434").replace(/\/$/, ""),
  AI_API_KEY: optional("OLLAMA_API_KEY") ?? "",
  AI_MODEL: optional("OLLAMA_LOCAL_MODEL") ?? "qwen2.5-coder:1.5b",
};
