import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type {
  ProjectAnalyzeInput,
  AIProvider,
  OutputMode,
  PlanMode,
  OutputDepth,
  CodingAgent,
  ProjectMaturity,
} from "../types/project.js";
import {
  analyzeProject,
  getApiErrorMessage,
  getApiErrorCode,
} from "../services/api.js";
import { useT } from "../i18n/LanguageContext.js";
import { StagedLoading } from "../components/StagedLoading.js";
import { ErrorState } from "../components/ErrorState.js";

const SAMPLE_IDEAS = [
  {
    title: "Takım görev planlama uygulaması",
    description:
      "Ekiplerin görevleri ataması, ilerlemeyi takip etmesi ve ekip içi iletişimi kolaylaştırması için basit bir web uygulaması.",
  },
  {
    title: "Alışkanlık takip uygulaması",
    description:
      "Kullanıcıların günlük alışkanlıklar oluşturması, sürekliliği takip etmesi ve motivasyonunu artırması için hafif bir mobil/web uygulaması.",
  },
  {
    title: "Lokal AI not analiz aracı",
    description:
      "Kullanıcıların notlarını yerel AI ile analiz etmesi, özet çıkarması ve bağlantıları bulması için gizlilik odaklı bir araç.",
  },
  {
    title: "Staj takip ve raporlama sistemi",
    description:
      "Üniversitelerin staj süreçlerini yönetmesi, öğrencilerin raporlarını dijital olarak sunması ve değerlendirmesini yapması için bir sistem.",
  },
];

const AI_PROVIDERS: { value: AIProvider; label: string }[] = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "cloud", label: "Ollama Cloud" },
  { value: "local", label: "Yerel Ollama" },
];

const OUTPUT_MODES: { value: OutputMode; label: string }[] = [
  { value: "full_project_plan", label: "Tam Proje Planı" },
  { value: "mvp_build_plan", label: "MVP Yapım Planı" },
  { value: "technical_roadmap", label: "Teknik Yol Haritası" },
  { value: "coding_agent_prompt", label: "Coding Agent Prompt" },
  { value: "backend_api_build_prompt", label: "Backend/API Prompt" },
  { value: "ui_ux_build_prompt", label: "UI/UX Prompt" },
  { value: "database_design_prompt", label: "Veritabanı Prompt" },
];

const PLAN_MODES: { value: PlanMode; label: string }[] = [
  { value: "plan_first", label: "Önce Plan Çıkar" },
  { value: "direct_build", label: "Doğrudan Yapım" },
];

const OUTPUT_DEPTHS: { value: OutputDepth; label: string }[] = [
  { value: "detailed", label: "Detaylı" },
  { value: "standard", label: "Standart" },
  { value: "very_detailed", label: "Çok Detaylı" },
  { value: "short", label: "Kısa" },
];

const CODING_AGENTS: { value: CodingAgent; label: string }[] = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "cursor", label: "Cursor" },
  { value: "opencode", label: "OpenCode" },
  { value: "openclaw", label: "OpenClaw" },
  { value: "windsurf", label: "Windsurf" },
  { value: "lovable_bolt_v0", label: "Lovable / Bolt / v0" },
  { value: "generic", label: "Genel AI Agent" },
];

const PROJECT_MATURITIES: { value: ProjectMaturity; label: string }[] = [
  { value: "just_idea", label: "Sadece bir fikir" },
  { value: "roughly_defined", label: "Kabaca tanımlı" },
  { value: "mvp_ready", label: "MVP hazır" },
  { value: "existing_to_improve", label: "Mevcut proje — iyileştirme" },
  { value: "existing_with_bugs", label: "Mevcut proje — hata düzeltme" },
];

