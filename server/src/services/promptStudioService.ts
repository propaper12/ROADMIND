import type { AIOutputV2 } from "../schemas/aiOutputSchema.js";
import { getAgentById } from "./agentRegistryService.js";

export interface PromptSection {
  id: string;
  title: string;
  enabled: boolean;
  content: string;
}

export interface FinalPrompt {
  selectedAgent: string;
  promptTitle: string;
  fullPrompt: string;
  sections: PromptSection[];
  suggestedFileName: string;
  suggestedFormat: string;
  planMode: string;
  outputMode: string;
}

export function generatePromptSections(
  analysis: AIOutputV2,
  customInstructions?: string,
): PromptSection[] {
  const sections: PromptSection[] = [
    {
      id: "role_definition",
      title: "Role Definition",
      enabled: true,
      content: `You are a senior full-stack engineer and software architect. You are working with the following coding agent: ${analysis.codingAgentRecommendation?.agent || "Generic AI Agent"}.`,
    },
    {
      id: "project_context",
      title: "Project Context",
      enabled: true,
      content: analysis.projectSummary || "",
    },
    {
      id: "goals",
      title: "Goals",
      enabled: true,
      content: analysis.problemDefinition || "",
    },
    {
      id: "constraints",
      title: "Constraints",
      enabled: true,
      content: `\n- Do not delete existing files without inspection\n- Do not remove existing working features\n- Do not hardcode fake data\n- Do not use cloud AI providers unless explicitly requested\n- Do not require API keys unless explicitly needed\n- Do not expose API keys to frontend\n- Do not commit .env files\n- Do not leave TODO comments for core functionality\n- Do not rewrite from scratch unless necessary\n- Do not skip validation/error handling\n- Do not ignore existing project structure`,
    },
    {
      id: "platform",
      title: "Platform",
      enabled: true,
      content: `Recommended Platform: ${analysis.platformRecommendation?.platform || "Auto-detected"}\nReason: ${analysis.platformRecommendation?.reason || ""}`,
    },
    {
      id: "tech_stack",
      title: "Tech Stack",
      enabled: true,
      content: generateStackContent(analysis),
    },
    {
      id: "database_plan",
      title: "Database Plan",
      enabled: !!(analysis.databaseRecommendation || analysis.databaseSchema?.length),
      content: generateDatabaseContent(analysis),
    },
    {
      id: "architecture",
      title: "Architecture",
      enabled: !!(analysis.architectureOverview || analysis.systemModules?.length),
      content: generateArchitectureContent(analysis),
    },
    {
      id: "ui_requirements",
      title: "UI Requirements",
      enabled: !!(analysis.uiPagePlan?.length),
      content: generateUIContent(analysis),
    },
    {
      id: "backend_api_requirements",
      title: "Backend/API Requirements",
      enabled: !!(analysis.apiEndpoints?.length),
      content: generateAPIContent(analysis),
    },
    {
      id: "testing_requirements",
      title: "Testing Requirements",
      enabled: !!(analysis.testingRecommendation || analysis.testPlan?.length),
      content: generateTestingContent(analysis),
    },
    {
      id: "security_requirements",
      title: "Security Requirements",
      enabled: true,
      content: `\n- Input validation on all endpoints\n- Authentication and authorization\n- Rate limiting\n- XSS and CSRF protection\n- Secure configuration management (no hardcoded secrets)\n- SQL injection prevention\n- Content Security Policy headers`,
    },
    {
      id: "implementation_order",
      title: "Implementation Order",
      enabled: !!(analysis.implementationRoadmap?.length || analysis.taskBreakdown?.length),
      content: generateRoadmapContent(analysis),
    },
    {
      id: "acceptance_criteria",
      title: "Acceptance Criteria",
      enabled: !!(analysis.acceptanceCriteria?.length),
      content: generateAcceptanceCriteriaContent(analysis),
    },
    {
      id: "forbidden_actions",
      title: "Forbidden Actions",
      enabled: true,
      content: `FORBIDDEN - Do not do any of these:
- Do not delete existing files without inspection
- Do not remove existing working features
- Do not hardcode fake data
- Do not use cloud AI providers unless explicitly requested
- Do not require API keys unless explicitly needed
- Do not expose API keys to frontend
- Do not commit .env files
- Do not leave TODO comments for core functionality
- Do not rewrite from scratch unless necessary
- Do not skip validation/error handling
- Do not ignore existing project structure`,
    },
    {
      id: "final_response_format",
      title: "Final Response Format",
      enabled: true,
      content: `\nWhen complete, provide:\n1. Changed files summary\n2. Commands to run (if any)\n3. Any follow-up tasks or considerations`,
    },
  ];

  if (customInstructions) {
    sections.push({
      id: "custom_instructions",
      title: "Custom Instructions",
      enabled: true,
      content: customInstructions,
    });
  }

  return sections;
}

