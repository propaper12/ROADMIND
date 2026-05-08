export interface TechnologyChoice {
  technology: string;
  reason: string;
}

export interface Complexity {
  score: number;
  estimatedDurationWeeks: number;
  requiredSkillLevel: "Beginner" | "Intermediate" | "Advanced";
  mainChallenges: string[];
}

export interface TargetUser {
  name: string;
  description: string;
}

export interface CoreFeature {
  name: string;
  description: string;
  priority: "Must Have" | "Should Have" | "Nice to Have";
}

export interface Module {
  name: string;
  responsibility: string;
  inputs: string[];
  outputs: string[];
}

export interface Column {
  name: string;
  type: string;
  constraints?: string;
}

export interface Table {
  tableName: string;
  purpose: string;
  columns: Column[];
  relations: string[];
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
  authRequired?: boolean;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  tasks: string[];
  deliverable: string;
}

export interface Risk {
  risk: string;
  impact: "Low" | "Medium" | "High";
  solution: string;
}

export interface AlternativeStack {
  name: string;
  description: string;
  bestFor: string;
  technologies: string[];
}

export interface RecommendedStack {
  frontend?: TechnologyChoice;
  backend?: TechnologyChoice;
  database?: TechnologyChoice;
  ai?: TechnologyChoice;
  deployment?: TechnologyChoice;
  testing?: TechnologyChoice;
  styling?: TechnologyChoice;
  orm?: TechnologyChoice;
}

export interface PromptSection {
  id: string;
  title: string;
  enabled: boolean;
  content: string;
}

export interface GeneratedPromptDraft {
  selectedAgent: string;
  promptTitle: string;
  fullPrompt: string;
  sections?: PromptSection[];
  suggestedFileName?: string;
  suggestedFormat?: string;
  planMode?: string;
  outputMode?: string;
}

export interface PromptQualityScore {
  score: number;
  strengths: string[];
  missingInformation?: string[];
  improvementSuggestions: string[];
}

export interface DatabaseRecommendation {
  database: string;
  reason: string;
  mvpDatabase?: string;
  productionDatabase?: string;
  rejectedAlternatives?: string[];
  migrationStrategy?: string;
  indexingSuggestions?: string[];
  backupConsiderations?: string;
  offlineConsiderations?: string;
}

export interface TestingRecommendation {
  testing: string;
  reason: string;
  unitTesting?: string;
  integrationTesting?: string;
  e2eTesting?: string;
  apiTesting?: string;
  manualQAChecklist?: string[];
}

export interface UIPage {
  name: string;
  route?: string;
  description: string;
  components?: string[];
  layout?: string;
}

export interface Task {
  phase: string;
  title: string;
  description: string;
  estimatedHours?: number;
  priority: "Must Have" | "Should Have" | "Nice to Have";
}

export interface AcceptanceCriterion {
  id?: string;
  description: string;
  priority: "Must Have" | "Should Have" | "Nice to Have";
  verificationMethod?: string;
}

export interface TestCase {
  type: "unit" | "integration" | "e2e" | "api" | "manual";
  description: string;
  priority?: "Must Have" | "Should Have" | "Nice to Have";
}

export interface RoadmapAnalysis {
  schemaVersion?: string;
  projectSummary: string;
  problemDefinition: string;
  assumptions?: string[];
  missingInformationQuestions?: string[];
  targetUsers?: TargetUser[];
  projectMaturityAnalysis?: string;
  providerRecommendation?: { provider: string; model: string; reason: string };
  platformRecommendation?: { platform: string; reason: string; alternative?: string };
  codingAgentRecommendation?: { agent: string; reason: string };
  languageRecommendation?: { language: string; reason: string };
  runtimeRecommendation?: { runtime: string; reason: string };
  packageManagerRecommendation?: { packageManager: string; reason: string };
  frontendFrameworkRecommendation?: { framework: string; reason: string };
  backendFrameworkRecommendation?: { framework: string; reason: string };
  databaseRecommendation?: DatabaseRecommendation;
  ormRecommendation?: { orm: string; reason: string };
  uiStylingRecommendation?: { styling: string; reason: string };
  testingRecommendation?: TestingRecommendation;
  deploymentRecommendation?: { deployment: string; reason: string };
  recommendedStack?: RecommendedStack;
  rejectedAlternatives?: AlternativeStack[];
  architectureOverview?: string;
  systemModules?: Module[];
  uiPagePlan?: UIPage[];
  databaseSchema?: Table[];
  apiEndpoints?: ApiEndpoint[];
  implementationRoadmap?: RoadmapWeek[];
  taskBreakdown?: Task[];
  generatedPromptDraft?: GeneratedPromptDraft;
  promptQualityScore?: PromptQualityScore;
  acceptanceCriteria?: AcceptanceCriterion[];
  testPlan?: TestCase[];
  risks?: Risk[];
  futureImprovements?: string[];
  // Legacy v1 fields
  complexity?: Complexity;
  mvpScope?: string[];
  coreFeatures?: CoreFeature[];
  modules?: Module[];
  developmentRoadmap?: RoadmapWeek[];
}
