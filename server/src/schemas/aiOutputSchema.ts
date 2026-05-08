import { z } from "zod";

// Base enums
const skillLevelSchema = z.enum(["Beginner", "Intermediate", "Advanced"]);
const featurePrioritySchema = z.enum(["Must Have", "Should Have", "Nice to Have"]);
const httpMethodSchema = z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const impactSchema = z.enum(["Low", "Medium", "High"]);

// Reusable sub-schemas
const technologyChoiceSchema = z.object({
  technology: z.string().min(1),
  reason: z.string().min(1),
});

const targetUserSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

const moduleSchema = z.object({
  name: z.string().min(1),
  responsibility: z.string().min(1),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
});

const columnSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  constraints: z.string().optional(),
});

const tableSchema = z.object({
  tableName: z.string().min(1),
  purpose: z.string().min(1),
  columns: z.array(columnSchema).min(1),
  relations: z.array(z.string()).default([]),
});

const apiEndpointSchema = z.object({
  method: httpMethodSchema,
  path: z.string().min(1),
  description: z.string().min(1),
  requestBody: z.string().optional(),
  responseBody: z.string().optional(),
  authRequired: z.boolean().optional(),
});

const roadmapWeekSchema = z.object({
  week: z.number().int().min(1),
  title: z.string().min(1),
  tasks: z.array(z.string().min(1)).min(1),
  deliverable: z.string().min(1),
});

const riskSchema = z.object({
  risk: z.string().min(1),
  impact: impactSchema,
  solution: z.string().min(1),
});

const alternativeStackSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  bestFor: z.string().min(1),
  technologies: z.array(z.string().min(1)).min(1),
});

const taskSchema = z.object({
  phase: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedHours: z.number().optional(),
  priority: featurePrioritySchema,
});

const uiPageSchema = z.object({
  name: z.string().min(1),
  route: z.string().optional(),
  description: z.string().min(1),
  components: z.array(z.string()).optional(),
  layout: z.string().optional(),
});

const acceptanceCriterionSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1),
  priority: featurePrioritySchema,
  verificationMethod: z.string().optional(),
});

const testCaseSchema = z.object({
  type: z.enum(["unit", "integration", "e2e", "api", "manual"]),
  description: z.string().min(1),
  priority: featurePrioritySchema.optional(),
});

const promptSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  enabled: z.boolean().default(true),
  content: z.string().optional(),
});

const promptQualityScoreSchema = z.object({
  score: z.number().min(0).max(10),
  strengths: z.array(z.string()).min(1),
  missingInformation: z.array(z.string()).optional(),
  improvementSuggestions: z.array(z.string()).min(1),
});

