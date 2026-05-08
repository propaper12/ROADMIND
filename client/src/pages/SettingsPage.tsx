import { useEffect, useState } from "react";
import { useT } from "../i18n/LanguageContext.js";
import { getHealth, testProvider } from "../services/api.js";

export function SettingsPage() {
  const t = useT();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [statusInfo, setStatusInfo] = useState<{
    model?: string;
    modelInstalled?: boolean;
    baseUrl?: string;
  }>({});
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [defaultDuration, setDefaultDuration] = useState(8);
  const [defaultLang, setDefaultLang] = useState<"en" | "tr">("tr");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const d = window.localStorage.getItem("roadmap.defaultDuration");
      const l = window.localStorage.getItem("roadmap.lang");
      if (d) setDefaultDuration(Number(d));
      if (l === "en" || l === "tr") setDefaultLang(l as "en" | "tr");
    } catch {
      /* ignore */
    }
  }, []);

  async function handleTest() {
    setStatus("loading");
    try {
      const health = await getHealth();
      const result = await testProvider(health.providerMode, "auto");
      setStatusInfo({
        model: result.model,
        modelInstalled: result.reachable,
        baseUrl: result.baseUrl,
      });
      setStatus(result.reachable ? "ok" : "error");
    } catch {
      setStatus("error");
    }
    try {
      setLastCheck(new Date().toLocaleTimeString());
    } catch {
      /* ignore */
    }
  }

  function saveDefaults() {
    try {
      window.localStorage.setItem("roadmap.defaultDuration", String(defaultDuration));
      window.localStorage.setItem("roadmap.lang", defaultLang);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-8">
      <header className="animate-fade-up relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-transparent p-6 backdrop-blur-xl md:p-8">
        <div aria-hidden className="pointer-events-none absolute -top-20 right-10 h-56 w-56 rounded-full bg-accent-500/25 blur-[100px]" />
        <div className="relative space-y-2">
          <div className="chip-glow">
            <span className="ring-status-dot" />
            V2.0 Ayarlar
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            <span className="gradient-text-animated">{t.settings.title}</span>
          </h1>
          <p className="max-w-2xl text-slate-400">
            Cloud API anahtarı güvenlik için yalnızca sunucu
            <code>server/.env</code> dosyasındaki{" "}
            <code>OLLAMA_API_KEY</code> değişkeninden okunur.
          </p>
        </div>
      </header>

      {/* Provider status card */}
      <section className="card space-y-5">
        <h2 className="font-display text-lg font-bold text-white">Ollama Sağlayıcı Durumu</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Durum
            </div>
            <div className="flex items-center gap-2 text-sm">
              {status === "ok" ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-semibold text-emerald-200">Ollama bağlantısı başarılı.</span>
                </>
              ) : status === "error" ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                  <span className="font-semibold text-rose-200">{statusInfo.model ? "Model bulunamadı" : "Bağlantı başarısız"}</span>
                </>
              ) : (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Kontrol ediliyor…</span>
                </>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Model
            </div>
            <div className="font-mono text-sm text-slate-200">{statusInfo.model || "—"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Base URL
            </div>
            <div className="font-mono text-sm text-slate-200">{statusInfo.baseUrl || "—"}</div>
          </div>
          {lastCheck && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Son Kontrol
              </div>
              <div className="text-sm text-slate-400">{lastCheck}</div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={handleTest}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Kontrol ediliyor…" : t.settings.ollama.checkBtn}
          </button>
          {status === "ok" && !statusInfo.modelInstalled && (
            <p className="text-sm text-amber-200">
              {t.settings.errors.modelMissing(statusInfo.model ?? "")}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-rose-200">
              {t.settings.errors.ollamaDown}
            </p>
          )}
        </div>
      </section>

      {/* Defaults card */}
      <section className="card space-y-5">
        <h2 className="font-display text-lg font-bold text-white">Varsayılanlar</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="default-duration">
              Varsayılan Süre
            </label>
            <div className="flex items-center gap-3">
              <input
                id="default-duration"
                type="number"
                min={1}
                max={52}
                className="input-field w-24 font-mono"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(Number(e.target.value))}
              />
              <span className="text-sm text-slate-400">{t.settings.defaults.durationHelp}</span>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="default-lang">
              Dil
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDefaultLang("en")}
                className={[
                  "relative rounded-md px-3 py-1.5 text-xs font-semibold transition",
                  defaultLang === "en" ? "text-white" : "text-slate-400 hover:text-white",
                ].join(" ")}
              >
                {defaultLang === "en" && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-md bg-gradient-to-r from-brand-500/80 to-accent-500/80"
                    style={{ animation: "fadeIn 0.3s ease-out both" }}
                  />
                )}
                <span className="relative">English</span>
              </button>
              <button
                type="button"
                onClick={() => setDefaultLang("tr")}
                className={[
                  "relative rounded-md px-3 py-1.5 text-xs font-semibold transition",
                  defaultLang === "tr" ? "text-white" : "text-slate-400 hover:text-white",
                ].join(" ")}
              >
                {defaultLang === "tr" && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-md bg-gradient-to-r from-brand-500/80 to-accent-500/80"
                    style={{ animation: "fadeIn 0.3s ease-out both" }}
                  />
                )}
                <span className="relative">Türkçe</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="btn-primary" onClick={saveDefaults}>
            Kaydet
          </button>
          {saved && <span className="text-sm text-emerald-300">Kaydedildi!</span>}
        </div>
      </section>
    </div>
  );
}
