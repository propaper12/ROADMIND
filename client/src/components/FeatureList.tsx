import type { CoreFeature } from "../types/analysis.js";
import { useT } from "../i18n/LanguageContext.js";

interface FeatureListProps {
  features: CoreFeature[];
}

const priorityBadge: Record<CoreFeature["priority"], string> = {
  "Must Have":
    "bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/40 shadow-[0_0_18px_-6px_rgba(244,63,94,0.6)]",
  "Should Have":
    "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/40 shadow-[0_0_16px_-6px_rgba(245,158,11,0.55)]",
  "Nice to Have":
    "bg-slate-500/20 text-slate-200 ring-1 ring-slate-500/30",
};

const priorityDot: Record<CoreFeature["priority"], string> = {
  "Must Have": "bg-rose-400",
  "Should Have": "bg-amber-400",
  "Nice to Have": "bg-slate-400",
};

export function FeatureList({ features }: FeatureListProps) {
  const t = useT();
  return (
    <div className="card space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-white">
            {t.featuresSection.title}
          </h3>
          <p className="text-sm text-slate-400">
            {t.featuresSection.subtitle}
          </p>
        </div>
        <span className="chip-glow">{features.length}</span>
      </div>

      <ul className="grid gap-3 stagger md:grid-cols-2">
        {features.map((f) => (
          <li
            key={f.name}
            className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-500/30"
          >
            <span
              aria-hidden
              className={`absolute left-0 top-0 h-full w-[3px] ${priorityDot[f.priority]} opacity-70 transition-all duration-500 group-hover:opacity-100`}
            />
            <div className="flex flex-wrap items-start justify-between gap-2">
              <span className="font-display text-base font-bold text-white">
                {f.name}
              </span>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]",
                  priorityBadge[f.priority],
                ].join(" ")}
              >
                {t.featuresSection.priorities[f.priority] ?? f.priority}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {f.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
