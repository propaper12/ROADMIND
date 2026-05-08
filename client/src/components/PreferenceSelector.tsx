import { useCallback, useRef } from "react";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface PreferenceSelectorProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  pill?: boolean;
}

export function PreferenceSelector<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
  pill = false,
}: PreferenceSelectorProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = (index + 1) % options.length;
        onChange(options[next].value);
        // Focus the next button after render
        setTimeout(() => {
          const buttons = groupRef.current?.querySelectorAll('[role="radio"]');
          if (buttons) (buttons[next] as HTMLElement)?.focus();
        }, 0);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (index - 1 + options.length) % options.length;
        onChange(options[prev].value);
        setTimeout(() => {
          const buttons = groupRef.current?.querySelectorAll('[role="radio"]');
          if (buttons) (buttons[prev] as HTMLElement)?.focus();
        }, 0);
      }
    },
    [options, onChange],
  );

  if (pill) {
    return (
      <div>
        <label className="label" htmlFor={id}>
          {label}
        </label>
        <div
          id={id}
          ref={groupRef}
          role="radiogroup"
          className="flex flex-wrap gap-1.5 rounded-lg border border-white/10 bg-slate-950/60 p-1.5"
        >
          {options.map((opt, index) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                disabled={disabled}
                onClick={() => onChange(opt.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={[
                  "relative rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70",
                  active
                    ? "text-white shadow-[0_4px_18px_-6px_rgba(56,189,248,0.7)]"
                    : "text-slate-400 hover:text-white",
                  disabled ? "cursor-not-allowed opacity-60" : "",
                ].join(" ")}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-md bg-gradient-to-r from-brand-500/80 via-indigo-500/80 to-accent-500/80 transition-all duration-300"
                    style={{ animation: "fadeIn 0.3s ease-out both" }}
                  />
                )}
                <span className="relative">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="input-field appearance-none pr-9"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
