interface BrandMarkProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

let idCounter = 0;

export function BrandMark({
  size = 40,
  className = "",
  glow = true,
}: BrandMarkProps) {
  const gradId = `rm-grad-${++idCounter}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-60 blur-md"
          style={{
            background:
              "conic-gradient(from 220deg at 50% 50%, #38bdf8, #818cf8, #c084fc, #ec4899, #38bdf8)",
          }}
        />
      )}
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        className="relative drop-shadow-[0_4px_18px_rgba(56,189,248,0.5)]"
        aria-label="Roadmind logo"
        role="img"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill={`url(#${gradId})`}
          opacity="0.12"
        />
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1.4"
          opacity="0.85"
        />
        {/* Mind arc — twin cortex curves */}
        <path
          d="M10 32 C 10 18, 18 14, 24 24 C 30 14, 38 18, 38 32"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Road descending from the mind */}
        <path
          d="M24 24 L24 40"
          stroke={`url(#${gradId})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        {/* Waypoints */}
        <circle cx="10" cy="32" r="2.1" fill="#f0f9ff" />
        <circle cx="38" cy="32" r="2.1" fill="#f0f9ff" />
        <circle cx="24" cy="24" r="2.8" fill="#f0f9ff" />
        <circle
          cx="24"
          cy="24"
          r="4"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1"
          opacity="0.5"
        />
        <circle cx="24" cy="40" r="1.9" fill="#f0f9ff" />
      </svg>
    </div>
  );
}
