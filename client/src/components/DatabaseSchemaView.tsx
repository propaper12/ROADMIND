import type { DatabaseTable } from "../types/analysis.js";
import { useT } from "../i18n/LanguageContext.js";

interface DatabaseSchemaViewProps {
  tables: DatabaseTable[];
}

export function DatabaseSchemaView({ tables }: DatabaseSchemaViewProps) {
  const t = useT();
  return (
    <div className="card space-y-6">
      <h3 className="font-display text-lg font-bold text-white">
        {t.database.title}
      </h3>
      <div className="space-y-6">
        {tables.map((table) => (
          <div
            key={table.tableName}
            className="rounded-lg border border-slate-800"
          >
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/80 px-4 py-3">
              <span className="chip-glow">{table.tableName}</span>
              <p className="text-sm text-slate-400">{table.purpose}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-semibold">
                      {t.database.column}
                    </th>
                    <th className="px-4 py-2 font-semibold">
                      {t.database.type}
                    </th>
                    <th className="px-4 py-2 font-semibold">
                      {t.database.constraints}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col) => (
                    <tr
                      key={`${table.tableName}-${col.name}`}
                      className="border-t border-slate-800 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-2 font-medium text-slate-100">
                        {col.name}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-brand-200">{col.type}</td>
                      <td className="px-4 py-2 text-slate-400">
                        {col.constraints || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {table.relations.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 px-4 py-3 text-sm text-slate-300">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t.database.relations}
                </span>
                {table.relations.map((rel) => (
                  <span key={rel} className="chip">{rel}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
