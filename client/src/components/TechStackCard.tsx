import type { RecommendedStack } from "../types/analysis.js";
import { useT } from "../i18n/LanguageContext.js";

interface TechStackCardProps {
  stack: RecommendedStack;
}

const ICONS: Record<string, JSX.Element> = {
  Frontend: (
    <path
      d="M4 6h16M4 6v12h16V6M8 10h8M8 14h5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  ),
  Backend: (
    <>
      <rect
        x="4"
        y="5"
        width="16"
        height="5"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="14"
        width="16"
        height="5"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="7.5" cy="7.5" r="0.7" fill="currentColor" />
      <circle cx="7.5" cy="16.5" r="0.7" fill="currentColor" />
    </>
  ),
  Database: (
    <>
      <ellipse
        cx="12"
        cy="6"
        rx="7"
        ry="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </>
  ),
  "AI / automation": (
    <>
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  Deployment: (
    <path
      d="M5 17l3-3 3 2 5-7 3 3v8H5z M5 17h14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  Testing: (
    <>
      <path
        d="M9 4v5l-4 8a3 3 0 0 0 2.7 4.4h8.6A3 3 0 0 0 19 17l-4-8V4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 4h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
};

function Row({
  title,
  label,
  tech,
}: {
  title: string;
  label: string;
  tech: { technology: string; reason: string };
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-white/[0.04]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at 30% 0%, rgba(168,85,247,0.18), transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-500/30 bg-brand-500/[0.08] text-brand-200">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
              {ICONS[title] ?? ICONS.Backend}
            </svg>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
            {label}
          </div>
        </div>
        <div className="mt-3 font-display text-base font-bold text-white">
          {tech.technology}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
          {tech.reason}
        </p>
      </div>
    </div>
  );
}

export function TechStackCard({ stack }: TechStackCardProps) {
  const t = useT();
  const cat = t.techStack.categories;
  return (
    <div className="card space-y-4">
      <div>
        <h3 className="font-display text-lg font-bold text-white">
          {t.techStack.title}
        </h3>
        <p className="text-sm text-slate-400">{t.techStack.subtitle}</p>
      </div>
      <div className="grid gap-3 stagger md:grid-cols-2 lg:grid-cols-3">
        <Row title="Frontend" label={cat.Frontend} tech={stack.frontend} />
        <Row title="Backend" label={cat.Backend} tech={stack.backend} />
        <Row title="Database" label={cat.Database} tech={stack.database} />
        <Row
          title="AI / automation"
          label={cat["AI / automation"]}
          tech={stack.ai}
        />
        <Row
          title="Deployment"
          label={cat.Deployment}
          tech={stack.deployment}
        />
        <Row title="Testing" label={cat.Testing} tech={stack.testing} />
      </div>
    </div>
  );
}
