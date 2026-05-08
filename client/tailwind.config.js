/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#dceeff",
          200: "#b9dcff",
          300: "#7ec1ff",
          400: "#3aa1ff",
          500: "#38bdf8",
          600: "#0ea5e9",
          700: "#0369a1",
          800: "#075985",
          900: "#0c3f63",
        },
        accent: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
        },
        ink: {
          50: "#f5f7fb",
          900: "#0a0f1f",
          950: "#05080f",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(56, 189, 248, 0.35)",
        "glow-lg": "0 0 80px rgba(56, 189, 248, 0.4)",
        "glow-purple": "0 0 50px rgba(168, 85, 247, 0.4)",
        "inner-glow": "inset 0 0 30px rgba(56, 189, 248, 0.08)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
        "shine":
          "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
        "mesh":
          "radial-gradient(at 18% 12%, rgba(56,189,248,0.18) 0px, transparent 45%), radial-gradient(at 82% 18%, rgba(168,85,247,0.16) 0px, transparent 50%), radial-gradient(at 60% 90%, rgba(14,165,233,0.18) 0px, transparent 50%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
        "fade-in": "fadeIn 0.5s ease-out both",
        "slide-in-right": "slideInRight 0.45s ease-out both",
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 14s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "gradient-x": "gradientX 8s ease infinite",
        "spin-slow": "spin 5s linear infinite",
        "spin-reverse": "spin 8s linear infinite reverse",
        "ring-pulse": "ringPulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 40s linear infinite",
        scan: "scan 2.6s ease-in-out infinite",
        blink: "blink 1.1s steps(2, start) infinite",
        tilt: "tilt 6s ease-in-out infinite",
        "skeleton-shimmer": "shimmer 1.6s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(18px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(14px, -18px, 0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        ringPulse: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.55",
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: "0.15",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scan: {
          "0%": { transform: "translateY(-110%)" },
          "60%": { transform: "translateY(110%)" },
          "100%": { transform: "translateY(110%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        tilt: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
    },
  },
  plugins: [],
};
