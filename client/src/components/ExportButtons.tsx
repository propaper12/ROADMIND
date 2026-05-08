import { useState } from "react";
import {
  exportJson,
  exportMarkdown,
  getApiErrorMessage,
} from "../services/api.js";
import { useT } from "../i18n/LanguageContext.js";

interface ExportButtonsProps {
  projectId: string;
  markdownText?: string;
  summaryText?: string;
}

export function ExportButtons({ projectId, markdownText, summaryText }: ExportButtonsProps) {
  const t = useT();
  const [busy, setBusy] = useState<null | "json" | "md">(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<null | "markdown" | "summary">(null);

  async function handleDownload(kind: "json" | "md") {
    setBusy(kind);
    setError(null);
    try {
      if (kind === "json") await exportJson(projectId);
      else await exportMarkdown(projectId);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  async function handleCopy(text: string, kind: "markdown" | "summary") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Clipboard access denied.");
    }
  }

  return (
    <div className="card flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/[0.08] text-brand-200 shadow-[0_0_22px_-8px_rgba(56,189,248,0.6)]">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path
              d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">
            {t.exportSection.title}
          </h3>
          <p className="text-[13px] text-slate-400">
            {t.exportSection.subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn-primary"
          disabled={busy !== null}
          onClick={() => void handleDownload("json")}
        >
          {busy === "json" ? (
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
              {t.exportSection.preparing}
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden>
                <path
                  d="M3 13h10M5 7l3 3 3-3M8 2v8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t.exportSection.json}
            </>
          )}
        </button>
        <button
          type="button"
          className="btn-ghost"
          disabled={busy !== null}
          onClick={() => void handleDownload("md")}
        >
          {busy === "md" ? (
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
              {t.exportSection.preparing}
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden>
                <path
                  d="M2 4h12v8H2zM4 6v4M6 6l1 2 1-2v4M10 6v4M10 9l1.5 1.5L13 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t.exportSection.md}
            </>
          )}
        </button>

        {markdownText && (
          <button
            type="button"
            className="btn-soft"
            onClick={() => handleCopy(markdownText, "markdown")}
          >
            {copied === "markdown" ? (
              <>
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden>
                  <path
                    d="M3 8.5l3 3 7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t.exportSection.copied}
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden>
                  <rect x="3" y="3" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M7 7h6v6H7z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                {t.exportSection.copyMarkdown}
              </>
            )}
          </button>
        )}

        {summaryText && (
          <button
            type="button"
            className="btn-soft"
            onClick={() => handleCopy(summaryText, "summary")}
          >
            {copied === "summary" ? (
              <>
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden>
                  <path
                    d="M3 8.5l3 3 7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t.exportSection.copied}
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden>
                  <rect x="3" y="3" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M7 7h6v6H7z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                {t.exportSection.copySummary}
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="w-full text-sm text-amber-300">{error}</p>
      )}
    </div>
  );
}
