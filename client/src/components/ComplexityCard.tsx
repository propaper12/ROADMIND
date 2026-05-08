import { useEffect, useState } from "react";
import type { ComplexityAnalysis } from "../types/analysis.js";
import { useT } from "../i18n/LanguageContext.js";

interface ComplexityCardProps {
  complexity: ComplexityAnalysis;
}

function scoreColor(score: number) {
  if (score >= 8) return "from-rose-500 via-pink-500 to-orange-400";
  if (score >= 5) return "from-brand-500 via-indigo-400 to-accent-400";
  return "from-emerald-400 via-teal-400 to-brand-400";
}

export function ComplexityCard({ complexity }: ComplexityCardProps) {
  const t = useT();
  const [animatedScore, setAnimatedScore] = useState(0);
  const target = Math.min(10, Math.max(0, complexity.score));

  const scoreLabel =
    target >= 8
      ? t.complexity.levels.high
      : target >= 5
        ? t.complexity.levels.mid
        : t.complexity.levels.low;

  useEffect(() => {
    let frame = 0;
    const total = 36;
    const t = setInterval(() => {
      frame += 1;
      const eased = 1 - Math.pow(1 - frame / total, 3);
      setAnimatedScore(Math.min(target, +(target * eased).toFixed(1)));
      if (frame >= total) {
        setAnimatedScore(target);
        clearInterval(t);
      }
    }, 22);
    return () => clearInterval(t);
  }, [target]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dash = (animatedScore / 10) * circumference;

  return (
    <div className="card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white">
            {t.complexity.title}
          </h3>
          <p className="max-w-md text-sm text-slate-400">
            {t.complexity.subtitle}
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200">
            <span
              className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${scoreColor(target)}`}
            />
            {scoreLabel}
          </div>
        </div>

        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient
                id="cx-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#cx-grad)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              style={{
                transition: "stroke-dasharray 0.6s ease",
                filter: "drop-shadow(0 0 10px rgba(56,189,248,0.4))",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {t.complexity.scoreLabel}
            </div>
            <div className="font-display text-3xl font-bold text-white">
              {animatedScore.toFixed(1)}
            </div>
            <div className="font-mono text-[10px] text-slate-500">/ 10</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t.complexity.duration}
          </dt>
          <dd className="mt-1 font-display text-lg font-bold text-white">
            {t.complexity.weeks(complexity.estimatedDurationWeeks)}
          </dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t.complexity.skill}
          </dt>
          <dd className="mt-1 font-display text-lg font-bold text-white">
            {t.difficulties[complexity.requiredSkillLevel] ??
              complexity.requiredSkillLevel}
          </dd>
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {t.complexity.challenges}
        </h4>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
          {complexity.mainChallenges.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-brand-400" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
