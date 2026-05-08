import type { Risk } from "../types/analysis.js";
import { useT } from "../i18n/LanguageContext.js";

interface RiskAnalysisViewProps {
  risks: Risk[];
}

const impactStyle: Record<Risk["impact"], string> = {
  High:
    "border-rose-500/40 bg-rose-500/[0.06] shadow-[0_0_30px_-12px_rgba(244,63,94,0.6)]",
  Medium: "border-amber-500/40 bg-amber-500/[0.05]",
  Low: "border-emerald-500/30 bg-emerald-500/[0.04]",
};

const impactBadge: Record<Risk["impact"], string> = {
  High: "bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/40",
  Medium: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/40",
  Low: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30",
};

const impactDot: Record<Risk["impact"], string> = {
  High: "bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]",
  Medium: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
  Low: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]",
};

export function RiskAnalysisView({ risks }: RiskAnalysisViewProps) {
  const t = useT();
  return (
    <div className="card space-y-4">
      <div>
        <h3 className="font-display text-lg font-bold text-white">
          {t.riskSection.title}
        </h3>
        <p className="text-sm text-slate-400">{t.riskSection.subtitle}</p>
      </div>

      <div className="space-y-3 stagger">
        {risks.map((r, idx) => (
          <div
            key={`${r.risk}-${idx}`}
            className={[
              "relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5",
              impactStyle[r.impact],
            ].join(" ")}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${impactDot[r.impact]}`}
                />
                {r.risk}
              </div>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]",
                  impactBadge[r.impact],
                ].join(" ")}
              >
                {t.riskSection.impactLabel(
                  t.riskSection.levels[r.impact] ?? r.impact,
                )}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-slate-200">
                {t.riskSection.mitigation}
              </span>{" "}
              {r.solution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
