import { useT } from "../i18n/LanguageContext.js";

interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string | null;
  onRetry?: () => void;
  onRefresh?: () => void;
}

export function ErrorState({ title, message, code, onRetry, onRefresh }: ErrorStateProps) {
  const t = useT();
  const heading = title ?? t.errorState.defaultTitle;
  const b = t.errorState.bullets;
  const actions = t.errorState.actions;

  const isOllamaDown =
    code === "AI_PROVIDER_DOWN" ||
    code === "AI_AUTH_FAILED" ||
    message.toLowerCase().includes("could not reach the ai provider");
  const isModelMissing =
    code === "AI_MODEL_MISSING" ||
    (message.toLowerCase().includes("model") && message.toLowerCase().includes("not available"));
  const isInvalidOutput = code === "AI_INVALID_RESPONSE";
  const isAnalysisFailed = code === "INTERNAL_ERROR" && message.toLowerCase().includes("analysis");

  return (
    <div
      className="card relative overflow-hidden border-rose-500/30 bg-rose-950/20 anim-shake"
      role="alert"
      aria-live="assertive"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-rose-500/30 blur-3xl"
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)]">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
            <path
              d="M12 8v5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
            <path
              d="M11 3.5 2.7 18a1.5 1.5 0 0 0 1.3 2.3h16a1.5 1.5 0 0 0 1.3-2.3L13 3.5a1.2 1.2 0 0 0-2 0z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-rose-100">{heading}</h3>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-rose-100/85">
            {message}
          </p>

          {/* Contextual recovery actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {isOllamaDown && (
              <>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="btn-soft border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
                >
                  {actions.refresh}
                </button>
                <a
                  href="https://ollama.com/download"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-soft border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
                >
                  {actions.startOllama}
                </a>
              </>
            )}
            {isModelMissing && (
              <>
                <button
                  type="button"
                  onClick={onRetry}
                  className="btn-soft border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
                >
                  {actions.pullModel}
                </button>
              </>
            )}
            {(isInvalidOutput || isAnalysisFailed) && (
              <>
                <button
                  type="button"
                  onClick={onRetry}
                  className="btn-soft border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
                >
                  {actions.retry}
                </button>
              </>
            )}
            {!isOllamaDown && !isModelMissing && !isInvalidOutput && !isAnalysisFailed && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="btn-soft border-rose-500/30 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
              >
                {actions.retry}
              </button>
            )}
          </div>

          <ul className="mt-4 grid gap-1.5 text-xs text-rose-200/80 md:grid-cols-1">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-rose-300" />
              {b.ollama}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-rose-300" />
              {b.pullPrefix}
              <code className="rounded bg-rose-950/80 px-1 py-0.5 font-mono text-[11px]">
                {b.pullCode}
              </code>
              {b.pullSuffix}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-rose-300" />
              {b.retry}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
