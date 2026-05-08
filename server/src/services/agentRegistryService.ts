export interface AgentRegistryItem {
  id: string;
  displayName: string;
  description: string;
  idealUseCases: string[];
  promptStyle: string;
  supportsPlanFirst: boolean;
  supportsRepoInspection: boolean;
  supportsTerminalCommands: boolean;
  supportsMultiFileEditing: boolean;
  recommendedPromptFormat: "markdown" | "agents_md" | "txt";
  recommendedFileNames: string[];
  outputFileRecommendation: string;
  limitations: string[];
  templateSections: string[];
}

export const AGENT_REGISTRY: AgentRegistryItem[] = [
  {
    id: "cursor",
    displayName: "Cursor",
    description: "Repo-aware, multi-file editing, phase-based implementation agent.",
    idealUseCases: ["Orta-ileri düzey projeler", "Çoklu dosya değişikliği", "Kademeli uygulama"],
    promptStyle: "repo-aware, multi-file editing, phase-based",
    supportsPlanFirst: true,
    supportsRepoInspection: true,
    supportsTerminalCommands: true,
    supportsMultiFileEditing: true,
    recommendedPromptFormat: "markdown",
    recommendedFileNames: ["cursor-prompt.md", "roadmind-master-prompt.md"],
    outputFileRecommendation: "cursor-prompt.md",
    limitations: ["IDE bağımlılığı", "Aylık kota sınırları"],
    templateSections: ["role", "context", "goals", "constraints", "stack", "architecture", "phases", "acceptance"],
  },
  {
    id: "opencode",
    displayName: "OpenCode",
    description: "AGENTS.md-friendly, terminal/IDE coding agent with task breakdown.",
    idealUseCases: ["AGENTS.md uyumlu projeler", "Terminal/IDE akışı", "Görev ayrımı"],
    promptStyle: "AGENTS.md-friendly, terminal/IDE coding agent",
    supportsPlanFirst: true,
    supportsRepoInspection: true,
    supportsTerminalCommands: true,
    supportsMultiFileEditing: true,
    recommendedPromptFormat: "agents_md",
    recommendedFileNames: ["AGENTS.md", "roadmind-master-prompt.md"],
    outputFileRecommendation: "AGENTS.md",
    limitations: ["Yeni gelişen ekosistem", "Dokümantasyon değişebilir"],
    templateSections: ["role", "context", "goals", "constraints", "stack", "architecture", "phases", "acceptance"],
  },
  {
    id: "openclaw",
    displayName: "OpenClaw",
    description: "Agentic workflow, long-horizon task execution with strong planning.",
    idealUseCases: ["Uzun vadeli görevler", "Ajanik iş akışı", "Güçlü planlama yapısı"],
    promptStyle: "agentic workflow, long-horizon, clear phase boundaries",
    supportsPlanFirst: true,
    supportsRepoInspection: true,
    supportsTerminalCommands: true,
    supportsMultiFileEditing: true,
    recommendedPromptFormat: "markdown",
    recommendedFileNames: ["openclaw-prompt.md", "roadmind-master-prompt.md"],
    outputFileRecommendation: "openclaw-prompt.md",
    limitations: ["Deneysel seviye", "Geniş kontekst gerektirir"],
    templateSections: ["role", "context", "goals", "constraints", "stack", "architecture", "phases", "safety", "deliverable"],
  },
  {
    id: "codex",
    displayName: "Codex",
    description: "Concise task-oriented instructions with issue-style acceptance criteria.",
    idealUseCases: ["Hızlı görev tanımları", "Güvenli yürütme", "Issue-tarzı ölçütler"],
    promptStyle: "concise, task-oriented, issue-style acceptance",
    supportsPlanFirst: true,
    supportsRepoInspection: true,
    supportsTerminalCommands: false,
    supportsMultiFileEditing: true,
    recommendedPromptFormat: "markdown",
    recommendedFileNames: ["codex-AGENTS.md", "roadmind-master-prompt.md"],
    outputFileRecommendation: "codex-AGENTS.md",
    limitations: ["Terminal komutları kısıtlı", "Kısa prompt tercih eder"],
    templateSections: ["role", "context", "goals", "constraints", "stack", "acceptance"],
  },
  {
    id: "windsurf",
    displayName: "Windsurf",
    description: "IDE context-aware with clear file/component structure and phased changes.",
    idealUseCases: ["IDE entegrasyonu", "Dosya/bileşen yapısı", "Kademeli değişiklik"],
    promptStyle: "IDE context-aware, clear structure, phased",
    supportsPlanFirst: true,
    supportsRepoInspection: true,
    supportsTerminalCommands: true,
    supportsMultiFileEditing: true,
    recommendedPromptFormat: "markdown",
    recommendedFileNames: ["windsurf-prompt.md", "roadmind-master-prompt.md"],
    outputFileRecommendation: "windsurf-prompt.md",
    limitations: ["IDE bağımlılığı", "Ödeme duvarı"],
    templateSections: ["role", "context", "goals", "constraints", "stack", "architecture", "phases"],
  },
  {
    id: "aider",
    displayName: "Aider",
    description: "Git-aware, concise file-change scope, commit-friendly tasks.",
    idealUseCases: ["Git odaklı", "Atomik commitler", "Küçük değişiklik kapsamı"],
    promptStyle: "git-aware, concise scope, commit-friendly",
    supportsPlanFirst: true,
    supportsRepoInspection: true,
    supportsTerminalCommands: true,
    supportsMultiFileEditing: true,
    recommendedPromptFormat: "markdown",
    recommendedFileNames: ["aider-conventions.md", "roadmind-master-prompt.md"],
    outputFileRecommendation: "aider-conventions.md",
    limitations: ["Git gereksinimi", "Terminal zorunlu"],
    templateSections: ["role", "context", "goals", "constraints", "stack", "phases", "commit_rules"],
  },
  {
    id: "continue",
    displayName: "Continue",
    description: "IDE assistant style with task-by-task implementation.",
    idealUseCases: ["IDE asistanı", "Görev bazlı uygulama", "Kademeli geliştirme"],
    promptStyle: "IDE assistant, task-by-task",
    supportsPlanFirst: true,
    supportsRepoInspection: true,
    supportsTerminalCommands: true,
    supportsMultiFileEditing: true,
    recommendedPromptFormat: "markdown",
    recommendedFileNames: ["continue-prompt.md", "roadmind-master-prompt.md"],
    outputFileRecommendation: "continue-prompt.md",
    limitations: ["IDE bağımlılığı", "Küçük model desteği"],
    templateSections: ["role", "context", "goals", "constraints", "stack", "phases"],
  },
  {
    id: "lovable_bolt_v0",
    displayName: "Lovable / Bolt / v0",
    description: "UI-first, frontend/page/component specification with strong visual design instructions.",
    idealUseCases: ["UI-öncelikli", "Frontend odaklı", "Görsel tasarım talimatları"],
    promptStyle: "UI-first, frontend/page/component spec, visual design",
    supportsPlanFirst: true,
    supportsRepoInspection: false,
    supportsTerminalCommands: false,
    supportsMultiFileEditing: false,
    recommendedPromptFormat: "markdown",
    recommendedFileNames: ["lovable-prompt.md", "bolt-prompt.md", "roadmind-master-prompt.md"],
    outputFileRecommendation: "lovable-prompt.md",
    limitations: ["Sadece frontend", "Backend karmaşıklığı sınırlı"],
    templateSections: ["role", "context", "goals", "ui_requirements", "components", "styling", "phases"],
  },
  {
    id: "generic",
    displayName: "Genel AI Agent",
    description: "Universal prompt with explicit role/context/constraints for any agent.",
    idealUseCases: ["Evrensel prompt", "Bilinmeyen agent", "Standart talimatlar"],
    promptStyle: "universal, explicit role/context/constraints",
    supportsPlanFirst: true,
    supportsRepoInspection: true,
    supportsTerminalCommands: true,
    supportsMultiFileEditing: true,
    recommendedPromptFormat: "markdown",
    recommendedFileNames: ["roadmind-master-prompt.md", "roadmind-master-prompt.txt"],
    outputFileRecommendation: "roadmind-master-prompt.md",
    limitations: ["Agent-spesifik optimizasyon yok", "Genel kılavuz"],
    templateSections: ["role", "context", "goals", "constraints", "stack", "architecture", "implementation_order", "acceptance", "final_response"],
  },
];

export function getAgentById(id: string): AgentRegistryItem | undefined {
  return AGENT_REGISTRY.find((a) => a.id === id);
}

export function getRecommendedAgent(options: {
  platform: string;
  projectMaturity: string;
  outputMode: string;
}): AgentRegistryItem {
  // Simple recommendation logic
  if (options.outputMode === "ui_ux_build_prompt" || options.platform === "web" || options.platform === "mobile") {
    return AGENT_REGISTRY.find((a) => a.id === "lovable_bolt_v0") ?? AGENT_REGISTRY[0];
  }
  if (options.projectMaturity === "existing_to_improve" || options.projectMaturity === "existing_with_bugs") {
    return AGENT_REGISTRY.find((a) => a.id === "codex") ?? AGENT_REGISTRY[0];
  }
  if (options.platform === "embedded_iot" || options.platform === "cli_tool") {
    return AGENT_REGISTRY.find((a) => a.id === "cursor") ?? AGENT_REGISTRY[0];
  }
  return AGENT_REGISTRY.find((a) => a.id === "opencode") ?? AGENT_REGISTRY[0];
}
