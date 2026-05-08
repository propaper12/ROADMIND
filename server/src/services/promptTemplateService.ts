import type { V2ProjectInput } from "../schemas/projectInputSchema.js";
import { getAgentById } from "./agentRegistryService.js";

export function buildSystemPromptV2(
  input: V2ProjectInput,
): string {
  const depthMap: Record<string, string> = {
    short: "Kısa ve öz özet",
    standard: "Standart detay seviyesi",
    detailed: "Detaylı açıklamalar",
    very_detailed: "Çok detaylı, kapsamlı açıklamalar",
  };

  const planModeInstructions: Record<string, string> = {
    plan_first: `
ÖNEMLİ - Plan Öncelikli Modu:
- Kod yazma veya dosya değiştirme, sadece plan oluştur.
- Önce repository'i incele.
- Detaylı implementasyon planı oluştur.
- Kullanıcı onayı almadan dosya değiştirme.
- Sonra aşama aşama implemente et.`,
    direct_build: `
- Repository'i önce incele.
- Yıkıcı değişikliklerden kaçın.
- Çalışan özellikleri koru.`,
  };

  const requirementInfluences = Object.entries(input.requirementToggles)
    .filter(([, value]) => value)
    .map(([key]) => {
      const map: Record<string, string> = {
        authentication: "Kimlik doğrulama sistemi gerekli",
        adminPanel: "Admin paneli gerekli",
        database: "Veritabanı entegrasyonu gerekli",
        aiIntegration: "AI entegrasyonu gerekli",
        fileUpload: "Dosya yükleme sistemi gerekli",
        realtimeFeatures: "Realtime özellikler gerekli",
        paymentSubscription: "Ödeme/abonelik sistemi gerekli",
        notifications: "Bildirim sistemi gerekli",
        multiLanguage: "Çok dilli destek gerekli",
        offlineSupport: "Çevrimdışı destek gerekli",
        mobileResponsive: "Mobil uyumluluk gerekli",
        deploymentPlan: "Deployment planı detaylandırılmalı",
        testingPlan: "Test planı detaylandırılmalı",
        securityPlan: "Güvenlik planı detaylandırılmalı",
        analytics: "Analytics entegrasyonu gerekli",
      };
      return map[key] || key;
    })
    .join("\n- ");

  const agentInfo = input.codingAgent !== "auto" 
    ? getAgentById(input.codingAgent) 
    : null;

  return `You are a senior software architect.
Your task is to convert a project idea into a practical technical roadmap.
Return ONLY valid JSON matching the schema. No Markdown, no code fences.

DEPTH: ${depthMap[input.outputDepth] || depthMap.detailed}
PLAN MODE: ${planModeInstructions[input.planMode] || planModeInstructions.plan_first}

RULES:
- Realistic technical recommendations.
- MVP-first architecture.
- Local-first, open-source preferred.
- Roadmaps must fit the requested weeks.

REQUIRED JSON KEYS:
- schemaVersion: Must be "2.0".
- projectSummary: Concise string.
- problemDefinition: Core problem string.
- assumptions: string[]
- targetUsers: {name, description}[]
- recommendedStack: {frontend, backend, database, ai, deployment, testing, styling, orm} each as {technology, reason}.
- architectureOverview: High-level overview string.
- systemModules: {name, responsibility, inputs, outputs}[]
- uiPagePlan: {name, route, description, components}[]
- databaseSchema: {tableName, purpose, columns: {name, type, constraints}}[]
- apiEndpoints: {method, path, description}[]
- implementationRoadmap: {week, title, tasks, deliverable}[]
- taskBreakdown: {phase, title, description, priority}[]
- acceptanceCriteria: {description, priority}[]
- risks: {risk, impact, solution}[]
- futureImprovements: string[]`;
}

export function buildUserPromptV2(
  input: V2ProjectInput,
): string {
  const payload: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    targetPlatform: input.targetPlatform,
    codingAgent: input.codingAgent,
    projectMaturity: input.projectMaturity,
    outputMode: input.outputMode,
    planMode: input.planMode,
    outputDepth: input.outputDepth,
    preferredTechnologies: input.preferredTechnologies ?? null,
    roadmapDurationWeeks: input.roadmapDurationWeeks,
    difficultyLevel: input.difficultyLevel,
    priority: input.priority,
    programmingLanguage: input.programmingLanguage,
    runtime: input.runtime,
    packageManager: input.packageManager,
    frontendFramework: input.frontendFramework,
    backendFramework: input.backendFramework,
    database: input.database,
    orm: input.orm,
    uiStyling: input.uiStyling,
    testing: input.testing,
    deployment: input.deployment,
    requirementToggles: input.requirementToggles,
    customInstructions: input.customInstructions ?? null,
  };

  return [
    "Project Payload:",
    JSON.stringify(payload, null, 2),
    "",
    "Generate the roadmap JSON now.",
  ].join("\n");
}

export function buildRepairParsePromptV2(brokenOutput: string): string {
  return [
    "Your previous response was not valid JSON.",
    "Return ONLY corrected JSON that matches the schema exactly.",
    "No Markdown. No code fences. No explanations.",
    "Ensure all required fields are present with correct types.",
    "",
    "Invalid output:",
    brokenOutput,
  ].join("\n");
}

export function buildRepairValidationPromptV2(
  parsedJson: string,
  validationIssues: string,
): string {
  return [
    "Your previous JSON failed validation.",
    "Return ONLY a complete corrected JSON object that matches the schema exactly.",
    "No Markdown. No code fences. No explanations.",
    "Fix these validation issues:",
    "",
    validationIssues,
    "",
    "Previous JSON:",
    parsedJson,
  ].join("\n");
}
