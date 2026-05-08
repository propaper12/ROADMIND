import type { RoadmapAnalysis } from "./analysis.js";

export type TargetPlatform =
  | "Web"
  | "Mobile"
  | "Desktop"
  | "API"
  | "Embedded"
  | "AI Tool"
  | "Other";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export type PriorityFocus =
  | "Fast MVP"
  | "Scalability"
  | "Security"
  | "Low Cost"
  | "Maintainability";

export type AIProvider = "auto" | "cloud" | "local";

export type OutputMode =
  | "technical_roadmap"
  | "coding_agent_prompt"
  | "full_project_plan"
  | "mvp_build_plan"
  | "production_build_plan"
  | "existing_project_improvement"
  | "ui_ux_build_prompt"
  | "backend_api_build_prompt"
  | "database_design_prompt"
  | "final_qa_prompt";

export type PlanMode = "plan_first" | "direct_build";

export type OutputDepth = "short" | "standard" | "detailed" | "very_detailed";

export type CodingAgent =
  | "auto"
  | "cursor"
  | "opencode"
  | "openclaw"
  | "codex"
  | "windsurf"
  | "aider"
  | "continue"
  | "lovable_bolt_v0"
  | "generic";

export type ProjectMaturity =
  | "just_idea"
  | "roughly_defined"
  | "mvp_ready"
  | "existing_to_improve"
  | "existing_with_bugs"
  | "existing_ui_polish"
  | "existing_backend_refactor";

export interface RequirementToggles {
  authentication: boolean;
  adminPanel: boolean;
  database: boolean;
  aiIntegration: boolean;
  fileUpload: boolean;
  realtimeFeatures: boolean;
  paymentSubscription: boolean;
  notifications: boolean;
  multiLanguage: boolean;
  offlineSupport: boolean;
  mobileResponsive: boolean;
  deploymentPlan: boolean;
  testingPlan: boolean;
  securityPlan: boolean;
  analytics: boolean;
}

export interface ProjectAnalyzeInput {
  title: string;
  description: string;
  targetPlatform: TargetPlatform;
  difficultyLevel: DifficultyLevel;
  priority: PriorityFocus;
  preferredTechnologies?: string;
  roadmapDurationWeeks: number;
  // v2 fields
  aiProvider?: AIProvider;
  selectedModel?: string;
  outputMode?: OutputMode;
  planMode?: PlanMode;
  outputDepth?: OutputDepth;
  codingAgent?: CodingAgent;
  projectMaturity?: ProjectMaturity;
  programmingLanguage?: string;
  runtime?: string;
  packageManager?: string;
  frontendFramework?: string;
  backendFramework?: string;
  database?: string;
  orm?: string;
  uiStyling?: string;
  testing?: string;
  deployment?: string;
  requirementToggles?: RequirementToggles;
  customInstructions?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  targetPlatform: TargetPlatform;
  difficultyLevel: DifficultyLevel;
  priority: PriorityFocus;
  preferredTechnologies: string | null;
  roadmapDurationWeeks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  // v2 fields
  schemaVersion?: string | null;
  aiProvider?: string | null;
  selectedModel?: string | null;
  providerFallbackInfo?: string | null;
  outputMode?: string | null;
  planMode?: string | null;
  outputDepth?: string | null;
  codingAgent?: string | null;
  projectMaturity?: string | null;
  programmingLanguage?: string | null;
  runtime?: string | null;
  packageManager?: string | null;
  frontendFramework?: string | null;
  backendFramework?: string | null;
  database?: string | null;
  orm?: string | null;
  uiStyling?: string | null;
  testing?: string | null;
  deployment?: string | null;
  requirementToggles?: string | null;
  customInstructions?: string | null;
}

export interface AnalysisSummary {
  projectSummaryPreview: string;
  complexityScore: number;
  estimatedDurationWeeks: number;
}

export interface ProjectListItem extends Project {
  analysisSummary?: AnalysisSummary | null;
}

export interface ProjectWithAnalysis extends Project {
  analysis: RoadmapAnalysis | null;
}
