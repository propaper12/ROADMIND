import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export type ProviderMode = "cloud" | "local" | "auto";

export interface ResolvedProvider {
  provider: "cloud" | "local";
  baseUrl: string;
  apiKey?: string;
}

function isConnectionError(err: unknown): boolean {
  const code =
    err && typeof err === "object" && "cause" in err
      ? (err as { cause?: { code?: string } }).cause?.code
      : undefined;
  const msg = err instanceof Error ? err.message : String(err);
  return (
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    msg.includes("fetch failed") ||
    msg.includes("ECONNREFUSED")
  );
}

async function checkReachable(url: string, apiKey?: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await fetch(`${url}/api/tags`, { headers });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function resolveProvider(forced?: ProviderMode): Promise<ResolvedProvider> {
  const mode = forced ?? env.AI_PROVIDER;

  if (mode === "cloud") {
    if (!env.OLLAMA_API_KEY) {
      throw new ApiError(
        503,
        "AI_CLOUD_KEY_MISSING",
        "Ollama Cloud API anahtarı bulunamadı. Sunucu .env dosyasına OLLAMA_API_KEY ekleyin.",
      );
    }
    const reachable = await checkReachable(env.OLLAMA_CLOUD_BASE_URL, env.OLLAMA_API_KEY);
    if (!reachable) {
      throw new ApiError(
        503,
        "AI_PROVIDER_DOWN",
        "Ollama Cloud API'ye ulaşılamadı.",
      );
    }
    return {
      provider: "cloud",
      baseUrl: env.OLLAMA_CLOUD_BASE_URL,
      apiKey: env.OLLAMA_API_KEY,
    };
  }

  if (mode === "local") {
    const reachable = await checkReachable(env.OLLAMA_LOCAL_BASE_URL);
    if (!reachable) {
      throw new ApiError(
        503,
        "AI_PROVIDER_DOWN",
        "Yerel Ollama çalışmıyor. Lütfen Ollama servisini başlatın veya Ollama Cloud sağlayıcısını seçin.",
      );
    }
    return { provider: "local", baseUrl: env.OLLAMA_LOCAL_BASE_URL };
  }

  // auto mode
  if (env.OLLAMA_API_KEY) {
    const cloudReachable = await checkReachable(env.OLLAMA_CLOUD_BASE_URL, env.OLLAMA_API_KEY);
    if (cloudReachable) {
      return {
        provider: "cloud",
        baseUrl: env.OLLAMA_CLOUD_BASE_URL,
        apiKey: env.OLLAMA_API_KEY,
      };
    }
  }

  const localReachable = await checkReachable(env.OLLAMA_LOCAL_BASE_URL);
  if (localReachable) {
    return { provider: "local", baseUrl: env.OLLAMA_LOCAL_BASE_URL };
  }

  throw new ApiError(
    503,
    "AI_PROVIDER_UNAVAILABLE",
    "Ne Cloud ne de Local Ollama kullanılabilir durumda.",
  );
}

export async function resolveModel(resolvedProvider: ResolvedProvider): Promise<string> {
  // For now, use the configured model or fallback. In practice we want to list models first.
  // This helper is used when we don't have a user-specified model.
  if (resolvedProvider.provider === "cloud") {
    return env.OLLAMA_CLOUD_MODEL && env.OLLAMA_CLOUD_MODEL !== "auto"
      ? env.OLLAMA_CLOUD_MODEL
      : "qwen2.5-coder:1.5b";
  }
  return env.OLLAMA_LOCAL_MODEL && env.OLLAMA_LOCAL_MODEL !== "auto"
    ? env.OLLAMA_LOCAL_MODEL
    : "qwen2.5-coder:1.5b";
}

export function buildChatUrl(baseUrl: string): string {
  return `${baseUrl}/api/chat`;
}
