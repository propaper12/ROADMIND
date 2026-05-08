import { NavLink, Outlet } from "react-router-dom";
import { AnimatedBackdrop } from "./AnimatedBackdrop.js";
import { BrandMark } from "./BrandMark.js";
import { LanguageToggle } from "./LanguageToggle.js";
import { useT } from "../i18n/LanguageContext.js";

const navIcons = {
  analyze: (
    <path
      d="M4 13.5 9 8.5 12.5 12 18 6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  history: (
    <>
      <circle
        cx="11"
        cy="11"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M11 8v3l2 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  settings: (
    <>
      <circle cx="11" cy="11" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 18v-2M11 4v2M4 11h2M16 11h2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
    isActive
      ? "bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
  ].join(" ");

export function Layout() {
  const t = useT();

  const navItems: Array<{
    to: string;
    label: string;
    description: string;
    end: boolean;
    icon: JSX.Element;
  }> = [
    {
      to: "/",
      label: t.nav.analyze.label,
      description: t.nav.analyze.desc,
      end: true,
      icon: navIcons.analyze,
    },
    {
      to: "/history",
      label: t.nav.history.label,
      description: t.nav.history.desc,
      end: false,
      icon: navIcons.history,
    },
    {
      to: "/settings",
      label: t.nav.settings.label,
      description: t.nav.settings.desc,
      end: false,
      icon: navIcons.settings,
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Ana içeriğe atla
      </a>
      <AnimatedBackdrop />

      <div className="flex min-h-screen">
        {/* Sidebar - desktop */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-white/[0.015] p-5 backdrop-blur-xl md:flex">
          <div className="mb-8 flex items-start gap-3">
            <BrandMark size={42} />
            <div className="leading-tight">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-300">
                {t.brand.eyebrow}
              </div>
              <div className="font-display text-base font-bold leading-tight text-white">
                Roadmind<span className="text-brand-400">.</span>
              </div>
              <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500">
                {t.brand.tagline}
              </div>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-400 to-accent-500 transition-all duration-300 ${
                        isActive ? "opacity-100" : "opacity-0 -translate-x-1"
                      }`}
                    />
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300 ${
                        isActive
                          ? "border-brand-500/40 bg-brand-500/10 text-brand-200 shadow-[0_0_20px_-4px_rgba(56,189,248,0.6)]"
                          : "border-white/5 bg-white/[0.02] text-slate-400 group-hover:border-white/10 group-hover:text-white"
                      }`}
                    >
                      <svg
                        viewBox="0 0 22 22"
                        width="18"
                        height="18"
                        aria-hidden
                      >
                        {item.icon}
                      </svg>
                    </span>
                    <span className="flex flex-col leading-tight">
                      <span>{item.label}</span>
                      <span className="text-[11px] text-slate-500">
                        {item.description}
                      </span>
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                {t.langToggle.label}
              </span>
              <LanguageToggle />
            </div>
            <div className="divider-glow" />
            <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="ring-status-dot" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  {t.sidebar.statusTitle}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                {t.sidebar.statusBefore}
                <span className="font-mono text-brand-300">
                  {t.sidebar.statusDaemon}
                </span>
                {t.sidebar.statusAfter}
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          {/* Mobile header */}
          <header className="sticky top-0 z-30 border-b border-white/5 bg-[#04060d]/80 px-4 py-3 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <BrandMark size={34} />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-300">
                    {t.brand.eyebrow}
                  </div>
                  <div className="font-display text-sm font-bold leading-tight text-white">
                    Roadmind<span className="text-brand-400">.</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle variant="compact" />
              </div>
            </div>
            <nav className="mt-3 flex gap-2" aria-label="Primary mobile">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex-1 rounded-md px-3 py-1.5 text-center text-xs font-semibold transition ${
                    isActive
                      ? "bg-brand-500/15 text-brand-100 ring-1 ring-brand-500/40"
                      : "border border-white/10 text-slate-300"
                  }`
                }
              >
                {t.nav.analyze.label}
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex-1 rounded-md px-3 py-1.5 text-center text-xs font-semibold transition ${
                    isActive
                      ? "bg-brand-500/15 text-brand-100 ring-1 ring-brand-500/40"
                      : "border border-white/10 text-slate-300"
                  }`
                }
              >
                {t.nav.history.label}
              </NavLink>
            </nav>
          </header>

          <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-10">
            <Outlet />
          </main>

          <footer className="relative border-t border-white/5 px-4 py-6 md:px-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-[11px] text-slate-500 md:flex-row">
              <div className="flex items-center gap-2">
                <span className="ring-status-dot" />
                <span>{t.footer.privacy}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-600">
                  Roadmind v1.0 · ollama
                </span>
                <span className="hidden h-3 w-px bg-white/10 md:inline-block" />
                <span className="hidden md:inline-block">
                  {t.footer.tagline}
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
