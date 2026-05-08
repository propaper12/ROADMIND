import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export const optionsRouter = Router();

const AI_PROVIDERS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "cloud", label: "Ollama Cloud" },
  { value: "local", label: "Yerel Ollama" },
];

const OUTPUT_MODES = [
  { value: "technical_roadmap", label: "Teknik Yol Haritası" },
  { value: "coding_agent_prompt", label: "Coding Agent Prompt" },
  { value: "full_project_plan", label: "Tam Proje Planı" },
  { value: "mvp_build_plan", label: "MVP Yapım Planı" },
  { value: "production_build_plan", label: "Prodüksiyon Yapım Planı" },
  { value: "existing_project_improvement", label: "Mevcut Proje İyileştirme" },
  { value: "ui_ux_build_prompt", label: "UI/UX Yapım Promptu" },
  { value: "backend_api_build_prompt", label: "Backend/API Yapım Promptu" },
  { value: "database_design_prompt", label: "Veritabanı Tasarım Promptu" },
  { value: "final_qa_prompt", label: "Son QA Promptu" },
];

const PLAN_MODES = [
  { value: "plan_first", label: "Önce Plan" },
  { value: "direct_build", label: "Doğrudan Yapım" },
];

const OUTPUT_DEPTHS = [
  { value: "short", label: "Kısa" },
  { value: "standard", label: "Standart" },
  { value: "detailed", label: "Detaylı" },
  { value: "very_detailed", label: "Çok Detaylı" },
];

const CODING_AGENTS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "cursor", label: "Cursor" },
  { value: "opencode", label: "OpenCode" },
  { value: "openclaw", label: "OpenClaw" },
  { value: "codex", label: "Codex" },
  { value: "windsurf", label: "Windsurf" },
  { value: "aider", label: "Aider" },
  { value: "continue", label: "Continue" },
  { value: "lovable_bolt_v0", label: "Lovable / Bolt / v0" },
  { value: "generic", label: "Genel AI Agent" },
];

const PLATFORMS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "web", label: "Web App" },
  { value: "mobile", label: "Mobil App" },
  { value: "desktop", label: "Masaüstü App" },
  { value: "backend_api", label: "Backend API" },
  { value: "saas", label: "SaaS" },
  { value: "ai_tool", label: "AI Aracı" },
  { value: "browser_extension", label: "Tarayıcı Eklentisi" },
  { value: "embedded_iot", label: "Gömülü / IoT" },
  { value: "data_dashboard", label: "Veri Paneli" },
  { value: "game_simulation", label: "Oyun / Simülasyon" },
  { value: "cli_tool", label: "CLI Aracı" },
  { value: "developer_tool", label: "Geliştiri Aracı" },
  { value: "ecommerce", label: "E-ticaret" },
  { value: "admin_dashboard", label: "Admin Paneli" },
  { value: "other", label: "Diğer" },
];

const PROJECT_MATURITIES = [
  { value: "just_idea", label: "Sadece bir fikir" },
  { value: "roughly_defined", label: "Kabataslak tanımlı" },
  { value: "mvp_ready", label: "MVP-hazır" },
  { value: "existing_to_improve", label: "Mevcut proje — iyileştirme" },
  { value: "existing_with_bugs", label: "Mevcut proje — hata düzeltme" },
  { value: "existing_ui_polish", label: "Mevcut proje — UI parlatma" },
  { value: "existing_backend_refactor", label: "Mevcut proje — backend/DB refactor" },
];

const LANGUAGES = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "dart", label: "Dart" },
  { value: "cpp", label: "C/C++" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "other", label: "Diğer" },
];

const RUNTIMES = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "nodejs", label: "Node.js" },
  { value: "bun", label: "Bun" },
  { value: "deno", label: "Deno" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go runtime" },
  { value: "jvm", label: "Java JVM" },
  { value: "dotnet", label: ".NET" },
  { value: "rust_native", label: "Rust native" },
  { value: "browser_only", label: "Yalnızca Tarayıcı" },
  { value: "mobile_native", label: "Mobil native" },
  { value: "other", label: "Diğer" },
];

const PACKAGE_MANAGERS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "npm", label: "npm" },
  { value: "pnpm", label: "pnpm" },
  { value: "yarn", label: "yarn" },
  { value: "bun", label: "bun" },
  { value: "pip", label: "pip" },
  { value: "poetry", label: "poetry" },
  { value: "uv", label: "uv" },
  { value: "cargo", label: "cargo" },
  { value: "go_modules", label: "go modules" },
  { value: "maven", label: "Maven" },
  { value: "gradle", label: "Gradle" },
  { value: "nuget", label: "NuGet" },
  { value: "pub", label: "pub" },
  { value: "other", label: "Diğer" },
];

const FRONTEND_FRAMEWORKS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "react_vite", label: "React + Vite" },
  { value: "nextjs", label: "Next.js" },
  { value: "vue", label: "Vue" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "angular", label: "Angular" },
  { value: "solid", label: "Solid" },
  { value: "plain_html_css", label: "Düz HTML/CSS/JS" },
  { value: "react_native", label: "React Native" },
  { value: "flutter", label: "Flutter" },
  { value: "swiftui", label: "SwiftUI" },
  { value: "jetpack_compose", label: "Jetpack Compose" },
  { value: "electron", label: "Electron" },
  { value: "tauri", label: "Tauri" },
  { value: "none", label: "Yok" },
  { value: "other", label: "Diğer" },
];

