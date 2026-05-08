export function AnimatedBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#04060d]" />

      <div className="absolute inset-0 bg-mesh opacity-90" />

      <div className="absolute inset-0 bg-grid mask-fade-radial opacity-60" />

      <div
        className="absolute -top-40 left-[8%] h-[420px] w-[420px] rounded-full bg-brand-500/30 blur-[110px] animate-float"
        style={{ animationDuration: "12s" }}
      />
      <div
        className="absolute top-[30%] right-[6%] h-[360px] w-[360px] rounded-full bg-accent-500/25 blur-[120px] animate-float-slow"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-[-10%] left-[35%] h-[460px] w-[460px] rounded-full bg-indigo-500/20 blur-[140px] animate-float"
        style={{ animationDuration: "16s", animationDelay: "1s" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),_transparent_60%)]" />

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-[#04060d] via-[#04060d]/80 to-transparent" />
    </div>
  );
}
