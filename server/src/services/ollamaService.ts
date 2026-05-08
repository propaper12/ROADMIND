import { ApiError } from "../utils/ApiError.js";
import type { ResolvedProvider } from "./aiProviderService.js";

export interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaChatResponse {
  message?: { role: string; content?: string };
  error?: string;
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

function looksLikeModelMissing(body: string, status: number): boolean {
  const lower = body.toLowerCase();
  const modelIssue =
    lower.includes("model") &&
    (lower.includes("not found") ||
      lower.includes("does not exist") ||
      lower.includes("pull"));
  return (
    status === 404 ||
    modelIssue ||
    lower.includes("unknown model")
  );
}

export async function chat(
  messages: OllamaChatMessage[],
  options: {
    baseUrl: string;
    model: string;
    apiKey?: string;
  },
): Promise<{ rawText: string }> {
  const url = `${options.baseUrl}/api/chat`;
  const body = {
    model: options.model,
    stream: false,
    messages,
    format: "json",
    options: {
      temperature: 0.2,
    },
  };

  let res: Response;
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (options.apiKey) headers["Authorization"] = `Bearer ${options.apiKey}`;
    res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  } catch (err) {
    if (isConnectionError(err)) {
      throw new ApiError(
        503,
        "AI_PROVIDER_DOWN",
        "AI sağlayıcısına ulaşılamadı. Lütfen bağlantıyı kontrol edin.",
      );
    }
    throw new ApiError(
      500,
      "INTERNAL_ERROR",
      "Failed to communicate with the AI provider.",
      err,
    );
  }

  const text = await res.text();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new ApiError(
        502,
        "AI_AUTH_FAILED",
        "Ollama Cloud kimlik doğrulaması başarısız. API anahtarını kontrol edin.",
      );
    }
    if (looksLikeModelMissing(text, res.status)) {
      throw new ApiError(
        503,
        "AI_MODEL_MISSING",
        `Seçili model "${options.model}" bulunamadı. Model listesini yenileyin veya başka bir model seçin.`,
      );
    }
    throw new ApiError(
      502,
      "INTERNAL_ERROR",
      text || `AI provider request failed with status ${res.status}`,
    );
  }

  let parsed: OllamaChatResponse;
  try {
    parsed = JSON.parse(text) as OllamaChatResponse;
  } catch {
    throw new ApiError(
      502,
      "INTERNAL_ERROR",
      "AI provider returned a non-JSON response.",
    );
  }

  if (parsed.error) {
    const errLower = parsed.error.toLowerCase();
    if (
      errLower.includes("model") &&
      (errLower.includes("not found") || errLower.includes("pull"))
    ) {
      throw new ApiError(
        503,
        "AI_MODEL_MISSING",
        `Seçili model "${options.model}" bulunamadı. Model listesini yenileyin veya başka bir model seçin.`,
      );
    }
    throw new ApiError(502, "INTERNAL_ERROR", parsed.error);
  }

  const content = parsed.message?.content;
  if (!content || typeof content !== "string") {
    throw new ApiError(
      502,
      "INTERNAL_ERROR",
      "AI provider returned an empty assistant message.",
    );
  }

  return { rawText: content };
}

export function buildUserPrompt(projectPayload: Record<string, unknown>): string {
  return [
    "Project idea and preferences (JSON):",
    JSON.stringify(projectPayload, null, 2),
    "",
    "Produce the roadmap JSON now.",
  ].join("\n");
}

export function buildRepairParsePrompt(brokenOutput: string): string {
  return [
    "Your previous response was not valid JSON.",
    "Return ONLY corrected JSON that matches the schema exactly.",
    "No Markdown. No code fences. No explanations.",
    "",
    "Invalid output:",
    brokenOutput,
  ].join("\n");
}

export function buildRepairValidationPrompt(
  parsedJson: string,
  validationIssues: string,
): string {
  return [
    "Your previous JSON failed validation.",
    "Return ONLY a complete corrected JSON object that matches the schema exactly.",
    "No Markdown. No code fences. No explanations.",
    "",
    "Validation issues:",
    validationIssues,
    "",
    "Previous JSON:",
    parsedJson,
  ].join("\n");
}

export async function generateRoadmapFromProject(
  systemPrompt: string,
  projectPayload: Record<string, unknown>,
  providerCfg: ResolvedProvider,
  model: string,
): Promise<{ rawText: string }> {
  const messages: OllamaChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: buildUserPrompt(projectPayload) },
  ];
  return chat(messages, {
    baseUrl: providerCfg.baseUrl,
    model,
    apiKey: providerCfg.apiKey,
  });
}

export async function repairInvalidJson(
  systemPrompt: string,
  projectPayload: Record<string, unknown>,
  brokenOutput: string,
  providerCfg: ResolvedProvider,
  model: string,
): Promise<{ rawText: string }> {
  const messages: OllamaChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: buildUserPrompt(projectPayload) },
    { role: "assistant", content: brokenOutput },
    { role: "user", content: buildRepairParsePrompt(brokenOutput) },
  ];
  return chat(messages, {
    baseUrl: providerCfg.baseUrl,
    model,
    apiKey: providerCfg.apiKey,
  });
}

export async function repairValidationFailure(
  systemPrompt: string,
  projectPayload: Record<string, unknown>,
  previousAssistantJson: string,
  validationIssues: string,
  providerCfg: ResolvedProvider,
  model: string,
): Promise<{ rawText: string }> {
  const messages: OllamaChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: buildUserPrompt(projectPayload) },
    { role: "assistant", content: previousAssistantJson },
    {
      role: "user",
      content: buildRepairValidationPrompt(previousAssistantJson, validationIssues),
    },
  ];
  return chat(messages, {
    baseUrl: providerCfg.baseUrl,
    model,
    apiKey: providerCfg.apiKey,
  });
}