function generateStackContent(analysis: AIOutputV2): string {
  const stack = analysis.recommendedStack;
  if (!stack) return "Auto-detect stack based on requirements.";
  
  const parts: string[] = [];
  if (stack.frontend) parts.push(`Frontend: ${stack.frontend.technology} - ${stack.frontend.reason}`);
  if (stack.backend) parts.push(`Backend: ${stack.backend.technology} - ${stack.backend.reason}`);
  if (stack.database) parts.push(`Database: ${stack.database.technology} - ${stack.database.reason}`);
  if (stack.ai) parts.push(`AI: ${stack.ai.technology} - ${stack.ai.reason}`);
  if (stack.deployment) parts.push(`Deployment: ${stack.deployment.technology} - ${stack.deployment.reason}`);
  if (stack.testing) parts.push(`Testing: ${stack.testing.technology} - ${stack.testing.reason}`);
  if (stack.styling) parts.push(`Styling: ${stack.styling.technology} - ${stack.styling.reason}`);
  if (stack.orm) parts.push(`ORM: ${stack.orm.technology} - ${stack.orm.reason}`);
  
  return parts.join("\n") || "Auto-detect stack based on requirements.";
}

function generateDatabaseContent(analysis: AIOutputV2): string {
  const parts: string[] = [];
  
  if (analysis.databaseRecommendation) {
    const db = analysis.databaseRecommendation;
    parts.push(`Database: ${db.database}`);
    parts.push(`Reason: ${db.reason}`);
    if (db.mvpDatabase) parts.push(`MVP Database: ${db.mvpDatabase}`);
    if (db.productionDatabase) parts.push(`Production Database: ${db.productionDatabase}`);
    if (db.migrationStrategy) parts.push(`Migration Strategy: ${db.migrationStrategy}`);
    if (db.indexingSuggestions?.length) {
      parts.push(`Indexing Suggestions:\n${db.indexingSuggestions.map(i => `- ${i}`).join("\n")}`);
    }
  }

  if (analysis.databaseSchema?.length) {
    parts.push("\nSchema:");
    for (const table of analysis.databaseSchema) {
      parts.push(`\n### ${table.tableName}`);
      parts.push(`Purpose: ${table.purpose}`);
      if (table.columns?.length) {
        const colLines = table.columns.map(c => `- ${c.name}: ${c.type}${c.constraints ? ` (${c.constraints})` : ""}`);
        parts.push(`Columns:\n${colLines.join("\n")}`);
      }
      if (table.relations?.length) {
        parts.push(`Relations: ${table.relations.join(", ")}`);
      }
    }
  }

  return parts.join("\n") || "Auto-detect database based on requirements.";
}

function generateArchitectureContent(analysis: AIOutputV2): string {
  const parts: string[] = [];
  
  if (analysis.architectureOverview) {
    parts.push(`Overview: ${analysis.architectureOverview}`);
  }

  if (analysis.systemModules?.length) {
    parts.push("\nModules:");
    for (const mod of analysis.systemModules) {
      parts.push(`\n### ${mod.name}`);
      parts.push(`Responsibility: ${mod.responsibility}`);
      if (mod.inputs?.length) parts.push(`Inputs: ${mod.inputs.join(", ")}`);
      if (mod.outputs?.length) parts.push(`Outputs: ${mod.outputs.join(", ")}`);
    }
  }

  return parts.join("\n") || "Auto-detect architecture based on requirements.";
}

function generateUIContent(analysis: AIOutputV2): string {
  if (!analysis.uiPagePlan?.length) return "UI pages will be designed based on requirements.";
  
  const parts: string[] = ["UI Pages:"];
  for (const page of analysis.uiPagePlan) {
    parts.push(`\n### ${page.name}`);
    if (page.route) parts.push(`Route: ${page.route}`);
    parts.push(`Description: ${page.description}`);
    if (page.components?.length) parts.push(`Components: ${page.components.join(", ")}`);
    if (page.layout) parts.push(`Layout: ${page.layout}`);
  }
  
  return parts.join("\n");
}

