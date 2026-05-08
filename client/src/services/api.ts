import axios, { AxiosError } from "axios";
import type { ProjectAnalyzeInput, ProjectListItem, ProjectWithAnalysis } from "../types/project.js";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/\$/, "") ??
  "http://localhost:3001";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ error?: string; message?: string; code?: string }>;
    const data = ax.response?.data;
    if (data && typeof data === "object" && typeof data.error === "string") {
      return data.error;
    }
    if (ax.message) return ax.message;
  }
  if (err instanceof Error) return err.message;
  return "Beklenmedik hata.";
}

export function getApiErrorCode(err: unknown): string | null {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ error?: string; message?: string; code?: string }>;
    const data = ax.response?.data;
    if (data && typeof data === "object" && typeof data.code === "string") {
      return data.code;
    }
  }
  return null;
}

export async function analyzeProject(
  input: ProjectAnalyzeInput,
): Promise<ProjectWithAnalysis> {
  const { data } = await api.post<ProjectWithAnalysis>(
    "/api/projects/analyze",
    input,
  );
  return data;
}

export async function getProjects(): Promise<ProjectListItem[]> {
  const { data } = await api.get<ProjectListItem[]>("/api/projects");
  return data;
}

export async function getProject(id: string): Promise<ProjectWithAnalysis> {
  const { data } = await api.get<ProjectWithAnalysis>(`/api/projects/${id}`);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/api/projects/${id}`);
}

export async function regeneratePrompt(
  id: string,
  payload: { customInstructions?: string; enabledSections?: string[] },
): Promise<ProjectWithAnalysis> {
  const { data } = await api.post<ProjectWithAnalysis>(`/api/projects/${id}/regenerate-prompt`, payload);
  return data;
}

export async function patchPromptDraft(
  id: string,
  draft: Record<string, unknown>,
): Promise<void> {
  await api.patch(`/api/projects/${id}/prompt-draft`, { draft });
}

export async function finalizePrompt(
  id: string,
  enabledSections?: string[],
): Promise<ProjectWithAnalysis> {
  const { data } = await api.post<ProjectWithAnalysis>(`/api/projects/${id}/finalize-prompt`, { enabledSections });
  return data;
}

export async function getModels(provider: string): Promise<{
  provider: string;
  models: Array<{ name: string; size?: number; parameter?: string }>;
  recommended?: string;
  error?: string;
}> {
  const { data } = await api.get(`/api/models?provider=${provider}`);
  return data;
}

export async function testProvider(
  provider: string,
  model?: string,
): Promise<{
  provider: string;
  resolvedProvider: string;
  baseUrl: string;
  model: string;
  reachable: boolean;
  authenticated?: boolean;
  error?: string;
  lastChecked: string;
}> {
  const { data } = await api.post("/api/ollama/test", { provider, model });
  return data;
}

export async function getHealth(): Promise<{
  status: string;
  version: string;
  providerMode: string;
  localBaseUrl: string;
  cloudBaseUrl: string;
  hasCloudKey: boolean;
}> {
  const { data } = await api.get("/api/health");
  return data;
}

export async function getOptions(): Promise<Record<string, Array<{ value: string; label: string }>>> {
  const { data } = await api.get("/api/options");
  return data;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportJson(id: string): Promise<void> {
  const res = await api.get<Blob>(`/api/projects/${id}/export/json`, {
    responseType: "blob",
  });
  triggerDownload(res.data, "roadmind-output.json");
}

export async function exportMarkdown(id: string): Promise<void> {
  const res = await api.get<Blob>(`/api/projects/${id}/export/markdown`, {
    responseType: "blob",
  });
  triggerDownload(res.data, "roadmind-technical-report.md");
}

export async function exportTxt(id: string): Promise<void> {
  const res = await api.get<Blob>(`/api/projects/${id}/export/txt`, {
    responseType: "blob",
  });
  triggerDownload(res.data, "roadmind-master-prompt.txt");
}

export async function exportAgentsMd(id: string): Promise<void> {
  const res = await api.get<Blob>(`/api/projects/${id}/export/agents-md`, {
    responseType: "blob",
  });
  triggerDownload(res.data, "AGENTS.md");
}


export async function exportAgentPrompt(id: string, agent: string): Promise<void> {
  const res = await api.get<Blob>(`/api/projects/${id}/export/prompt/${agent}`, {
    responseType: "blob",
  });
  const filenameMap: Record<string, string> = {
    cursor: "cursor-prompt.md",
    opencode: "AGENTS.md",
    openclaw: "openclaw-prompt.md",
    codex: "codex-AGENTS.md",
    windsurf: "windsurf-prompt.md",
    aider: "aider-conventions.md",
    continue: "continue-prompt.md",
    lovable_bolt_v0: "lovable-prompt.md",
    generic: "roadmind-master-prompt.md",
  };
  triggerDownload(res.data, filenameMap[agent] || "roadmind-prompt.md");
}
