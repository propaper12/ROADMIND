import { useLanguage } from "../i18n/LanguageContext.js";
import type { Lang } from "../i18n/translations.js";

interface LanguageToggleProps {
  variant?: "full" | "compact";
  className?: string;
}

const OPTIONS: Lang[] = ["en", "tr"];

export function LanguageToggle({
  variant = "full",
  className = "",
}: LanguageToggleProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label={t.langToggle.label}
      className={[
        "relative inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur",
        variant === "compact" ? "" : "shadow-[inset_0_0_16px_rgba(56,189,248,0.06)]",
        className,
      ].join(" ")}
    >
      {/* Sliding pill */}
      <span
        aria-hidden
        className="absolute top-1 bottom-1 left-1 rounded-full bg-gradient-to-r from-brand-500/85 via-indigo-500/85 to-accent-500/85 transition-all duration-300 ease-out shadow-[0_4px_16px_-4px_rgba(56,189,248,0.55)]"
        style={{
          width: "calc(50% - 4px)",
          transform: lang === "tr" ? "translateX(100%)" : "translateX(0)",
        }}
      />
      {OPTIONS.map((opt) => {
        const active = lang === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLang(opt)}
            className={[
              "relative z-10 flex min-w-[34px] items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-300",
              active ? "text-white" : "text-slate-400 hover:text-slate-200",
            ].join(" ")}
            title={opt === "en" ? t.langToggle.fullEn : t.langToggle.fullTr}
          >
            {opt === "en" ? t.langToggle.en : t.langToggle.tr}
          </button>
        );
      })}
    </div>
  );
}
