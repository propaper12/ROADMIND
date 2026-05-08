import { env } from "../config/env.js";
import { ApiError, isApiError } from "../utils/ApiError.js";

export type ProviderMode = "cloud" | "local" | "auto";

export interface ProviderStatus {
  provider: ProviderMode;
  resolvedProvider: "cloud" | "local";
  baseUrl: string;
  model: string;
  reachable: boolean;
  authenticated?: boolean;
  error?: string;
  lastChecked: string;
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

async function fetchText(
  url: string,
  apiKey?: string,
): Promise<{ ok: boolean; status: number; body: string; error?: string }> {
  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await fetch(url, { headers });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    if (isConnectionError(err)) {
      return { ok: false, status: 0, body: "", error: "Connection refused" };
    }
    return {
      ok: false,
      status: 0,
      body: "",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function testCloud(): Promise<{
  reachable: boolean;
  authenticated?: boolean;
  error?: string;
}> {
  if (!env.OLLAMA_API_KEY) {
    return {
      reachable: false,
      authenticated: false,
      error:
        "Ollama Cloud API anahtarı bulunamadı. Sunucu .env dosyasına OLLAMA_API_KEY ekleyin.",
    };
  }
  const result = await fetchText(
    `${env.OLLAMA_CLOUD_BASE_URL}/api/tags`,
    env.OLLAMA_API_KEY,
  );
  if (!result.ok) {
    if (result.status === 401 || result.status === 403) {
      return {
        reachable: false,
        authenticated: false,
        error: "Ollama Cloud kimlik doğrulaması başarısız. API anahtarını kontrol edin.",
      };
    }
    if (!result.status || result.error?.includes("Connection refused")) {
      return {
        reachable: false,
        authenticated: undefined,
        error:
          "Ollama Cloud API'ye ulaşılamadı. İnternet bağlantısını veya servis durumunu kontrol edin.",
      };
    }
    return {
      reachable: false,
      authenticated: undefined,
      error: `Cloud API hatası: ${result.status}`,
    };
  }
  return { reachable: true, authenticated: true };
}

async function testLocal(): Promise<{
  reachable: boolean;
  error?: string;
}> {
  const result = await fetchText(`${env.OLLAMA_LOCAL_BASE_URL}/api/tags`);
  if (!result.ok) {
    return {
      reachable: false,
      error:
        "Yerel Ollama çalışmıyor. Lütfen Ollama servisini başlatın veya Ollama Cloud sağlayıcısını seçin.",
    };
  }
  return { reachable: true };
}

export async function resolveProvider(
  forced?: ProviderMode,
): Promise<{ provider: "cloud" | "local"; baseUrl: string; apiKey?: string }> {
  const mode = forced ?? env.AI_PROVIDER;

  if (mode === "cloud") {
    if (!env.OLLAMA_API_KEY) {
      throw new ApiError(
        503,
        "AI_CLOUD_KEY_MISSING",
        "Ollama Cloud API anahtarı bulunamadı.",
      );
    }
    return {
      provider: "cloud",
      baseUrl: env.OLLAMA_CLOUD_BASE_URL,
      apiKey: env.OLLAMA_API_KEY,
    };
  }

  if (mode === "local") {
    return { provider: "local", baseUrl: env.OLLAMA_LOCAL_BASE_URL };
  }

  // auto mode
  if (env.OLLAMA_API_KEY) {
    const cloudTest = await testCloud();
    if (cloudTest.reachable) {
      return {
        provider: "cloud",
        baseUrl: env.OLLAMA_CLOUD_BASE_URL,
        apiKey: env.OLLAMA_API_KEY,
      };
    }
  }

  const localTest = await testLocal();
  if (localTest.reachable) {
    return { provider: "local", baseUrl: env.OLLAMA_LOCAL_BASE_URL };
  }

  throw new ApiError(
    503,
    "AI_PROVIDER_UNAVAILABLE",
    "Ne Cloud ne de Local Ollama kullanılabilir durumda.",
  );
}

export async function testProvider(
  provider: ProviderMode,
  model?: string,
): Promise<ProviderStatus> {
  let resolved: "cloud" | "local";
  let baseUrl: string;
  let apiKey: string | undefined;
  let error: string | undefined;
  let reachable = false;
  let authenticated: boolean | undefined;

  try {
    const cfg = await resolveProvider(
      provider === "auto" ? undefined : provider,
    );
    resolved = cfg.provider;
    baseUrl = cfg.baseUrl;
    apiKey = cfg.apiKey;
  } catch (err) {
    if (isApiError(err) && err.code === "AI_CLOUD_KEY_MISSING") {
      return {
        provider,
        resolvedProvider: "cloud",
        baseUrl: env.OLLAMA_CLOUD_BASE_URL,
        model: model ?? "auto",
        reachable: false,
        authenticated: false,
        error: err.message,
        lastChecked: new Date().toISOString(),
      };
    }
    return {
      provider,
      resolvedProvider: provider === "auto" ? "local" : provider,
      baseUrl: env.OLLAMA_LOCAL_BASE_URL,
      model: model ?? "auto",
      reachable: false,
      error: err instanceof Error ? err.message : String(err),
      lastChecked: new Date().toISOString(),
    };
  }

  if (resolved === "cloud") {
    const cloud = await testCloud();
    reachable = cloud.reachable;
    authenticated = cloud.authenticated;
    error = cloud.error;
  } else {
    const local = await testLocal();
    reachable = local.reachable;
    error = local.error;
  }

  return {
    provider,
    resolvedProvider: resolved,
    baseUrl,
    model: model ?? "auto",
    reachable,
    authenticated,
    error,
    lastChecked: new Date().toISOString(),
  };
}
