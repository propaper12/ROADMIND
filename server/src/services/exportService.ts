import type { AIOutputV2 } from "../schemas/aiOutputSchema.js";
import type { Analysis, Project } from "@prisma/client";
import { bulletList, escapeMarkdown } from "../utils/markdown.js";

function techBlock(label: string, tech?: { technology: string; reason: string }): string {
  if (!tech) return "";
  return [
    `### ${escapeMarkdown(label)}`,
    "",
    `- **Teknoloji:** ${escapeMarkdown(tech.technology)}`,
    `- **Gerekçe:** ${escapeMarkdown(tech.reason)}`,
    "",
  ].join("\n");
}

export function buildMarkdownExportV2(
  project: Project,
  ai: AIOutputV2,
): string {
  const lines: string[] = [];
  lines.push("# Roadmind v2.0 Teknik Plan");
  lines.push("");
  lines.push(`**Proje:** ${escapeMarkdown(project.title)}`);
  lines.push(`**Platform:** ${escapeMarkdown(project.targetPlatform)}`);
  lines.push(`**AI Sağlayıcı:** ${escapeMarkdown(project.aiProvider || "auto")} · **Model:** ${escapeMarkdown(project.selectedModel || "auto")}`);
  if (project.codingAgent) lines.push(`**Coding Agent:** ${escapeMarkdown(project.codingAgent)}`);
  lines.push(`**Plan Modu:** ${escapeMarkdown(project.planMode || "plan_first")} · **Çıktı Modu:** ${escapeMarkdown(project.outputMode || "full_project_plan")}`);
  lines.push("");
  lines.push(`---`);
  lines.push("");

  // 1. Project Information
  lines.push("## 1. Proje Bilgileri");
  lines.push("");
  lines.push(`- **Başlık:** ${escapeMarkdown(project.title)}`);
  lines.push(`- **Açıklama:** ${escapeMarkdown(project.description)}`);
  lines.push(`- **Olgunluk:** ${escapeMarkdown(project.projectMaturity || "just_idea")}`);
  lines.push(`- **Talep Edilen Süre:** ${project.roadmapDurationWeeks} hafta`);
  lines.push("");

  // 2. AI Provider
  lines.push("## 2. AI Sağlayıcı ve Model");
  lines.push("");
  lines.push(`- **Sağlayıcı:** ${escapeMarkdown(project.aiProvider || "auto")}`);
  lines.push(`- **Model:** ${escapeMarkdown(project.selectedModel || "auto")}`);
  if (project.providerFallbackInfo) lines.push(`- **Fallback:** ${escapeMarkdown(project.providerFallbackInfo)}`);
  lines.push("");

  // 3-6. Core Analysis
  lines.push("## 3. Proje Özeti");
  lines.push("");
  lines.push(escapeMarkdown(ai.projectSummary || ""));
  lines.push("");

  lines.push("## 4. Problem Tanımı");
  lines.push("");
  lines.push(escapeMarkdown(ai.problemDefinition || ""));
  lines.push("");

  if (ai.assumptions?.length) {
    lines.push("## 5. Varsayımlar");
    lines.push("");
    lines.push(bulletList(ai.assumptions));
    lines.push("");
  }

  if (ai.missingInformationQuestions?.length) {
    lines.push("## 6. Eksik Bilgi Soruları");
    lines.push("");
    lines.push(bulletList(ai.missingInformationQuestions));
    lines.push("");
  }

  // 7. Target Users
  if (ai.targetUsers?.length) {
    lines.push("## 7. Hedef Kullanıcılar");
    lines.push("");
    for (const u of ai.targetUsers) {
      lines.push(`- **${escapeMarkdown(u.name)}:** ${escapeMarkdown(u.description)}`);
    }
    lines.push("");
  }

  // 8. Platform Recommendation
  if (ai.platformRecommendation) {
    lines.push("## 8. Platform Önerisi");
    lines.push("");
    lines.push(`- **Platform:** ${escapeMarkdown(ai.platformRecommendation.platform)}`);
    lines.push(`- **Gerekçe:** ${escapeMarkdown(ai.platformRecommendation.reason)}`);
    if (ai.platformRecommendation.alternative) {
      lines.push(`- **Alternatif:** ${escapeMarkdown(ai.platformRecommendation.alternative)}`);
    }
    lines.push("");
  }

  // 9. Coding Agent
  if (ai.codingAgentRecommendation) {
    lines.push("## 9. Coding Agent Önerisi");
    lines.push("");
    lines.push(`- **Agent:** ${escapeMarkdown(ai.codingAgentRecommendation.agent)}`);
    lines.push(`- **Gerekçe:** ${escapeMarkdown(ai.codingAgentRecommendation.reason)}`);
    lines.push("");
  }

  // 10. Stack
  if (ai.recommendedStack) {
    lines.push("## 10. Teknoloji Yığını");
    lines.push("");
    const stack = ai.recommendedStack;
    const parts: string[] = [];
    if (stack.frontend) parts.push(techBlock("Frontend", stack.frontend));
    if (stack.backend) parts.push(techBlock("Backend", stack.backend));
    if (stack.database) parts.push(techBlock("Veritabanı", stack.database));
    if (stack.ai) parts.push(techBlock("AI", stack.ai));
    if (stack.styling) parts.push(techBlock("Styling", stack.styling));
    if (stack.orm) parts.push(techBlock("ORM", stack.orm));
    if (stack.testing) parts.push(techBlock("Testing", stack.testing));
    if (stack.deployment) parts.push(techBlock("Deployment", stack.deployment));
    lines.push(parts.join(""));
    lines.push("");
  }

  // Recommendation details
  const recommendations: { title: string; data: Record<string, string> | undefined }[] = [
    { title: "Programlama Dili", data: ai.languageRecommendation as unknown as Record<string, string> },
    { title: "Runtime", data: ai.runtimeRecommendation as unknown as Record<string, string> },
    { title: "Package Manager", data: ai.packageManagerRecommendation as unknown as Record<string, string> },
    { title: "Frontend Framework", data: ai.frontendFrameworkRecommendation as unknown as Record<string, string> },
    { title: "Backend Framework", data: ai.backendFrameworkRecommendation as unknown as Record<string, string> },
    { title: "ORM", data: ai.ormRecommendation as unknown as Record<string, string> },
    { title: "UI/Styling", data: ai.uiStylingRecommendation as unknown as Record<string, string> },
    { title: "Testing", data: ai.testingRecommendation as unknown as Record<string, string> },
    { title: "Deployment", data: ai.deploymentRecommendation as unknown as Record<string, string> },
  ];

  for (const rec of recommendations) {
    if (rec.data && typeof rec.data === "object") {
      lines.push(`### ${rec.title}`);
      lines.push("");
      const data = rec.data;
      const tech = data.technology || data.framework || data.styling || data.testing || 
                   data.deployment || data.database || data.orm || data.packageManager || 
                   data.runtime || data.language || "";
      const reason = data.reason || "";
      lines.push(`- **${escapeMarkdown(tech)}:** ${escapeMarkdown(reason)}`);
      lines.push("");
    }
  }

  // 11. Database Recommendation
  if (ai.databaseRecommendation) {
    lines.push("## 11. Veritabanı Önerisi");
    lines.push("");
    const db = ai.databaseRecommendation;
    lines.push(`- **Önerilen:** ${escapeMarkdown(db.database)}`);
    lines.push(`- **Gerekçe:** ${escapeMarkdown(db.reason)}`);
    if (db.mvpDatabase) lines.push(`- **MVP:** ${escapeMarkdown(db.mvpDatabase)}`);
    if (db.productionDatabase) lines.push(`- **Production:** ${escapeMarkdown(db.productionDatabase)}`);
    if (db.rejectedAlternatives?.length) {
      lines.push(`- **Reddedilen Alternatifler:** ${db.rejectedAlternatives.join(", ")}`);
    }
    if (db.migrationStrategy) lines.push(`- **Migration:** ${escapeMarkdown(db.migrationStrategy)}`);
    if (db.backupConsiderations) lines.push(`- **Backup:** ${escapeMarkdown(db.backupConsiderations)}`);
    if (db.offlineConsiderations) lines.push(`- **Offline:** ${escapeMarkdown(db.offlineConsiderations)}`);
    lines.push("");
  }

  // 12. Architecture
  if (ai.architectureOverview) {
    lines.push("## 12. Mimari Genel Bakış");
    lines.push("");
    lines.push(escapeMarkdown(ai.architectureOverview));
    lines.push("");
  }

  if (ai.systemModules?.length) {
    lines.push("### Sistem Modülleri");
    lines.push("");
    for (const m of ai.systemModules) {
      lines.push(`**${escapeMarkdown(m.name)}**`);
      lines.push(escapeMarkdown(m.responsibility));
      if (m.inputs?.length) lines.push(`- Girdiler: ${m.inputs.join(", ")}`);
      if (m.outputs?.length) lines.push(`- Çıktılar: ${m.outputs.join(", ")}`);
      lines.push("");
    }
  }

  // 13. UI Plan
  if (ai.uiPagePlan?.length) {
    lines.push("## 13. UI/Sayfa Planı");
    lines.push("");
    for (const page of ai.uiPagePlan) {
      lines.push(`### ${escapeMarkdown(page.name)}`);
      if (page.route) lines.push(`- **Route:** ${escapeMarkdown(page.route)}`);
      lines.push(`- **Açıklama:** ${escapeMarkdown(page.description)}`);
      if (page.components?.length) lines.push(`- **Bileşenler:** ${page.components.join(", ")}`);
      if (page.layout) lines.push(`- **Layout:** ${escapeMarkdown(page.layout)}`);
      lines.push("");
    }
  }

  // 14. API Design
  if (ai.apiEndpoints?.length) {
    lines.push("## 14. API Tasarımı");
    lines.push("");
    lines.push("| Metot | Yol | Açıklama | Auth |");
    lines.push("| --- | --- | --- | --- |");
    for (const e of ai.apiEndpoints) {
      lines.push(`| ${e.method} | ${escapeMarkdown(e.path)} | ${escapeMarkdown(e.description)} | ${e.authRequired ? "Evet" : "Hayır"} |`);
    }
    lines.push("");
  }

  // 15. Implementation Roadmap
  if (ai.implementationRoadmap?.length) {
    lines.push("## 15. İmplementasyon Yol Haritası");
    lines.push("");
    for (const w of ai.implementationRoadmap) {
      lines.push(`### ${w.week}. Hafta: ${escapeMarkdown(w.title)}`);
      lines.push("");
      lines.push(bulletList(w.tasks));
      lines.push("");
      lines.push(`**Teslimat:** ${escapeMarkdown(w.deliverable)}`);
      lines.push("");
    }
  }

  // 16. Task Breakdown
  if (ai.taskBreakdown?.length) {
    lines.push("## 16. Görev Ayrımı");
    lines.push("");
    for (const task of ai.taskBreakdown) {
      lines.push(`### ${escapeMarkdown(task.phase)}: ${escapeMarkdown(task.title)}`);
      lines.push(escapeMarkdown(task.description));
      if (task.estimatedHours) lines.push(`- **Tahmini Süre:** ${task.estimatedHours} saat`);
      lines.push(`- **Öncelik:** ${escapeMarkdown(task.priority)}`);
      lines.push("");
    }
  }

  // 17. Acceptance Criteria
  if (ai.acceptanceCriteria?.length) {
    lines.push("## 17. Kabul Kriterleri");
    lines.push("");
    for (const ac of ai.acceptanceCriteria) {
      lines.push(`${ac.id || ""}. ${escapeMarkdown(ac.description)}`);
      lines.push(`   - **Öncelik:** ${escapeMarkdown(ac.priority)}`);
      if (ac.verificationMethod) lines.push(`   - **Doğrulama:** ${escapeMarkdown(ac.verificationMethod)}`);
    }
    lines.push("");
  }

  // 18. Test Plan
  if (ai.testPlan?.length) {
    lines.push("## 18. Test Planı");
    lines.push("");
    lines.push("| Tip | Açıklama | Öncelik |");
    lines.push("| --- | --- | --- |");
    for (const test of ai.testPlan) {
      lines.push(`| ${test.type.toUpperCase()} | ${escapeMarkdown(test.description)} | ${escapeMarkdown(test.priority || "Must Have")} |`);
    }
    lines.push("");
  }

  // 19. Risks
  if (ai.risks?.length) {
    lines.push("## 19. Risk Analizi");
    lines.push("");
    lines.push("| Risk | Etki | Çözüm |");
    lines.push("| --- | --- | --- |");
    for (const r of ai.risks) {
      lines.push(`| ${escapeMarkdown(r.risk)} | ${escapeMarkdown(r.impact)} | ${escapeMarkdown(r.solution)} |`);
    }
    lines.push("");
  }

  // 20. Future Improvements
  if (ai.futureImprovements?.length) {
    lines.push("## 20. Gelecek Geliştirmeler");
    lines.push("");
    lines.push(bulletList(ai.futureImprovements));
    lines.push("");
  }

  // Generated Prompt
  if (ai.generatedPromptDraft) {
    lines.push("## 21. Coding Agent Prompt Taslağı");
    lines.push("");
    lines.push(`**Agent:** ${escapeMarkdown(ai.generatedPromptDraft.selectedAgent)}`);
    lines.push(`**Dosya Adı:** ${escapeMarkdown(ai.generatedPromptDraft.suggestedFileName || "roadmind-master-prompt.md")}`);
    lines.push("");
    lines.push("```");
    lines.push(ai.generatedPromptDraft.fullPrompt || "");
    lines.push("```");
    lines.push("");
  }

  lines.push(`---`);
  lines.push("");
  lines.push(`*Bu rapor Roadmind v2.0 ile üretilmiştir. ${new Date().toLocaleDateString()}*`);

  return lines.join("\n");
}

