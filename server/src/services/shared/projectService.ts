import type { Analysis, Project } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export type ProjectWithAnalysis = Project & {
  analysis?: V2AnalysisApiShape | null;
};

export type V2AnalysisApiShape = Record<string, unknown> & {
  id: string;
  modelName: string;
  provider?: string | null;
  createdAt: Date;
};

export async function listProjects(): Promise<ProjectWithAnalysis[]> {
  const rows = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { analysis: true },
  });

  return rows.map((project) => ({
    ...project,
    analysis: project.analysis ? analysisToV2Api(project.analysis) : null,
  }));
}

export async function getProjectById(id: string): Promise<ProjectWithAnalysis> {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { analysis: true },
  });

  if (!project) {
    throw new ApiError(404, "NOT_FOUND", "Proje bulunamadı.");
  }

  return {
    ...project,
    analysis: project.analysis ? analysisToV2Api(project.analysis) : null,
  };
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await prisma.project.delete({ where: { id } });
  } catch {
    throw new ApiError(404, "NOT_FOUND", "Proje bulunamadı.");
  }
}

export async function getAnalysisForExport(id: string): Promise<{
  project: Project;
  analysis: Analysis;
  ai: Record<string, unknown>;
}> {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { analysis: true },
  });

  if (!project?.analysis) {
    throw new ApiError(404, "NOT_FOUND", "Proje bulunamadı veya analiz mevcut değil.");
  }

  return {
    project,
    analysis: project.analysis,
    ai: analysisToV2Api(project.analysis) as unknown as Record<string, unknown>,
  };
}

export function analysisToV2Api(row: Analysis): V2AnalysisApiShape {
  try {
    const rawJson = row.rawAiResponseJson;
    const parsed = JSON.parse(rawJson);
    
    return {
      ...parsed,
      id: row.id,
      modelName: row.modelName,
      provider: row.provider,
      createdAt: row.createdAt,
    };
  } catch {
    // Fallback: build from individual fields
    return {
      id: row.id,
      modelName: row.modelName,
      provider: row.provider,
      createdAt: row.createdAt,
      schemaVersion: "1.0",
      projectSummary: row.projectSummary,
      problemDefinition: row.problemDefinition,
      assumptions: safeParse(row.assumptions) || [],
      missingInformationQuestions: safeParse(row.missingInformationQuestions) || [],
      platformRecommendation: safeParse(row.platformRecommendation),
      codingAgentRecommendation: safeParse(row.codingAgentRecommendation),
      recommendedStack: safeParse(row.recommendedStackJson) || {},
      architectureOverview: row.architectureOverview || "",
      systemModules: safeParse(row.systemModulesJson) || [],
      uiPagePlan: safeParse(row.uiPagePlanJson) || [],
      databaseSchema: safeParse(row.databaseSchemaJson) || [],
      apiEndpoints: safeParse(row.apiEndpointsJson) || [],
      implementationRoadmap: safeParse(row.developmentRoadmapJson) || [],
      risks: safeParse(row.risksJson) || [],
      futureImprovements: safeParse(row.futureImprovementsJson) || [],
    } as unknown as V2AnalysisApiShape;
  }
}

function safeParse<T>(json: string | null): T | undefined {
  if (!json) return undefined;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length === 0) return undefined;
    if (typeof parsed === "object" && Object.keys(parsed).length === 0) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}