export const generatedPromptDraftSchema = z.object({
  schemaVersion: z.union([z.literal("2.0"), z.literal("1.0"), z.literal("unknown")]).default("2.0"),
  
  // Project info
  projectSummary: z.string().min(1),
  problemDefinition: z.string().min(1),
  assumptions: z.array(z.string()).optional(),
  missingInformationQuestions: z.array(z.string()).optional(),
  targetUsers: z.array(targetUserSchema).optional(),
  
  // Maturity analysis
  projectMaturityAnalysis: z.string().optional(),
  
  // AI Provider info
  providerRecommendation: z.object({
    provider: z.string().min(1),
    model: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  // Recommendations
  platformRecommendation: z.object({
    platform: z.string().min(1),
    reason: z.string().min(1),
    alternative: z.string().optional(),
  }).optional(),
  
  codingAgentRecommendation: z.object({
    agent: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  languageRecommendation: z.object({
    language: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  runtimeRecommendation: z.object({
    runtime: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  packageManagerRecommendation: z.object({
    packageManager: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  frontendFrameworkRecommendation: z.object({
    framework: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  backendFrameworkRecommendation: z.object({
    framework: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  databaseRecommendation: z.object({
    database: z.string().min(1),
    reason: z.string().min(1),
    mvpDatabase: z.string().optional(),
    productionDatabase: z.string().optional(),
    rejectedAlternatives: z.array(z.string()).optional(),
    migrationStrategy: z.string().optional(),
    indexingSuggestions: z.array(z.string()).optional(),
    backupConsiderations: z.string().optional(),
    offlineConsiderations: z.string().optional(),
  }).optional(),
  
  ormRecommendation: z.object({
    orm: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  uiStylingRecommendation: z.object({
    styling: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  testingRecommendation: z.object({
    testing: z.string().min(1),
    reason: z.string().min(1),
    unitTesting: z.string().optional(),
    integrationTesting: z.string().optional(),
    e2eTesting: z.string().optional(),
    apiTesting: z.string().optional(),
    manualQAChecklist: z.array(z.string()).optional(),
  }).optional(),
  
  deploymentRecommendation: z.object({
    deployment: z.string().min(1),
    reason: z.string().min(1),
  }).optional(),
  
  // Recommended stack
  recommendedStack: z.object({
    frontend: technologyChoiceSchema.optional(),
    backend: technologyChoiceSchema.optional(),
    database: technologyChoiceSchema.optional(),
    ai: technologyChoiceSchema.optional(),
    deployment: technologyChoiceSchema.optional(),
    testing: technologyChoiceSchema.optional(),
    styling: technologyChoiceSchema.optional(),
    orm: technologyChoiceSchema.optional(),
  }).optional(),
  
  rejectedAlternatives: z.array(alternativeStackSchema).optional(),
  
  // Architecture
  architectureOverview: z.string().min(1).optional(),
  systemModules: z.array(moduleSchema).optional(),
  
  // UI Plan
  uiPagePlan: z.array(uiPageSchema).optional(),
  
  // Database
  databaseSchema: z.array(tableSchema).optional(),
  
  // API
  apiEndpoints: z.array(apiEndpointSchema).optional(),
  
  // Roadmap
  implementationRoadmap: z.array(roadmapWeekSchema).optional(),
  taskBreakdown: z.array(taskSchema).optional(),
  
  // Prompt
  generatedPromptDraft: z.object({
    selectedAgent: z.string().min(1),
    promptTitle: z.string().min(1),
    fullPrompt: z.string().min(1),
    sections: z.array(promptSectionSchema).optional(),
    suggestedFileName: z.string().optional(),
    suggestedFormat: z.string().optional(),
    planMode: z.string().optional(),
    outputMode: z.string().optional(),
  }).optional(),
  
  promptQualityScore: promptQualityScoreSchema.optional(),
  
  // Testing & QA
  acceptanceCriteria: z.array(acceptanceCriterionSchema).optional(),
  testPlan: z.array(testCaseSchema).optional(),
  
  // Risks
  risks: z.array(riskSchema).optional(),
  futureImprovements: z.array(z.string()).optional(),
});

export type AIOutputV2 = z.infer<typeof generatedPromptDraftSchema>;

// Legacy v1 schema (kept for backward compatibility)
export const aiOutputSchema = z.object({
  projectSummary: z.string().min(1),
  problemDefinition: z.string().min(1),
  complexity: z.object({
    score: z.number().min(0).max(10),
    estimatedDurationWeeks: z.number().int().min(1),
    requiredSkillLevel: skillLevelSchema,
    mainChallenges: z.array(z.string().min(1)).min(1),
  }),
  targetUsers: z.array(targetUserSchema).min(1),
  mvpScope: z.array(z.string().min(1)).min(1),
  coreFeatures: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      priority: featurePrioritySchema,
    }),
  ).min(1),
  recommendedStack: z.object({
    frontend: technologyChoiceSchema,
    backend: technologyChoiceSchema,
    database: technologyChoiceSchema,
    ai: technologyChoiceSchema,
    deployment: technologyChoiceSchema,
    testing: technologyChoiceSchema,
  }),
  alternativeStacks: z.array(alternativeStackSchema).min(1),
  modules: z.array(moduleSchema).min(1),
  databaseSchema: z.array(tableSchema).min(1),
  apiEndpoints: z.array(apiEndpointSchema).min(1),
  developmentRoadmap: z.array(roadmapWeekSchema).min(1),
  risks: z.array(riskSchema).min(1),
  futureImprovements: z.array(z.string().min(1)).min(1),
});

export type AIOutput = z.infer<typeof aiOutputSchema>;
