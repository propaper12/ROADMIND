import type { ApiEndpoint, HttpMethod } from "../types/analysis.js";
import { useT } from "../i18n/LanguageContext.js";

interface ApiEndpointListProps {
  endpoints: ApiEndpoint[];
}

const methodStyles: Record<HttpMethod, string> = {
  GET: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40",
  POST: "bg-sky-500/15 text-sky-300 ring-sky-500/40",
  PUT: "bg-amber-500/15 text-amber-300 ring-amber-500/40",
  PATCH: "bg-orange-500/15 text-orange-300 ring-orange-500/40",
  DELETE: "bg-rose-500/15 text-rose-300 ring-rose-500/40",
};

export function ApiEndpointList({ endpoints }: ApiEndpointListProps) {
  const t = useT();
  return (
    <div className="card space-y-4">
      <h3 className="font-display text-lg font-bold text-white">
        {t.api.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="pb-2 pr-4 font-semibold">{t.api.method}</th>
              <th className="pb-2 pr-4 font-semibold">{t.api.path}</th>
              <th className="pb-2 pr-4 font-semibold">{t.api.description}</th>
              <th className="pb-2 pr-4 font-semibold">{t.api.request}</th>
              <th className="pb-2 font-semibold">{t.api.response}</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((ep, idx) => (
              <tr
                key={`${ep.method}-${ep.path}-${idx}`}
                className="border-t border-slate-800 align-top transition-colors hover:bg-white/[0.02]"
              >
                <td className="py-3 pr-4">
                  <span
                    className={[
                      "inline-flex rounded-md px-2 py-1 text-[11px] font-bold ring-1 ring-inset",
                      methodStyles[ep.method],
                    ].join(" ")}
                  >
                    {ep.method}
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-brand-200">
                  {ep.path}
                </td>
                <td className="py-3 pr-4 text-slate-300">{ep.description}</td>
                <td className="py-3 pr-4 text-xs text-slate-400">
                  <pre className="max-w-[200px] overflow-x-auto rounded bg-slate-950/60 p-2 font-mono text-[11px]">
                    {ep.requestBody || "—"}
                  </pre>
                </td>
                <td className="py-3 text-xs text-slate-400">
                  <pre className="max-w-[200px] overflow-x-auto rounded bg-slate-950/60 p-2 font-mono text-[11px]">
                    {ep.responseBody || "—"}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