export function buildAgentsMdExport(
  project: Project,
  ai: AIOutputV2,
): string {
  const lines: string[] = [];
  lines.push("# AGENTS.md");
  lines.push("");
  lines.push(`## ${escapeMarkdown(project.title)}`);
  lines.push("");
  lines.push(escapeMarkdown(ai.projectSummary || ""));
  lines.push("");

  if (ai.recommendedStack) {
    lines.push("## Tech Stack");
    lines.push("");
    const stack = ai.recommendedStack;
    if (stack.frontend) lines.push(`- Frontend: ${stack.frontend.technology}`);
    if (stack.backend) lines.push(`- Backend: ${stack.backend.technology}`);
    if (stack.database) lines.push(`- Database: ${stack.database.technology}`);
    if (stack.styling) lines.push(`- Styling: ${stack.styling.technology}`);
    if (stack.orm) lines.push(`- ORM: ${stack.orm.technology}`);
    if (stack.testing) lines.push(`- Testing: ${stack.testing.technology}`);
    if (stack.deployment) lines.push(`- Deployment: ${stack.deployment.technology}`);
    lines.push("");
  }

  if (ai.architectureOverview) {
    lines.push("## Architecture");
    lines.push("");
    lines.push(escapeMarkdown(ai.architectureOverview));
    lines.push("");
  }

  if (ai.implementationRoadmap?.length) {
    lines.push("## Roadmap");
    lines.push("");
    for (const week of ai.implementationRoadmap) {
      lines.push(`### Week ${week.week}: ${escapeMarkdown(week.title)}`);
      lines.push("");
      lines.push(bulletList(week.tasks));
      lines.push("");
    }
  }

  if (ai.generatedPromptDraft) {
    lines.push("## Prompt");
    lines.push("");
    lines.push(ai.generatedPromptDraft.fullPrompt || "");
    lines.push("");
  }

  return lines.join("\n");
}


