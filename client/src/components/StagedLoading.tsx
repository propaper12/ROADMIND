import { useEffect, useState } from "react";

interface StagedLoadingProps {
  stage: number;
  provider?: string;
}

const STAGES = [
  "AI sağlayıcı hazırlanıyor…",
  "Seçili model kontrol ediliyor…",
  "Proje bağlamı hazırlanıyor…",
  "Teknik tercihler değerlendiriliyor…",
  "Platform ve stack önerileri oluşturuluyor…",
  "Veritabanı stratejisi belirleniyor…",
  "Coding agent prompt taslağı hazırlanıyor…",
  "Yapılandırılmış çıktı doğrulanıyor…",
  "Prompt Studio hazırlanıyor…",
];

export function StagedLoading({ stage, provider }: StagedLoadingProps) {
  const [dots, setDots] = useState(".");
  const currentStage = Math.min(stage - 1, STAGES.length - 1);
  const progress = ((currentStage + 1) / STAGES.length) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const providerText = provider === "local"
    ? "Analiz yerel Ollama üzerinde çalışır."
    : provider === "cloud"
      ? "Analiz Ollama Cloud modeliyle çalışır."
      : "";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-bold text-white">
            Teknik plan ve prompt taslağı üretiliyor
          </div>
          <div className="mt-1 text-sm text-brand-400">
            {STAGES[currentStage]}{dots}
          </div>
        </div>
        <div className="font-mono text-sm text-slate-500">
          {currentStage + 1} / {STAGES.length}
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {providerText && (
          <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1">
            {providerText}
          </span>
        )}
        <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1">
          API anahtarı yalnızca sunucu tarafında kullanılır
        </span>
      </div>
    </div>
  );
}
