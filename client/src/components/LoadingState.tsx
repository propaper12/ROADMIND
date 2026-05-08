import { useEffect, useState } from "react";
import { useT } from "../i18n/LanguageContext.js";

export function LoadingState() {
  const t = useT();
  const stages = t.loading.stages;
  const [stage, setStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s + 1) % stages.length);
    }, 2800);
    const tick = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(tick);
    };
  }, [stages.length]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const elapsedLabel = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="card relative overflow-hidden border-brand-500/20 p-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(56,189,248,0.08) 45%, rgba(168,85,247,0.06) 55%, transparent 100%)",
          animation: "scan 3.6s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-30"
      />

      <div className="relative grid gap-8 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
        <div className="relative mx-auto h-32 w-32 md:mx-0">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-60"
            style={{
              background:
                "conic-gradient(from 0deg, #38bdf8, #818cf8, #c084fc, #38bdf8)",
              animation: "spin 6s linear infinite",
            }}
          />
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#38bdf8",
              borderRightColor: "rgba(168,85,247,0.6)",
              animation: "spin 1.4s linear infinite",
            }}
          />
          <div
            className="absolute inset-3 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: "#a855f7",
              borderLeftColor: "rgba(56,189,248,0.5)",
              animation: "spin 2.2s linear infinite reverse",
            }}
          />
          <div className="absolute inset-6 rounded-full bg-white/[0.03] backdrop-blur" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-300">
                {t.loading.elapsedLabel}
              </div>
              <div className="font-mono text-base font-bold text-white">
                {elapsedLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              <span className="ring-status-dot" />
              {t.loading.badge}
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">
              {stages[stage]}
              <span className="ml-1 inline-block w-2 -mb-0.5 align-baseline">
                <span className="block h-4 w-[2px] bg-brand-300 animate-blink" />
              </span>
            </h3>
            <p className="mt-1 max-w-md text-sm text-slate-400">
              {t.loading.paragraph}
            </p>
            <p className="mt-2 max-w-md text-[11px] text-slate-500">
              {t.loading.privacy}
            </p>
          </div>

          <ol className="space-y-1.5">
            {stages.map((label, i) => {
              const status =
                i < stage ? "done" : i === stage ? "active" : "pending";
              return (
                <li
                  key={label}
                  className="flex items-center gap-3 text-[13px] transition-colors"
                >
                  <span
                    className={[
                      "relative flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      status === "done"
                        ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40"
                        : status === "active"
                          ? "bg-brand-500/15 text-brand-200 ring-1 ring-brand-400/50"
                          : "bg-white/[0.04] text-slate-500 ring-1 ring-white/10",
                    ].join(" ")}
                  >
                    {status === "active" && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/40" />
                    )}
                    {status === "done" ? (
                      <svg viewBox="0 0 14 14" className="h-3 w-3">
                        <path
                          d="M3 7.5l3 3 5-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </span>
                  <span
                    className={
                      status === "active"
                        ? "text-white"
                        : status === "done"
                          ? "text-slate-300 line-through decoration-emerald-400/40"
                          : "text-slate-500"
                    }
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