export function buildTxtExport(
  project: Project,
  ai: AIOutputV2,
): string {
  const lines: string[] = [];
  lines.push(`ROADMIND v2.0 - ${project.title}`);
  lines.push("=" .repeat(50));
  lines.push("");
  lines.push(ai.projectSummary || "");
  lines.push("");
  
  if (ai.generatedPromptDraft) {
    lines.push("PROMPT:");
    lines.push("-" .repeat(40));
    lines.push(ai.generatedPromptDraft.fullPrompt || "");
    lines.push("");
  }

  if (ai.risks?.length) {
    lines.push("RISKS:");
    lines.push("-" .repeat(40));
    for (const r of ai.risks) {
      lines.push(`- ${r.risk} (${r.impact}): ${r.solution}`);
    }
    lines.push("");
  }

  lines.push("END");
  return lines.join("\n");
}

export function buildJsonExportPayload(
  project: Project,
  analysis: Analysis,
  ai: AIOutputV2,
): Record<string, unknown> {
  return {
    schemaVersion: "2.0",
    project: {
      id: project.id,
      title: project.title,
      description: project.description,
      targetPlatform: project.targetPlatform,
      difficultyLevel: project.difficultyLevel,
      priority: project.priority,
      preferredTechnologies: project.preferredTechnologies,
      roadmapDurationWeeks: project.roadmapDurationWeeks,
      status: project.status,
      aiProvider: project.aiProvider,
      selectedModel: project.selectedModel,
      codingAgent: project.codingAgent,
      outputMode: project.outputMode,
      planMode: project.planMode,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    },
    analysis: {
      id: analysis.id,
      projectId: analysis.projectId,
      modelName: analysis.modelName,
      provider: analysis.provider,
      createdAt: analysis.createdAt.toISOString(),
      ...ai,
    },
  };
}
