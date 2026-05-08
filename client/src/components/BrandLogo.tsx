import { BrandMark } from "./BrandMark.js";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  eyebrow?: string;
  showEyebrow?: boolean;
  className?: string;
}

const sizing = {
  sm: { mark: 30, wordmark: "text-sm", eyebrow: "text-[9px]" },
  md: { mark: 42, wordmark: "text-base", eyebrow: "text-[10px]" },
  lg: { mark: 56, wordmark: "text-2xl", eyebrow: "text-[11px]" },
};

export function BrandLogo({
  size = "md",
  eyebrow,
  showEyebrow = true,
  className = "",
}: BrandLogoProps) {
  const s = sizing[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <BrandMark size={s.mark} />
      <div className="leading-tight">
        {showEyebrow && eyebrow && (
          <div
            className={`font-bold uppercase tracking-[0.22em] text-brand-300 ${s.eyebrow}`}
          >
            {eyebrow}
          </div>
        )}
        <div
          className={`font-display font-bold tracking-tight text-white ${s.wordmark}`}
        >
          Roadmind<span className="text-brand-400">.</span>
        </div>
      </div>
    </div>
  );
}
