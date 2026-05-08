import { Link, useNavigate } from "react-router-dom";
import type { ProjectListItem } from "../types/project.js";
import { useT } from "../i18n/LanguageContext.js";

interface HistoryListProps {
  projects: ProjectListItem[];
  onDelete: (id: string) => void;
  deletingId: string | null;
  busyExportId: string | null;
  onExport: (id: string) => void;
}

const statusStyle: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
  analyzing: "bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/30",
  failed: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/30",
};

function getFailedReason(code: string | undefined, t: ReturnType<typeof useT>) {
  if (!code) return t.history.failedReasons.fallback;
  const c = code.toLowerCase();
  if (c.includes("invalid") && c.includes("response")) return t.history.failedReasons.invalidOutput;
  if (c.includes("schema") || c.includes("validation")) return t.history.failedReasons.schemaMismatch;
  if (c.includes("model") && c.includes("missing")) return t.history.failedReasons.modelMissing;
  if (c.includes("ollama") && (c.includes("down") || c.includes("connection"))) return t.history.failedReasons.noResponse;
  return t.history.failedReasons.fallback;
}

export function HistoryList({
  projects,
  onDelete,
  deletingId,
  busyExportId,
  onExport,
}: HistoryListProps) {
  const t = useT();
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 py-14 text-center">
        <div
          aria-hidden
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-brand-300"
        >
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
            <path
              d="M5 7h14M5 12h14M5 17h9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">
            {t.history.empty.title}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            {t.history.empty.subtitle}
          </p>
        </div>
        <Link to="/" className="btn-primary mt-2">
          {t.history.empty.cta}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 stagger">
      {projects.map((p) => {
        const statusKey = (p.status ?? "").toLowerCase();
        const statusLabel = t.statuses[statusKey] ?? p.status;
        const modelName = p.analysisSummary
          ? undefined
          : undefined; // modelName not in ProjectListItem without separate fetch
        return (
          <article
            key={p.id}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-white/[0.04]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(360px circle at 30% 0%, rgba(56,189,248,0.18), transparent 60%)",
              }}
            />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-brand-100">
                    {p.title}
                  </h3>
                  <span
                    className={[
                      "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]",
                      statusStyle[statusKey] ??
                        "bg-white/[0.06] text-slate-300 ring-1 ring-white/10",
                    ].join(" ")}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="chip">
                    {t.platforms[p.targetPlatform] ?? p.targetPlatform}
                  </span>
                  <span className="chip">
                    {t.difficulties[p.difficultyLevel] ?? p.difficultyLevel}
                  </span>
                  <span className="chip">
                    {t.priorities[p.priority] ?? p.priority}
                  </span>
                  <span className="chip">
                    <svg viewBox="0 0 14 14" width="11" height="11" aria-hidden>
                      <circle
                        cx="7"
                        cy="7"
                        r="5.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M7 4.5V7l1.7 1.2"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    {new Date(p.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                {p.analysisSummary && (
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-300/90">
                    {p.analysisSummary.projectSummaryPreview}
                  </p>
                )}

                {statusKey === "failed" && (
                  <div className="flex items-center gap-2 text-[11px] text-rose-300">
                    <span className="inline-block h-1 w-1 rounded-full bg-rose-400" />
                    <span>
                      {t.history.item.reason} {t.history.failedReasons.fallback}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/projects/${p.id}`}
                  className="btn-primary text-center"
                >
                  {t.history.item.view}
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                {statusKey === "completed" && (
                  <button
                    type="button"
                    className="btn-ghost"
                    disabled={busyExportId === p.id}
                    onClick={() => onExport(p.id)}
                  >
                    {busyExportId === p.id ? (
                      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <>
                        <svg viewBox="0 0 16 16" width="13" height="13">
                          <path
                            d="M2 4h12v8H2zM4 6v4M6 6l1 2 1-2v4M10 6v4M10 9l1.5 1.5L13 9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {t.history.item.exportMd}
                      </>
                    )}
                  </button>
                )}

                {statusKey === "failed" && (
                  <button
                    type="button"
                    className="btn-ghost border-brand-500/20 text-brand-200 hover:border-brand-400/60 hover:bg-brand-500/10 hover:text-brand-100"
                    onClick={() =>
                      navigate(
                        `/?draft=${encodeURIComponent(
                          JSON.stringify({
                            title: p.title,
                            description: p.description,
                            targetPlatform: p.targetPlatform,
                            difficultyLevel: p.difficultyLevel,
                            priority: p.priority,
                            preferredTechnologies: p.preferredTechnologies ?? "",
                            roadmapDurationWeeks: p.roadmapDurationWeeks,
                          }),
                        )}`,
                      )
                    }
                  >
                    {t.history.item.editRetry}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-ghost border-rose-500/20 text-rose-200 hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-rose-100 hover:shadow-[0_0_20px_-6px_rgba(244,63,94,0.55)]"
                  disabled={deletingId === p.id}
                  onClick={() => onDelete(p.id)}
                >
                  {deletingId === p.id ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          opacity="0.25"
                        />
                        <path
                          d="M22 12a10 10 0 0 1-10 10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      {t.history.item.deleting}
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 16 16" width="13" height="13">
                        <path
                          d="M3 5h10M6 3h4M5.5 5l.6 8a1 1 0 0 0 1 .9h2a1 1 0 0 0 1-.9L11 5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {t.history.item.delete}
                    </>
                  )}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