function generateAPIContent(analysis: AIOutputV2): string {
  if (!analysis.apiEndpoints?.length) return "API endpoints will be designed based on requirements.";
  
  const parts: string[] = ["API Endpoints:"];
  for (const ep of analysis.apiEndpoints) {
    parts.push(`\n### ${ep.method} ${ep.path}`);
    parts.push(`Description: ${ep.description}`);
    if (ep.requestBody) parts.push(`Request: ${ep.requestBody}`);
    if (ep.responseBody) parts.push(`Response: ${ep.responseBody}`);
    if (ep.authRequired) parts.push(`Auth: Required`);
  }
  
  return parts.join("\n");
}

function generateTestingContent(analysis: AIOutputV2): string {
  const parts: string[] = [];
  
  if (analysis.testingRecommendation) {
    const test = analysis.testingRecommendation;
    parts.push(`Testing: ${test.testing}`);
    parts.push(`Reason: ${test.reason}`);
    if (test.unitTesting) parts.push(`Unit Testing: ${test.unitTesting}`);
    if (test.integrationTesting) parts.push(`Integration Testing: ${test.integrationTesting}`);
    if (test.e2eTesting) parts.push(`E2E Testing: ${test.e2eTesting}`);
    if (test.apiTesting) parts.push(`API Testing: ${test.apiTesting}`);
    if (test.manualQAChecklist?.length) {
      parts.push(`Manual QA Checklist:\n${test.manualQAChecklist.map(i => `- ${i}`).join("\n")}`);
    }
  }

  if (analysis.testPlan?.length) {
    parts.push("\nTest Plan:");
    for (const test of analysis.testPlan) {
      parts.push(`- [${test.type.toUpperCase()}] ${test.description}${test.priority ? ` (${test.priority})` : ""}`);
    }
  }

  return parts.join("\n") || "Testing strategy will be defined based on requirements.";
}

function generateRoadmapContent(analysis: AIOutputV2): string {
  const parts: string[] = [];
  
  if (analysis.implementationRoadmap?.length) {
    parts.push("Development Roadmap:");
    for (const week of analysis.implementationRoadmap) {
      parts.push(`\n### Week ${week.week}: ${week.title}`);
      if (week.tasks?.length) {
        parts.push(`Tasks:\n${week.tasks.map(t => `- ${t}`).join("\n")}`);
      }
      parts.push(`Deliverable: ${week.deliverable}`);
    }
  }

  if (analysis.taskBreakdown?.length) {
    parts.push("\nTask Breakdown:");
    for (const task of analysis.taskBreakdown) {
      parts.push(`\n- ${task.phase}: ${task.title}`);
      parts.push(`  ${task.description}`);
      if (task.estimatedHours) parts.push(`  Estimated: ${task.estimatedHours}h`);
      parts.push(`  Priority: ${task.priority}`);
    }
  }

  return parts.join("\n") || "Implementation order will be defined based on requirements.";
}

function generateAcceptanceCriteriaContent(analysis: AIOutputV2): string {
  if (!analysis.acceptanceCriteria?.length) return "Acceptance criteria will be defined based on requirements.";
  
  const parts: string[] = ["Acceptance Criteria:"];
  for (const criteria of analysis.acceptanceCriteria) {
    const id = criteria.id ?? Math.random().toString(36).substring(2, 8);
    parts.push(`\n${id}. ${criteria.description}`);
    parts.push(`   Priority: ${criteria.priority}`);
    if (criteria.verificationMethod) parts.push(`   Verification: ${criteria.verificationMethod}`);
  }
  
  return parts.join("\n");
}

export function generateFinalPrompt(
  sections: PromptSection[],
  selectedAgent: string,
  planMode: string,
  outputMode: string,
): FinalPrompt {
  const enabledSections = sections.filter(s => s.enabled);
  const fullPrompt = enabledSections
    .map(s => `## ${s.title}\n\n${s.content}`)
    .join("\n\n");

  const agent = getAgentById(selectedAgent);
  const suggestedFileName = agent?.outputFileRecommendation || "roadmind-master-prompt.md";
  const suggestedFormat = agent?.recommendedPromptFormat || "markdown";

  return {
    selectedAgent: selectedAgent || "generic",
    promptTitle: `Roadmind v2.0 - ${planMode === "plan_first" ? "Plan First" : "Direct Build"} Prompt`,
    fullPrompt,
    sections: enabledSections,
    suggestedFileName,
    suggestedFormat,
    planMode,
    outputMode,
  };
}
