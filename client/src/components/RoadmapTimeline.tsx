import type { RoadmapWeek } from "../types/analysis.js";
import { useT } from "../i18n/LanguageContext.js";

interface RoadmapTimelineProps {
  weeks: RoadmapWeek[];
}

export function RoadmapTimeline({ weeks }: RoadmapTimelineProps) {
  const t = useT();
  const sorted = [...weeks].sort((a, b) => a.week - b.week);

  return (
    <div className="card space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-white">
            {t.roadmapSection.title}
          </h3>
          <p className="text-sm text-slate-400">
            {t.roadmapSection.subtitle}
          </p>
        </div>
        <span className="chip-glow">
          {t.roadmapSection.weeksLabel(sorted.length)}
        </span>
      </div>

      <ol
        className="relative space-y-5 pl-8"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(56,189,248,0.6), rgba(168,85,247,0.4), rgba(56,189,248,0.05))",
          backgroundSize: "2px 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "11px 0",
        }}
      >
        {sorted.map((w, i) => (
          <li
            key={w.week}
            className="relative"
            style={{ animation: `fadeUp 0.5s ${i * 0.06}s both` }}
          >
            <span
              className="absolute -left-8 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-brand-500/40 bg-slate-950 font-mono text-[11px] font-bold text-brand-200 shadow-[0_0_22px_-6px_rgba(56,189,248,0.7)]"
            >
              {w.week}
            </span>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand-500/20 hover:bg-white/[0.04]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-300">
                  {t.roadmapSection.weekLabel(w.week)}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="font-display text-base font-bold text-white">
                  {w.title}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                {w.tasks.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2 text-sm text-emerald-100">
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  aria-hidden
                  className="text-emerald-300"
                >
                  <path
                    d="M3 8.5l3 3 7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>
                  <span className="font-semibold text-emerald-200">
                    {t.roadmapSection.deliverable}
                  </span>{" "}
                  {w.deliverable}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
