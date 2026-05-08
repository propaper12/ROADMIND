import { env } from "../config/env.js";

const CLOUD_MODEL_PRIORITY = [
  { name: "glm-5.1", tags: ["coding", "structured", "strong"] },
  { name: "qwen3-coder-next", tags: ["coding", "structured", "strong"] },
  { name: "deepseek-v4-pro", tags: ["reasoning", "structured", "strong"] },
  { name: "deepseek-v4-flash", tags: ["reasoning", "structured"] },
  { name: "gemma4", tags: ["coding", "structured"] },
  { name: "qwen3.5", tags: ["coding", "structured"] },
  { name: "kimi-k2.5", tags: ["coding", "structured"] },
  { name: "minimax-m2.5", tags: ["coding", "structured"] },
  { name: "gpt-oss:120b", tags: ["coding", "structured", "strong"] },
  { name: "gpt-oss:120b-cloud", tags: ["coding", "structured", "strong"] },
];

export interface ModelInfo {
  name: string;
  size?: number;
  parameter?: string;
  modified_at?: string;
  tags?: string[];
}

export interface ModelListResult {
  provider: "cloud" | "local";
  models: ModelInfo[];
  recommended?: string;
  error?: string;
}

async function fetchModelList(
  baseUrl: string,
  apiKey?: string,
): Promise<{ models: ModelInfo[]; error?: string }> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await fetch(`${baseUrl}/api/tags`, { headers });
    if (!res.ok) {
      return {
        models: [],
        error: `API hatası: ${res.status}`,
      };
    }
    const data = (await res.json()) as { models?: Array<{
      name: string;
      size?: number;
      parameter_size?: string;
      modified_at?: string;
    }> };
    const models: ModelInfo[] =
      data.models?.map((m) => ({
        name: m.name,
        size: m.size,
        parameter: m.parameter_size,
        modified_at: m.modified_at,
      })) ?? [];
    return { models };
  } catch (err) {
    return {
      models: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function selectCloudModel(available: ModelInfo[]): string | undefined {
  const names = available.map((m) => m.name);
  const recommendedPriority = [
    env.OLLAMA_CLOUD_MODEL,
    env.OLLAMA_MODEL,
    "auto",
  ];

  for (const pref of recommendedPriority) {
    if (!pref || pref === "auto") continue;
    if (names.includes(pref)) return pref;
  }

  for (const candidate of CLOUD_MODEL_PRIORITY) {
    if (names.includes(candidate.name)) return candidate.name;
  }
  return names[0];
}

export function selectLocalModel(available: ModelInfo[]): string | undefined {
  const names = available.map((m) => m.name);
  const recommendedPriority = [
    env.OLLAMA_LOCAL_MODEL,
    env.OLLAMA_MODEL,
    "auto",
  ];

  for (const pref of recommendedPriority) {
    if (!pref || pref === "auto") continue;
    if (names.includes(pref)) return pref;
  }

  return names[0];
}

export async function listModels(
  provider: "cloud" | "local" | "auto",
): Promise<ModelListResult> {
  if (provider === "cloud" || provider === "auto") {
    if (env.OLLAMA_API_KEY) {
      const cloud = await fetchModelList(
        env.OLLAMA_CLOUD_BASE_URL,
        env.OLLAMA_API_KEY,
      );
      if (!cloud.error) {
        return {
          provider: "cloud",
          models: cloud.models,
          recommended: selectCloudModel(cloud.models),
        };
      }
      if (provider === "cloud") {
        return { provider: "cloud", models: [], error: cloud.error };
      }
    }
  }

  if (provider === "local" || provider === "auto") {
    const local = await fetchModelList(env.OLLAMA_LOCAL_BASE_URL);
    if (!local.error) {
      return {
        provider: "local",
        models: local.models,
        recommended: selectLocalModel(local.models),
      };
    }
    if (provider === "local") {
      return { provider: "local", models: [], error: local.error };
    }
  }

  // Auto: cloud key missing or both failed
  return {
    provider: provider === "auto" ? "local" : provider,
    models: [],
    recommended: undefined,
    error: "Model listesi alınamadı.",
  };
}

export function resolveModel(
  provider: "cloud" | "local",
  modelInput: string,
  availableModels: ModelInfo[],
): string {
  if (modelInput && modelInput !== "auto") {
    const names = availableModels.map((m) => m.name);
    if (names.includes(modelInput)) return modelInput;
  }

  if (provider === "cloud") {
    return selectCloudModel(availableModels) ?? env.OLLAMA_CLOUD_MODEL ?? "qwen2.5-coder:1.5b";
  }
  return selectLocalModel(availableModels) ?? env.OLLAMA_LOCAL_MODEL ?? "qwen2.5-coder:1.5b";
}