const STACK_OPTIONS: Record<string, string[]> = {
  programmingLanguage: [
    "auto", "typescript", "javascript", "python", "go", "rust",
    "java", "csharp", "swift", "kotlin", "dart", "php", "ruby",
  ],
  runtime: [
    "auto", "nodejs", "bun", "deno", "python", "go", "jvm", "dotnet",
    "rust_native", "browser_only", "flutter",
  ],
  packageManager: [
    "auto", "npm", "pnpm", "yarn", "pip", "poetry", "cargo", "go_mod",
  ],
  frontendFramework: [
    "auto", "react_vite", "nextjs", "vue", "nuxt", "react_native",
    "flutter", "tauri", "electron",
  ],
  backendFramework: [
    "auto", "express", "fastify", "nestjs", "nextjs_api", "django",
    "fastapi", "gin", "spring_boot", "actix",
  ],
  database: [
    "auto", "postgresql", "sqlite", "mongodb", "mysql", "redis",
    "chroma", "qdrant", "firestore",
  ],
  orm: [
    "auto", "prisma", "drizzle", "typeorm", "mongoose", "sqlalchemy",
    "gorm", "sqlc",
  ],
  uiStyling: [
    "auto", "tailwind", "css_modules", "plain_css", "shadcn",
    "material_ui", "chakra_ui", "bootstrap",
  ],
  testing: [
    "auto", "vitest", "jest", "playwright", "cypress", "pytest",
    "go_test", "cargo_test", "none",
  ],
  deployment: [
    "auto", "docker", "vercel", "railway", "fly_io", "aws",
    "render", "kubernetes", "netlify", "local_only",
  ],
};

