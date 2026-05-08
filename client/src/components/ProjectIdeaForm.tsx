import { FormEvent, useMemo, useState, useCallback } from "react";
import type {
  DifficultyLevel,
  PriorityFocus,
  ProjectAnalyzeInput,
  TargetPlatform,
} from "../types/project.js";
import { PreferenceSelector } from "./PreferenceSelector.js";
import { useT } from "../i18n/LanguageContext.js";
import { SAMPLE_IDEAS } from "../data/sampleIdeas.js";

interface ProjectIdeaFormProps {
  loading: boolean;
  onSubmit: (input: ProjectAnalyzeInput) => void;
  initialDraft?: Partial<ProjectAnalyzeInput> | null;
}

const PLATFORM_VALUES: TargetPlatform[] = [
  "Web",
  "Mobile",
  "Desktop",
  "API",
  "Embedded",
  "AI Tool",
  "Other",
];

const DIFFICULTY_VALUES: DifficultyLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const PRIORITY_VALUES: PriorityFocus[] = [
  "Fast MVP",
  "Scalability",
  "Security",
  "Low Cost",
  "Maintainability",
];

export function ProjectIdeaForm({ loading, onSubmit, initialDraft }: ProjectIdeaFormProps) {
  const t = useT();
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [description, setDescription] = useState(initialDraft?.description ?? "");
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>(
    initialDraft?.targetPlatform ?? "Web",
  );
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(
    initialDraft?.difficultyLevel ?? "Intermediate",
  );
  const [priority, setPriority] = useState<PriorityFocus>(
    initialDraft?.priority ?? "Fast MVP",
  );
  const [preferredTechnologies, setPreferredTechnologies] = useState(
    initialDraft?.preferredTechnologies ?? "",
  );
  const [roadmapDurationWeeks, setRoadmapDurationWeeks] = useState(
    initialDraft?.roadmapDurationWeeks ?? 8,
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const disabled = loading;

  const platforms = useMemo(
    () => PLATFORM_VALUES.map((v) => ({ value: v, label: t.platforms[v] })),
    [t],
  );
  const difficulties = useMemo(
    () => DIFFICULTY_VALUES.map((v) => ({ value: v, label: t.difficulties[v] })),
    [t],
  );
  const priorities = useMemo(
    () => PRIORITY_VALUES.map((v) => ({ value: v, label: t.priorities[v] })),
    [t],
  );

  const titleTrim = title.trim();
  const descTrim = description.trim();
  const titleValid = titleTrim.length >= 3;
  const descValid = descTrim.length >= 20;
  const durationValid =
    Number.isFinite(roadmapDurationWeeks) &&
    roadmapDurationWeeks >= 1 &&
    roadmapDurationWeeks <= 52;

  // Weighted progress: title 15%, desc 40%, platform 10%, difficulty 10%, priority 10%, duration 10%, techs 5%
  const completion = useMemo(() => {
    let score = 0;
    if (titleValid) score += 15;
    if (descValid) {
      const extra = Math.min(40, descTrim.length / 6);
      score += extra;
    }
    if (targetPlatform) score += 10;
    if (difficultyLevel) score += 10;
    if (priority) score += 10;
    if (durationValid) score += 10;
    if (preferredTechnologies.trim().length > 0) score += 5;
    return Math.round(Math.min(100, score));
  }, [titleValid, descValid, descTrim.length, targetPlatform, difficultyLevel, priority, durationValid, preferredTechnologies]);

  const hintKey = useMemo(() => {
    if (!titleValid || !descValid) return "empty" as const;
    if (descTrim.length < 80) return "short" as const;
    return "good" as const;
  }, [titleValid, descValid, descTrim.length]);

  const titleError = touched.title && !titleValid ? t.form.validationTitleShort : null;
  const descError = touched.description && !descValid ? t.form.validationDescShort : null;

  const validationMessage = useMemo(() => {
    if (!titleValid) return t.form.validationTitleShort;
    if (!descValid) return t.form.validationDescShort;
    if (!durationValid) return t.form.validationDuration;
    return null;
  }, [titleValid, descValid, durationValid, t]);

  const isValid = !validationMessage;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ title: true, description: true });
    if (validationMessage) {
      setClientError(validationMessage);
      return;
    }
    setClientError(null);
    const input: ProjectAnalyzeInput = {
      title: titleTrim,
      description: descTrim,
      targetPlatform,
      difficultyLevel,
      priority,
      roadmapDurationWeeks: Number(roadmapDurationWeeks),
      preferredTechnologies:
        preferredTechnologies.trim().length > 0
          ? preferredTechnologies.trim()
          : undefined,
    };
    onSubmit(input);
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e as unknown as FormEvent);
      }
    },
    [handleSubmit],
  );

  function fillSample(idx: number) {
    const s = SAMPLE_IDEAS[idx];
    if (!s) return;
    setTitle(s.title);
    setDescription(s.description);
    setTargetPlatform(s.targetPlatform);
    setDifficultyLevel(s.difficultyLevel);
    setPriority(s.priority);
    setRoadmapDurationWeeks(s.roadmapDurationWeeks);
    setPreferredTechnologies(s.preferredTechnologies || "");
    setTouched({});
    setClientError(null);
  }

  return (
    <form
      className="card card-glow space-y-7"
      onSubmit={handleSubmit}
      noValidate
      onKeyDown={handleKeyDown}
    >
      {/* Top progress bar */}
      <div className="-mx-6 -mt-6 mb-1 px-6 pt-2">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span>{t.form.brief}</span>
          <span className="text-slate-400">
            <span className="font-mono text-brand-300">{completion}%</span>{" "}
            {t.form.ready}
          </span>
        </div>
        <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.04]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 via-indigo-400 to-accent-400 transition-[width] duration-700 ease-out"
            style={{
              width: `${completion}%`,
              boxShadow: "0 0 14px rgba(56,189,248,0.55)",
            }}
          />
        </div>
      </div>

      {/* Smart hint */}
      <div
        className={[
          "rounded-lg border px-3 py-2 text-sm transition-colors",
          hintKey === "empty"
            ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
            : hintKey === "short"
            ? "border-sky-500/20 bg-sky-500/10 text-sky-200"
            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
        ].join(" ")}
      >
        {t.form.hints[hintKey]}
      </div>

      <div>
        <label className="label" htmlFor="title">
          {t.form.titleLabel}
        </label>
        <input
          id="title"
          className={[
            "input-field",
            titleError ? "border-amber-500/60 focus:border-amber-500" : "",
          ].join(" ")}
          value={title}
          disabled={disabled}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!touched.title) setTouched((p) => ({ ...p, title: true }));
            if (clientError) setClientError(null);
          }}
          onBlur={() => setTouched((p) => ({ ...p, title: true }))}
          placeholder={t.form.titlePlaceholder}
          aria-invalid={!!titleError}
          aria-describedby={titleError ? "title-error" : undefined}
        />
        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span
            className={
              titleValid
                ? "text-emerald-300/80"
                : titleError
                ? "text-amber-300/90"
                : "text-slate-500"
            }
          >
            {titleValid ? t.form.titleValid : t.form.titleInvalid}
          </span>
          <span className="font-mono text-slate-500">{title.length}</span>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          {t.form.descLabel}
        </label>
        <div className="relative">
          <textarea
            id="description"
            className={[
              "input-field min-h-[160px] resize-y leading-relaxed",
              descError ? "border-amber-500/60 focus:border-amber-500" : "",
            ].join(" ")}
            value={description}
            disabled={disabled}
            onChange={(e) => {
              setDescription(e.target.value);
              if (!touched.description) setTouched((p) => ({ ...p, description: true }));
              if (clientError) setClientError(null);
            }}
            onBlur={() => setTouched((p) => ({ ...p, description: true }))}
            placeholder={t.form.descPlaceholder}
            aria-invalid={!!descError}
            aria-describedby={descError ? "desc-error" : undefined}
          />
          <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 backdrop-blur">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                descValid
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : "bg-amber-400"
              }`}
            />
            {description.length} {t.form.chars}
          </div>
        </div>
        {descError && (
          <p id="desc-error" className="mt-1 text-[11px] text-amber-300/90">
            {descError}
          </p>
        )}
      </div>

      {/* Sample ideas */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {t.form.samplesTitle}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_IDEAS.map((_s, i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => fillSample(i)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300 transition hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-100"
            >
              {t.form.samples[i]?.title ?? `Sample ${i + 1}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PreferenceSelector
          id="platform"
          label={t.form.platform}
          value={targetPlatform}
          options={platforms}
          disabled={disabled}
          onChange={setTargetPlatform}
          pill
        />
        <PreferenceSelector
          id="difficulty"
          label={t.form.difficulty}
          value={difficultyLevel}
          options={difficulties}
          disabled={disabled}
          onChange={setDifficultyLevel}
          pill
        />
        <div className="md:col-span-2">
          <PreferenceSelector
            id="priority"
            label={t.form.priority}
            value={priority}
            options={priorities}
            disabled={disabled}
            onChange={setPriority}
            pill
          />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="weeks">
            {t.form.duration}
            <span className="ml-auto font-mono text-[11px] normal-case tracking-normal text-brand-300">
              {t.form.weeks(roadmapDurationWeeks)}
            </span>
          </label>
          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setRoadmapDurationWeeks((w) => Math.max(1, w - 1))
                }
                disabled={disabled}
                className="btn-soft h-8 w-8 px-0 text-base"
                aria-label={t.form.decreaseWeeks}
              >
                −
              </button>
              <input
                id="weeks"
                type="range"
                min={1}
                max={52}
                step={1}
                value={roadmapDurationWeeks}
                disabled={disabled}
                onChange={(e) =>
                  setRoadmapDurationWeeks(Number(e.target.value))
                }
                className="form-range flex-1 accent-brand-500"
                style={{
                  background: `linear-gradient(90deg, #38bdf8 0%, #818cf8 ${
                    (roadmapDurationWeeks / 52) * 100
                  }%, rgba(255,255,255,0.08) ${
                    (roadmapDurationWeeks / 52) * 100
                  }%, rgba(255,255,255,0.08) 100%)`,
                  height: "4px",
                  borderRadius: "999px",
                  WebkitAppearance: "none",
                  appearance: "none",
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setRoadmapDurationWeeks((w) => Math.min(52, w + 1))
                }
                disabled={disabled}
                className="btn-soft h-8 w-8 px-0 text-base"
                aria-label={t.form.increaseWeeks}
              >
                +
              </button>
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-wide text-slate-500">
              {t.form.weeksMarks.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="prefs">
          {t.form.techs}{" "}
          <span className="font-normal normal-case tracking-normal text-slate-500">
            {t.form.optional}
          </span>
        </label>
        <input
          id="prefs"
          className="input-field"
          value={preferredTechnologies}
          disabled={disabled}
          onChange={(e) => setPreferredTechnologies(e.target.value)}
          placeholder={t.form.techsPlaceholder}
        />
        <p className="mt-1.5 text-[11px] text-slate-500">
          {t.form.techsHelper}
        </p>
      </div>

      {clientError && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200 anim-shake">
          {clientError}
        </p>
      )}

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-white/5 pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-[11px] text-slate-500">
          {t.form.keyboardA}
          <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
            ⌘
          </kbd>
          <kbd className="ml-1 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
            ↵
          </kbd>
          {t.form.keyboardB}
        </p>
        <button
          type="submit"
          className="btn-primary group min-w-[220px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          disabled={disabled || !isValid}
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
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
              {t.form.submitLoading}
            </>
          ) : (
            <>
              {t.form.submit}
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
            </>
          )}
        </button>
      </div>

      {/* Disabled hint below CTA if button disabled */}
      {!isValid && !loading && (
        <p className="text-center text-[11px] text-slate-500">
          {t.form.submitDisabledHint}
        </p>
      )}
    </form>
  );
}
