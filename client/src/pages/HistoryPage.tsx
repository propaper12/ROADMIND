import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProjectListItem } from "../types/project.js";
import {
  deleteProject,
  exportMarkdown,
  getApiErrorMessage,
  getProjects,
} from "../services/api.js";
import { HistoryList } from "../components/HistoryList.js";
import { ErrorState } from "../components/ErrorState.js";
import { useT } from "../i18n/LanguageContext.js";

type StatusFilter = "all" | "completed" | "analyzing" | "failed";
type SortOrder = "newest" | "oldest";

export function HistoryPage() {
  const t = useT();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!window.confirm(t.history.confirmDelete)) return;
    setDeletingId(id);
    setError(null);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = useMemo(() => {
    let list = [...projects];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      list = list.filter(
        (p) => (p.status ?? "").toLowerCase() === statusFilter,
      );
    }
    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
    return list;
  }, [projects, search, statusFilter, sortOrder]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: projects.length,
      completed: 0,
      analyzing: 0,
      failed: 0,
    };
    for (const p of projects) {
      const s = (p.status ?? "").toLowerCase() as StatusFilter;
      if (counts[s] !== undefined) counts[s]++;
    }
    return counts;
  }, [projects]);

  return (
    <div className="space-y-8">
      <header className="animate-fade-up relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-transparent p-6 backdrop-blur-xl md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-10 h-56 w-56 rounded-full bg-accent-500/25 blur-[100px]"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="chip-glow">
              <span className="ring-status-dot" />
              {t.history.badge}
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              <span className="gradient-text-animated">{t.history.title}</span>
            </h1>
            <p className="max-w-2xl text-slate-400">{t.history.subtitle}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {t.history.total}
            </div>
            <div className="font-display text-2xl font-bold text-white">
              {loading ? "—" : filtered.length}
            </div>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 16 16"
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
            aria-hidden
          >
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="input-field w-full pl-9"
            placeholder={t.history.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "completed", "analyzing", "failed"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={[
                "relative rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                statusFilter === s
                  ? "text-white shadow-[0_4px_18px_-6px_rgba(56,189,248,0.7)]"
                  : "text-slate-400 hover:text-white",
              ].join(" ")}
            >
              {statusFilter === s && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-md bg-gradient-to-r from-brand-500/80 via-indigo-500/80 to-accent-500/80"
                  style={{ animation: "fadeIn 0.3s ease-out both" }}
                />
              )}
              <span className="relative">
                {s === "all" && t.history.filterAll}
                {s === "completed" && t.history.filterCompleted}
                {s === "analyzing" && t.history.filterAnalyzing}
                {s === "failed" && t.history.filterFailed}
                {" "}
                <span className="font-mono text-[10px] text-slate-500">({statusCounts[s]})</span>
              </span>
            </button>
          ))}
          <div className="mx-1 h-4 w-px bg-white/10" />
          <button
            type="button"
            onClick={() => setSortOrder((o) => (o === "newest" ? "oldest" : "newest"))}
            className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:text-white"
            title={sortOrder === "newest" ? t.history.sortNewest : t.history.sortOldest}
          >
            {sortOrder === "newest" ? t.history.sortNewest : t.history.sortOldest}
          </button>
        </div>
      </div>

      {error && <ErrorState title={t.history.couldNotLoad} message={error} />}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card relative overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="animate-skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/[0.04]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-white/[0.04]" />
                  <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-white/[0.04]" />
                    <div className="h-5 w-16 rounded-full bg-white/[0.04]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <HistoryList
          projects={filtered}
          onDelete={handleDelete}
          deletingId={deletingId}
          onExport={(id: string) => navigate(`/projects/${id}`)}
        />
      )}
    </div>
  );
}