function mapOption(val: string): string {
  const map: Record<string, string> = {
    auto: "Otomatik seçim",
    typescript: "TypeScript",
    javascript: "JavaScript",
    python: "Python",
    go: "Go",
    rust: "Rust",
    java: "Java",
    csharp: "C#",
    swift: "Swift",
    kotlin: "Kotlin",
    dart: "Dart",
    php: "PHP",
    ruby: "Ruby",
    nodejs: "Node.js",
    bun: "Bun",
    deno: "Deno",
    jvm: "JVM",
    dotnet: ".NET",
    rust_native: "Rust (native)",
    browser_only: "Tarayıcı",
    flutter: "Flutter",
    npm: "npm",
    pnpm: "pnpm",
    yarn: "Yarn",
    pip: "pip",
    poetry: "Poetry",
    cargo: "Cargo",
    go_mod: "Go Modules",
    react_vite: "React + Vite",
    nuxt: "Nuxt",
    tauri: "Tauri",
    electron: "Electron",
    react_native: "React Native",
    fastify: "Fastify",
    nestjs: "NestJS",
    nextjs_api: "Next.js API",
    django: "Django",
    fastapi: "FastAPI",
    gin: "Gin",
    spring_boot: "Spring Boot",
    actix: "Actix",
    postgresql: "PostgreSQL",
    sqlite: "SQLite",
    mongodb: "MongoDB",
    mysql: "MySQL",
    redis: "Redis",
    firestore: "Firestore",
    prisma: "Prisma",
    drizzle: "Drizzle",
    typeorm: "TypeORM",
    mongoose: "Mongoose",
    sqlalchemy: "SQLAlchemy",
    gorm: "GORM",
    sqlc: "sqlc",
    tailwind: "Tailwind CSS",
    css_modules: "CSS Modules",
    plain_css: "Plain CSS",
    shadcn: "shadcn/ui",
    material_ui: "Material UI",
    chakra_ui: "Chakra UI",
    bootstrap: "Bootstrap",
    vitest: "Vitest",
    jest: "Jest",
    playwright: "Playwright",
    cypress: "Cypress",
    pytest: "Pytest",
    go_test: "Go test",
    cargo_test: "Cargo test",
    docker: "Docker",
    vercel: "Vercel",
    railway: "Railway",
    fly_io: "Fly.io",
    aws: "AWS",
    render: "Render",
    kubernetes: "Kubernetes",
    netlify: "Netlify",
    local_only: "Yerel",
    nextjs: "Next.js",
    vue: "Vue",
    chroma: "ChromaDB",
    qdrant: "Qdrant",
  };
  return map[val] || val;
}

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftParam = searchParams.get("draft");
  const draft = draftParam
    ? (JSON.parse(decodeURIComponent(draftParam)) as Partial<ProjectAnalyzeInput>)
    : null;
  // const t = useT();

  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [providerStatus, _setProviderStatus] = useState<string>("idle");

  // Core fields
  const [title, setTitle] = useState(draft?.title ?? "");
  const [description, setDescription] = useState(draft?.description ?? "");

  // AI Provider
  const [aiProvider, setAiProvider] = useState<AIProvider>(
    draft?.aiProvider ?? "auto"
  );
  const [selectedModel, setSelectedModel] = useState(draft?.selectedModel ?? "");

  // Output config
  const [outputMode, setOutputMode] = useState<OutputMode>(
    draft?.outputMode ?? "full_project_plan"
  );
  const [planMode, setPlanMode] = useState<PlanMode>(
    draft?.planMode ?? "plan_first"
  );
  const [outputDepth, setOutputDepth] = useState<OutputDepth>(
    draft?.outputDepth ?? "detailed"
  );

  // Context
  const [targetPlatform, setTargetPlatform] = useState(
    draft?.targetPlatform ?? "Web"
  );
  const [codingAgent, setCodingAgent] = useState<CodingAgent>(
    draft?.codingAgent ?? "auto"
  );
  const [projectMaturity, setProjectMaturity] = useState<ProjectMaturity>(
    draft?.projectMaturity ?? "just_idea"
  );

  // Legacy fields
  const [difficultyLevel, setDifficultyLevel] = useState(
    draft?.difficultyLevel ?? "Intermediate"
  );
  const [priority, setPriority] = useState(draft?.priority ?? "Maintainability");
  const [preferredTechnologies, setPreferredTechnologies] = useState(
    draft?.preferredTechnologies ?? ""
  );
  const [roadmapDurationWeeks, setRoadmapDurationWeeks] = useState(
    draft?.roadmapDurationWeeks ?? 8
  );

  // Advanced stack options
  const [programmingLanguage, setProgrammingLanguage] = useState("auto");
  const [runtime, setRuntime] = useState("auto");
  const [packageManager, setPackageManager] = useState("auto");
  const [frontendFramework, setFrontendFramework] = useState("auto");
  const [backendFramework, setBackendFramework] = useState("auto");
  const [database, setDatabase] = useState("auto");
  const [orm, setOrm] = useState("auto");
  const [uiStyling, setUiStyling] = useState("auto");
  const [testing, setTesting] = useState("auto");
  const [deployment, setDeployment] = useState("auto");

  // Requirement toggles
  const [requirements, setRequirements] = useState({
    authentication: false,
    adminPanel: false,
    database: false,
    aiIntegration: false,
    fileUpload: false,
    realtimeFeatures: false,
    paymentSubscription: false,
    notifications: false,
    multiLanguage: false,
    offlineSupport: false,
    mobileResponsive: false,
    deploymentPlan: false,
    testingPlan: false,
    securityPlan: false,
    analytics: false,
  });

  // Input quality
  const quality = useMemo(() => {
    let score = 0;
    if (title.length >= 3) score += 15;
    if (description.length >= 50) score += 40;
    if (aiProvider && selectedModel) score += 5;
    if (targetPlatform && targetPlatform !== "auto") score += 10;
    if (codingAgent && outputMode) score += 10;
    if (showAdvanced) score += 10;
    if (Object.values(requirements).some(Boolean)) score += 5;
    if (preferredTechnologies.length > 0) score += 5;
    return score;
  }, [
    title,
    description,
    aiProvider,
    selectedModel,
    targetPlatform,
    codingAgent,
    outputMode,
    showAdvanced,
    requirements,
    preferredTechnologies,
  ]);

  const qualityHint = useMemo(() => {
    if (title.length === 0 || description.length === 0) {
      return "Devam etmek için proje başlığı ve açıklaması girin.";
    }
    if (description.length < 50) {
      return "Daha isabetli sonuç için problem, hedef kullanıcı, ana özellikler ve başarı kriterlerini ekleyin.";
    }
    return "Girdi teknik plan ve prompt üretimi için yeterli görünüyor.";
  }, [title, description]);

  const isFormValid = title.length >= 3 && description.length >= 20;

  const handleSubmit = useCallback(async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError(null);
    setErrorCode(null);
    setLoadingStage(1);

    const interval = setInterval(() => {
      setLoadingStage((prev) => Math.min(prev + 1, 9));
    }, 2500);

    try {
      const input: ProjectAnalyzeInput = {
        title,
        description,
        targetPlatform: targetPlatform as any,
        difficultyLevel: difficultyLevel as any,
        priority: priority as any,
        preferredTechnologies: preferredTechnologies || undefined,
        roadmapDurationWeeks,
        aiProvider,
        selectedModel: selectedModel || undefined,
        outputMode,
        planMode,
        outputDepth,
        codingAgent,
        projectMaturity,
        programmingLanguage: showAdvanced ? programmingLanguage : undefined,
        runtime: showAdvanced ? runtime : undefined,
        packageManager: showAdvanced ? packageManager : undefined,
        frontendFramework: showAdvanced ? frontendFramework : undefined,
        backendFramework: showAdvanced ? backendFramework : undefined,
        database: showAdvanced ? database : undefined,
        orm: showAdvanced ? orm : undefined,
        uiStyling: showAdvanced ? uiStyling : undefined,
        testing: showAdvanced ? testing : undefined,
        deployment: showAdvanced ? deployment : undefined,
        requirementToggles: requirements,
      };

      const project = await analyzeProject(input);
      navigate(`/projects/${project.id}`);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setErrorCode(getApiErrorCode(e));
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, [
    isFormValid,
    title,
    description,
    targetPlatform,
    difficultyLevel,
    priority,
    preferredTechnologies,
    roadmapDurationWeeks,
    aiProvider,
    selectedModel,
    outputMode,
    planMode,
    outputDepth,
    codingAgent,
    projectMaturity,
    showAdvanced,
    programmingLanguage,
    runtime,
    packageManager,
    frontendFramework,
    backendFramework,
    database,
    orm,
    uiStyling,
    testing,
    deployment,
    requirements,
    navigate,
  ]);

  const applySample = useCallback((sample: { title: string; description: string }) => {
    setTitle(sample.title);
    setDescription(sample.description);
  }, []);

  const toggleRequirement = useCallback(
    (key: string) => {
      setRequirements((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    },
    []
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="animate-fade-up relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-transparent p-6 backdrop-blur-xl md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 animate-float-slow rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, #38bdf8, #a855f7, #ec4899, #38bdf8)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-brand-500/30 opacity-50 blur-[110px]"
        />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="chip-glow">
            <span className="ring-status-dot" />
            Roadmind v2.0
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-white md:text-5xl">
            Fikrinizi seçtiğiniz platforma göre{" "}
            <span className="gradient-text-animated">teknik plana</span> ve
            hazır{" "}
            <span className="relative inline-block">
              coding-agent
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-brand-400 via-accent-400 to-pink-400" />
            </span>{" "}
            prompt dosyasına dönüştürün.
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
            Proje fikrinizi anlatın. Roadmind, seçtiğiniz Ollama sağlayıcısıyla
            platform, teknoloji yığını, veritabanı stratejisi, geliştirme yol
            haritası ve coding agent'a verilebilir prompt dosyası oluştursun.
          </p>
        </div>
      </section>

      {loading && <StagedLoading stage={loadingStage} provider={aiProvider} />}

      {error && !loading && (
        <ErrorState
          message={error}
          code={errorCode}
          onRetry={() => {
            setError(null);
            setErrorCode(null);
          }}
          onRefresh={() => window.location.reload()}
        />
      )}

      {/* Form */}
      {!loading && (
        <>
          {/* Core Input */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                01
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                Proje Fikri
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </div>

            {/* Sample ideas */}
            <div className="flex flex-wrap gap-2">
              {SAMPLE_IDEAS.map((sample) => (
                <button
                  key={sample.title}
                  type="button"
                  onClick={() => applySample(sample)}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 transition hover:border-brand-500/30 hover:text-white"
                >
                  {sample.title}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="label" htmlFor="title">
                  Proje Başlığı
                </label>
                <input
                  id="title"
                  type="text"
                  className="input-field w-full"
                  placeholder="Örn: Takım görev planlama uygulaması"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="label" htmlFor="duration">
                  Tahmini Süre (hafta)
                </label>
                <input
                  id="duration"
                  type="number"
                  min={1}
                  max={52}
                  className="input-field w-full"
                  value={roadmapDurationWeeks}
                  onChange={(e) =>
                    setRoadmapDurationWeeks(Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label" htmlFor="description">
                Proje Açıklaması
              </label>
              <textarea
                id="description"
                rows={6}
                className="input-field w-full resize-none"
                placeholder="Projenizi detaylı açıklayın: ne yapacağı, kimler kullanacak, ana özellikler neler, hangi problemi çözüyor..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{description.length} karakter</span>
                <span>Min: 20</span>
              </div>
            </div>
          </section>

          {/* AI Provider */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                02
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                AI Sağlayıcı
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="label">Sağlayıcı</label>
                <select
                  className="input-field w-full"
                  value={aiProvider}
                  onChange={(e) =>
                    setAiProvider(e.target.value as AIProvider)
                  }
                >
                  {AI_PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="label">Model</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="auto veya model adı"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <div
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                    providerStatus === "ok"
                      ? "border-emerald-900/50 bg-emerald-950/30 text-emerald-200"
                      : providerStatus === "error"
                      ? "border-rose-900/50 bg-rose-950/30 text-rose-200"
                      : "border-white/[0.08] bg-white/[0.02] text-slate-400"
                  }`}
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      providerStatus === "ok"
                        ? "bg-emerald-400"
                        : providerStatus === "error"
                        ? "bg-rose-400"
                        : "bg-amber-400"
                    }`}
                  />
                  {providerStatus === "ok"
                    ? "Bağlantı başarılı"
                    : providerStatus === "error"
                    ? "Bağlantı hatası"
                    : "Bağlantı bekleniyor"}
                </div>
              </div>
            </div>
          </section>

          {/* Output Configuration */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                03
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                Hedef Çıktı
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="label">Çıktı Modu</label>
                <select
                  className="input-field w-full"
                  value={outputMode}
                  onChange={(e) =>
                    setOutputMode(e.target.value as OutputMode)
                  }
                >
                  {OUTPUT_MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="label">Plan Modu</label>
                <select
                  className="input-field w-full"
                  value={planMode}
                  onChange={(e) => setPlanMode(e.target.value as PlanMode)}
                >
                  {PLAN_MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="label">Çıktı Derinliği</label>
                <select
                  className="input-field w-full"
                  value={outputDepth}
                  onChange={(e) =>
                    setOutputDepth(e.target.value as OutputDepth)
                  }
                >
                  {OUTPUT_DEPTHS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Build Context */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                04
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                Yapım Bağlamı
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="label">Hedef Platform</label>
                <select
                  className="input-field w-full"
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                >
                  <option value="Web">Web App</option>
                  <option value="Mobile">Mobil App</option>
                  <option value="Desktop">Masaüstü</option>
                  <option value="API">Backend/API</option>
                  <option value="AI Tool">AI Aracı</option>
                  <option value="Embedded">Gömülü/IoT</option>
                  <option value="Other">Diğer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="label">Coding Agent</label>
                <select
                  className="input-field w-full"
                  value={codingAgent}
                  onChange={(e) =>
                    setCodingAgent(e.target.value as CodingAgent)
                  }
                >
                  {CODING_AGENTS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="label">Proje Olgunluğu</label>
                <select
                  className="input-field w-full"
                  value={projectMaturity}
                  onChange={(e) =>
                    setProjectMaturity(e.target.value as ProjectMaturity)
                  }
                >
                  {PROJECT_MATURITIES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Advanced Options */}
          <section className="space-y-4">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-brand-200"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Gelişmiş Teknik Tercihler
            </button>

            {showAdvanced && (
              <div className="grid gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 md:grid-cols-2">
                {Object.entries(STACK_OPTIONS).map(([key, options]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                    </label>
                    <select
                      className="input-field w-full text-sm"
                      value={
                        {
                          programmingLanguage,
                          runtime,
                          packageManager,
                          frontendFramework,
                          backendFramework,
                          database,
                          orm,
                          uiStyling,
                          testing,
                          deployment,
                        }[key]
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        const setterMap: Record<string, (v: string) => void> = {
                          programmingLanguage: setProgrammingLanguage,
                          runtime: setRuntime,
                          packageManager: setPackageManager,
                          frontendFramework: setFrontendFramework,
                          backendFramework: setBackendFramework,
                          database: setDatabase,
                          orm: setOrm,
                          uiStyling: setUiStyling,
                          testing: setTesting,
                          deployment: setDeployment,
                        };
                        setterMap[key]?.(val);
                      }}
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {mapOption(opt)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Requirement Toggles */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                05
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                Gereksinimler
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Object.entries(requirements).map(([key, value]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    value
                      ? "border-brand-500/30 bg-brand-500/[0.06]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleRequirement(key)}
                    className="h-4 w-4 accent-brand-500"
                  />
                  <span className="text-xs text-slate-300">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Input Quality */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Girdi Kalitesi</h3>
              <span className="font-mono text-sm text-brand-300">
                {quality}/100
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${quality}%`,
                  background:
                    quality >= 80
                      ? "#34d399"
                      : quality >= 50
                      ? "#fbbf24"
                      : "#f87171",
                }}
              />
            </div>
            <p className="text-xs text-slate-500">{qualityHint}</p>
          </section>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className="btn-primary"
            >
              Teknik plan ve prompt taslağını üret
            </button>
          </div>
        </>
      )}
    </div>
  );
}