const BACKEND_FRAMEWORKS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "express", label: "Express" },
  { value: "fastify", label: "Fastify" },
  { value: "nestjs", label: "NestJS" },
  { value: "hono", label: "Hono" },
  { value: "nextjs_api", label: "Next.js API Routes" },
  { value: "django", label: "Django" },
  { value: "fastapi", label: "FastAPI" },
  { value: "flask", label: "Flask" },
  { value: "spring_boot", label: "Spring Boot" },
  { value: "aspnet_core", label: "ASP.NET Core" },
  { value: "go_fiber", label: "Go Fiber" },
  { value: "gin", label: "Gin" },
  { value: "actix", label: "Actix" },
  { value: "axum", label: "Axum" },
  { value: "none", label: "Yok" },
  { value: "other", label: "Diğer" },
];

const DATABASES = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "none", label: "Veritabanı Gerekmez" },
  { value: "sqlite", label: "SQLite" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "mongodb", label: "MongoDB" },
  { value: "redis", label: "Redis" },
  { value: "duckdb", label: "DuckDB" },
  { value: "indexeddb", label: "IndexedDB" },
  { value: "localstorage", label: "LocalStorage" },
  { value: "firestore", label: "Firebase Firestore" },
  { value: "supabase", label: "Supabase Postgres" },
  { value: "chroma", label: "Chroma" },
  { value: "qdrant", label: "Qdrant" },
  { value: "weaviate", label: "Weaviate" },
  { value: "milvus", label: "Milvus" },
  { value: "other", label: "Diğer" },
];

const ORMS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "prisma", label: "Prisma" },
  { value: "drizzle", label: "Drizzle" },
  { value: "typeorm", label: "TypeORM" },
  { value: "sequelize", label: "Sequelize" },
  { value: "mongoose", label: "Mongoose" },
  { value: "sqlalchemy", label: "SQLAlchemy" },
  { value: "django_orm", label: "Django ORM" },
  { value: "entity_framework", label: "Entity Framework" },
  { value: "gorm", label: "GORM" },
  { value: "sqlc", label: "sqlc" },
  { value: "diesel", label: "Diesel" },
  { value: "sqlx", label: "sqlx" },
  { value: "none", label: "Yok" },
  { value: "other", label: "Diğer" },
];

const UI_STYLINGS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "css_modules", label: "CSS Modules" },
  { value: "plain_css", label: "Düz CSS" },
  { value: "scss", label: "SCSS" },
  { value: "shadcn", label: "shadcn/ui" },
  { value: "material_ui", label: "Material UI" },
  { value: "chakra_ui", label: "Chakra UI" },
  { value: "radix_ui", label: "Radix UI" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "native_ui", label: "Native UI" },
  { value: "other", label: "Diğer" },
];

const TESTING_TOOLS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "vitest", label: "Vitest" },
  { value: "jest", label: "Jest" },
  { value: "react_testing_library", label: "React Testing Library" },
  { value: "playwright", label: "Playwright" },
  { value: "cypress", label: "Cypress" },
  { value: "pytest", label: "Pytest" },
  { value: "junit", label: "JUnit" },
  { value: "xunit", label: "xUnit" },
  { value: "go_test", label: "Go test" },
  { value: "cargo_test", label: "Cargo test" },
  { value: "postman_newman", label: "Postman/Newman" },
  { value: "none", label: "MVP için yok" },
  { value: "other", label: "Diğer" },
];

const DEPLOYMENT_TARGETS = [
  { value: "auto", label: "Otomatik seçim" },
  { value: "local_only", label: "Yalnızca Yerel" },
  { value: "docker", label: "Docker" },
  { value: "vercel", label: "Vercel" },
  { value: "netlify", label: "Netlify" },
  { value: "render", label: "Render" },
  { value: "railway", label: "Railway" },
  { value: "flyio", label: "Fly.io" },
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "gcp", label: "GCP" },
  { value: "vps", label: "VPS" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "embedded_device", label: "Gömülü Cihaz" },
  { value: "other", label: "Diğer" },
];

optionsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({
      aiProviders: AI_PROVIDERS,
      outputModes: OUTPUT_MODES,
      planModes: PLAN_MODES,
      outputDepths: OUTPUT_DEPTHS,
      codingAgents: CODING_AGENTS,
      platforms: PLATFORMS,
      projectMaturities: PROJECT_MATURITIES,
      languages: LANGUAGES,
      runtimes: RUNTIMES,
      packageManagers: PACKAGE_MANAGERS,
      frontendFrameworks: FRONTEND_FRAMEWORKS,
      backendFrameworks: BACKEND_FRAMEWORKS,
      databases: DATABASES,
      orms: ORMS,
      uiStylings: UI_STYLINGS,
      testingTools: TESTING_TOOLS,
      deploymentTargets: DEPLOYMENT_TARGETS,
    });
  }),
);
