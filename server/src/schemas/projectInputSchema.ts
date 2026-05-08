import { z } from "zod";

export const targetPlatformSchema = z.enum([
  "Web", "Mobile", "Desktop", "API", "Embedded", "AI Tool", "Other",
]);

export const difficultyLevelSchema = z.enum(["Beginner", "Intermediate", "Advanced"]);

export const prioritySchema = z.enum([
  "Fast MVP", "Scalability", "Security", "Low Cost", "Maintainability",
]);

export const aiProviderSchema = z.enum(["auto", "cloud", "local"]);

export const outputModeSchema = z.enum([
  "technical_roadmap",
  "coding_agent_prompt",
  "full_project_plan",
  "mvp_build_plan",
  "production_build_plan",
  "existing_project_improvement",
  "ui_ux_build_prompt",
  "backend_api_build_prompt",
  "database_design_prompt",
  "final_qa_prompt",
]);

export const planModeSchema = z.enum(["plan_first", "direct_build"]);

export const outputDepthSchema = z.enum(["short", "standard", "detailed", "very_detailed"]);

export const codingAgentSchema = z.enum([
  "auto",
  "cursor",
  "opencode",
  "openclaw",
  "codex",
  "windsurf",
  "aider",
  "continue",
  "lovable_bolt_v0",
  "generic",
]);

export const projectMaturitySchema = z.enum([
  "just_idea",
  "roughly_defined",
  "mvp_ready",
  "existing_to_improve",
  "existing_with_bugs",
  "existing_ui_polish",
  "existing_backend_refactor",
]);

export const requirementTogglesSchema = z.object({
  authentication: z.boolean().default(false),
  adminPanel: z.boolean().default(false),
  database: z.boolean().default(false),
  aiIntegration: z.boolean().default(false),
  fileUpload: z.boolean().default(false),
  realtimeFeatures: z.boolean().default(false),
  paymentSubscription: z.boolean().default(false),
  notifications: z.boolean().default(false),
  multiLanguage: z.boolean().default(false),
  offlineSupport: z.boolean().default(false),
  mobileResponsive: z.boolean().default(false),
  deploymentPlan: z.boolean().default(false),
  testingPlan: z.boolean().default(false),
  securityPlan: z.boolean().default(false),
  analytics: z.boolean().default(false),
});

export const v2ProjectInputSchema = z.object({
  // Core fields
  title: z.string().trim().min(3, "Başlık en az 3 karakter olmalı"),
  description: z.string().trim().min(20, "Açıklama en az 20 karakter olmalı"),
  
  // AI Provider
  aiProvider: aiProviderSchema.default("auto"),
  selectedModel: z.string().optional(),
  
  // Output configuration
  outputMode: outputModeSchema.default("full_project_plan"),
  planMode: planModeSchema.default("plan_first"),
  outputDepth: outputDepthSchema.default("detailed"),
  
  // Build context
  targetPlatform: z.string().default("auto"),
  codingAgent: codingAgentSchema.default("auto"),
  projectMaturity: projectMaturitySchema.default("just_idea"),
  
  // Legacy fields (backward compatibility)
  difficultyLevel: difficultyLevelSchema.default("Intermediate"),
  priority: prioritySchema.default("Maintainability"),
  preferredTechnologies: z.string().trim().optional(),
  roadmapDurationWeeks: z.coerce.number().int().min(1).max(52).default(8),
  
  // Advanced options (all default to "auto")
  programmingLanguage: z.string().default("auto"),
  runtime: z.string().default("auto"),
  packageManager: z.string().default("auto"),
  frontendFramework: z.string().default("auto"),
  backendFramework: z.string().default("auto"),
  database: z.string().default("auto"),
  orm: z.string().default("auto"),
  uiStyling: z.string().default("auto"),
  testing: z.string().default("auto"),
  deployment: z.string().default("auto"),
  
  // Requirement toggles
  requirementToggles: requirementTogglesSchema.default({}),
  
  // Custom instructions
  customInstructions: z.string().optional(),
}).refine(
  (data) => {
    if (data.aiProvider === "cloud" && !data.selectedModel) {
      return false;
    }
    return true;
  },
  {
    message: "Cloud sağlayıcısı seçiliyse bir model seçilmelidir",
    path: ["selectedModel"],
  }
);

// Legacy v1 schema (kept for backward compatibility)
export const projectInputSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  targetPlatform: targetPlatformSchema,
  difficultyLevel: difficultyLevelSchema,
  priority: prioritySchema,
  preferredTechnologies: z.string().trim().optional(),
  roadmapDurationWeeks: z.coerce.number().int().min(1).max(52),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type V2ProjectInput = z.infer<typeof v2ProjectInputSchema>;
export type RequirementToggles = z.infer<typeof requirementTogglesSchema>;
