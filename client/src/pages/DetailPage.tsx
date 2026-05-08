import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ProjectWithAnalysis } from "../types/project.js";
import {
  deleteProject,
  getApiErrorMessage,
  getProject,
  exportMarkdown,
  exportJson,
} from "../services/api.js";
import { useT } from "../i18n/LanguageContext.js";
import { ErrorState } from "../components/ErrorState.js";
import { TabNavigation } from "../components/TabNavigation.js";
import type { RoadmapAnalysis } from "../types/analysis.js";

const TABS = [
  { id: "overview", label: "Genel Bakış" },
  { id: "stack", label: "Stack" },
  { id: "database", label: "Veritabanı" },
  { id: "architecture", label: "Mimari" },
  { id: "ui", label: "UI Planı" },
  { id: "api", label: "API" },
  { id: "roadmap", label: "Yol Haritası" },
  { id: "prompt", label: "Prompt Studio" },
  { id: "tests", label: "Test Planı" },
  { id: "export", label: "Dışa Aktar" },
];

function OverviewTab({ analysis }: { analysis: RoadmapAnalysis }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-3">
          <h3 className="text-sm font-semibold text-brand-300">Proje Özeti</h3>
          <p className="text-sm leading-relaxed text-slate-400">{analysis.projectSummary || "—"}</p>
        </div>
        <div className="card space-y-3">
          <h3 className="text-sm font-semibold text-brand-300">Problem Tanımı</h3>
          <p className="text-sm leading-relaxed text-slate-400">{analysis.problemDefinition || "—"}</p>
        </div>
      </div>

      {analysis.architectureOverview && (
        <div className="card space-y-3">
          <h3 className="text-sm font-semibold text-brand-300">Mimari Yaklaşım</h3>
          <p className="text-sm leading-relaxed text-slate-400">{analysis.architectureOverview}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {analysis.targetUsers && analysis.targetUsers.length > 0 && (
          <div className="card space-y-3">
            <h3 className="text-sm font-semibold text-brand-300">Hedef Kullanıcılar</h3>
            <div className="space-y-2">
              {analysis.targetUsers.map((u) => (
                <div key={u.name} className="flex items-start gap-2 text-sm">
                  <span className="font-medium text-white">{u.name}</span>
                  <span className="text-slate-500">—</span>
                  <span className="text-slate-400">{u.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.assumptions && analysis.assumptions.length > 0 && (
          <div className="card space-y-3">
            <h3 className="text-sm font-semibold text-brand-300">Varsayımlar</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm text-slate-400">
              {analysis.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {analysis.generatedPromptDraft && (
        <div className="card space-y-3 bg-brand-500/[0.02]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brand-300">Master Prompt Önizleme</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{analysis.generatedPromptDraft.selectedAgent}</span>
          </div>
          <div className="relative">
            <pre className="max-h-32 overflow-hidden rounded-lg bg-black/20 p-3 text-xs text-slate-500">
              {analysis.generatedPromptDraft.fullPrompt}
            </pre>
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}

function StackTab({ analysis }: { analysis: RoadmapAnalysis }) {
  const stack = analysis.recommendedStack || {};
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {stack.frontend && (
          <div className="card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Frontend</h4>
            <div className="mt-2 text-lg font-semibold text-white">{stack.frontend.technology}</div>
            <p className="mt-1 text-sm text-slate-400">{stack.frontend.reason}</p>
          </div>
        )}
        {stack.backend && (
          <div className="card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Backend</h4>
            <div className="mt-2 text-lg font-semibold text-white">{stack.backend.technology}</div>
            <p className="mt-1 text-sm text-slate-400">{stack.backend.reason}</p>
          </div>
        )}
        {stack.database && (
          <div className="card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Database</h4>
            <div className="mt-2 text-lg font-semibold text-white">{stack.database.technology}</div>
            <p className="mt-1 text-sm text-slate-400">{stack.database.reason}</p>
          </div>
        )}
        {stack.ai && (
          <div className="card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI</h4>
            <div className="mt-2 text-lg font-semibold text-white">{stack.ai.technology}</div>
            <p className="mt-1 text-sm text-slate-400">{stack.ai.reason}</p>
          </div>
        )}
        {stack.styling && (
          <div className="card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Styling</h4>
            <div className="mt-2 text-lg font-semibold text-white">{stack.styling.technology}</div>
            <p className="mt-1 text-sm text-slate-400">{stack.styling.reason}</p>
          </div>
        )}
        {stack.orm && (
          <div className="card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">ORM</h4>
            <div className="mt-2 text-lg font-semibold text-white">{stack.orm.technology}</div>
            <p className="mt-1 text-sm text-slate-400">{stack.orm.reason}</p>
          </div>
        )}
        {stack.testing && (
          <div className="card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Testing</h4>
            <div className="mt-2 text-lg font-semibold text-white">{stack.testing.technology}</div>
            <p className="mt-1 text-sm text-slate-400">{stack.testing.reason}</p>
          </div>
        )}
        {stack.deployment && (
          <div className="card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deployment</h4>
            <div className="mt-2 text-lg font-semibold text-white">{stack.deployment.technology}</div>
            <p className="mt-1 text-sm text-slate-400">{stack.deployment.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DatabaseTab({ analysis }: { analysis: RoadmapAnalysis }) {
  return (
    <div className="space-y-6">
      {analysis.databaseRecommendation && (
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Database Recommendation</h3>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div>
              <span className="text-slate-500">Database:</span>{" "}
              <span className="text-white">{analysis.databaseRecommendation.database}</span>
            </div>
            {analysis.databaseRecommendation.mvpDatabase && (
              <div>
                <span className="text-slate-500">MVP:</span>{" "}
                <span className="text-white">{analysis.databaseRecommendation.mvpDatabase}</span>
              </div>
            )}
            {analysis.databaseRecommendation.productionDatabase && (
              <div>
                <span className="text-slate-500">Production:</span>{" "}
                <span className="text-white">{analysis.databaseRecommendation.productionDatabase}</span>
              </div>
            )}
          </div>
          <p className="text-slate-400">{analysis.databaseRecommendation.reason}</p>
          {analysis.databaseRecommendation.migrationStrategy && (
            <div className="text-sm text-slate-400">
              <strong>Migration:</strong> {analysis.databaseRecommendation.migrationStrategy}
            </div>
          )}
        </div>
      )}
      {analysis.databaseSchema && analysis.databaseSchema.length > 0 && (
        <div className="space-y-4">
          {analysis.databaseSchema.map((table) => (
            <div key={table.tableName} className="card space-y-3">
              <h4 className="font-semibold text-white">{table.tableName}</h4>
              <p className="text-sm text-slate-400 italic">{table.purpose}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs text-slate-500">
                      <th className="pb-2 pr-4">Column</th>
                      <th className="pb-2 pr-4">Type</th>
                      <th className="pb-2">Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col) => (
                      <tr key={col.name} className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 text-white">{col.name}</td>
                        <td className="py-2 pr-4 text-slate-400">{col.type}</td>
                        <td className="py-2 text-slate-500">{col.constraints || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {table.relations && table.relations.length > 0 && (
                <div className="text-xs text-slate-500">
                  Relations: {table.relations.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchitectureTab({ analysis }: { analysis: RoadmapAnalysis }) {
  return (
    <div className="space-y-6">
      {analysis.architectureOverview && (
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Architecture Overview</h3>
          <p className="text-sm leading-relaxed text-slate-400">{analysis.architectureOverview}</p>
        </div>
      )}
      {analysis.systemModules && analysis.systemModules.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {analysis.systemModules.map((mod) => (
            <div key={mod.name} className="card space-y-2">
              <h4 className="font-semibold text-white">{mod.name}</h4>
              <p className="text-sm text-slate-400">{mod.responsibility}</p>
              {mod.inputs && mod.inputs.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-500">Inputs:</span>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-400">
                    {mod.inputs.map((input) => (
                      <li key={input}>{input}</li>
                    ))}
                  </ul>
                </div>
              )}
              {mod.outputs && mod.outputs.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-500">Outputs:</span>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-400">
                    {mod.outputs.map((output) => (
                      <li key={output}>{output}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UITab({ analysis }: { analysis: RoadmapAnalysis }) {
  if (!analysis.uiPagePlan || analysis.uiPagePlan.length === 0) {
    return (
      <div className="card text-center text-slate-500">
        UI plan not available.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {analysis.uiPagePlan.map((page) => (
        <div key={page.name} className="card space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white">{page.name}</h4>
            {page.route && (
              <span className="rounded-full border border-brand-500/20 bg-brand-500/[0.08] px-2 py-0.5 text-xs font-mono text-brand-300">
                {page.route}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{page.description}</p>
          {page.components && page.components.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {page.components.map((comp) => (
                <span key={comp} className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-xs text-slate-400">
                  {comp}
                </span>
              ))}
            </div>
          )}
          {page.layout && (
            <div className="text-xs text-slate-500">Layout: {page.layout}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function APITab({ analysis }: { analysis: RoadmapAnalysis }) {
  if (!analysis.apiEndpoints || analysis.apiEndpoints.length === 0) {
    return (
      <div className="card text-center text-slate-500">
        API endpoints not available.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs text-slate-500">
            <th className="pb-3 pr-4">Method</th>
            <th className="pb-3 pr-4">Path</th>
            <th className="pb-3 pr-4">Description</th>
            <th className="pb-3">Auth</th>
          </tr>
        </thead>
        <tbody>
          {analysis.apiEndpoints.map((endpoint) => (
            <tr key={endpoint.path + endpoint.method} className="border-b border-white/[0.04]">
              <td className="py-3 pr-4">
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                  endpoint.method === "GET" ? "bg-emerald-500/[0.15] text-emerald-300" :
                  endpoint.method === "POST" ? "bg-blue-500/[0.15] text-blue-300" :
                  endpoint.method === "PUT" ? "bg-amber-500/[0.15] text-amber-300" :
                  endpoint.method === "DELETE" ? "bg-red-500/[0.15] text-red-300" :
                  "bg-slate-500/[0.15] text-slate-300"
                }`}>
                  {endpoint.method}
                </span>
              </td>
              <td className="py-3 pr-4 font-mono text-xs text-brand-300">{endpoint.path}</td>
              <td className="py-3 pr-4 text-slate-400">{endpoint.description}</td>
              <td className="py-3">
                {endpoint.authRequired ? (
                  <span className="rounded-md bg-amber-500/[0.15] px-2 py-0.5 text-xs text-amber-300">Required</span>
                ) : (
                  <span className="text-xs text-slate-500">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoadmapTab({ analysis }: { analysis: RoadmapAnalysis }) {
  return (
    <div className="space-y-6">
      {analysis.implementationRoadmap && analysis.implementationRoadmap.length > 0 && (
        <div className="space-y-4">
          {analysis.implementationRoadmap.map((week) => (
            <div key={week.week} className="card space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/[0.15] text-sm font-bold text-brand-300">
                  {week.week}
                </span>
                <h4 className="font-semibold text-white">{week.title}</h4>
              </div>
              <ul className="space-y-1">
                {week.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-brand-500" />
                    {task}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-brand-300">
                Deliverable: {week.deliverable}
              </div>
            </div>
          ))}
        </div>
      )}
      {analysis.taskBreakdown && analysis.taskBreakdown.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Task Breakdown</h3>
          {analysis.taskBreakdown.map((task, idx) => (
            <div key={idx} className="card py-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">{task.phase}</span>
                  <h4 className="font-semibold text-white">{task.title}</h4>
                </div>
                <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-xs text-slate-400">
                  {task.priority}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{task.description}</p>
              {task.estimatedHours && (
                <div className="mt-2 text-xs text-slate-500">
                  Estimated: {task.estimatedHours}h
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PromptStudioTab({
  analysis,
  onRegenerate,
}: {
  analysis: RoadmapAnalysis;
  onRegenerate?: () => void;
}) {
  const draft = analysis.generatedPromptDraft;
  const [copied, setCopied] = useState(false);

  if (!draft) {
    return (
      <div className="card text-center text-slate-500">
        <p>Prompt taslağı mevcut değil.</p>
        {onRegenerate && (
          <button className="btn-soft mt-4" onClick={onRegenerate}>
            Prompt Oluştur
          </button>
        )}
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft.fullPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt Summary */}
      <div className="card space-y-3">
        <h3 className="text-lg font-semibold text-white">Prompt Özeti</h3>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div>
            <span className="text-slate-500">Agent:</span>{" "}
            <span className="text-white">{draft.selectedAgent}</span>
          </div>
          <div>
            <span className="text-slate-500">Plan:</span>{" "}
            <span className="text-white">{draft.planMode}</span>
          </div>
          <div>
            <span className="text-slate-500">Format:</span>{" "}
            <span className="text-white">{draft.suggestedFormat || "markdown"}</span>
          </div>
          <div>
            <span className="text-slate-500">Dosya:</span>{" "}
            <span className="text-white">{draft.suggestedFileName || "roadmind-prompt.md"}</span>
          </div>
        </div>
        {analysis.promptQualityScore && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Prompt Kalite Skoru</span>
              <span className="font-mono text-lg font-bold text-brand-300">
                {analysis.promptQualityScore.score}/10
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${analysis.promptQualityScore.score * 10}%` }}
              />
            </div>
            {analysis.promptQualityScore.improvementSuggestions && (
              <div className="mt-2 text-xs text-slate-400">
                <strong>Öneriler:</strong>{" "}
                {analysis.promptQualityScore.improvementSuggestions.join(", ")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prompt Content */}
      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Prompt İçeriği</h3>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-soft text-xs">
              {copied ? "Kopyalandı ✓" : "Kopyala"}
            </button>
          </div>
        </div>
        <pre className="max-h-[600px] overflow-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-slate-300">
          {draft.fullPrompt}
        </pre>
      </div>
    </div>
  );
}

function TestPlanTab({ analysis }: { analysis: RoadmapAnalysis }) {
  return (
    <div className="space-y-6">
      {analysis.acceptanceCriteria && analysis.acceptanceCriteria.length > 0 && (
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Kabul Kriterleri</h3>
          <div className="space-y-2">
            {analysis.acceptanceCriteria.map((ac, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.1] text-xs text-slate-500">
                  {ac.id || idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-slate-300">{ac.description}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>Priority: {ac.priority}</span>
                    {ac.verificationMethod && (
                      <span>Method: {ac.verificationMethod}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {analysis.testPlan && analysis.testPlan.length > 0 && (
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Test Planı</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs text-slate-500">
                  <th className="pb-3 pr-4">Tip</th>
                  <th className="pb-3 pr-4">Açıklama</th>
                  <th className="pb-3">Öncelik</th>
                </tr>
              </thead>
              <tbody>
                {analysis.testPlan.map((test, idx) => (
                  <tr key={idx} className="border-b border-white/[0.04]">
                    <td className="py-3 pr-4">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                        test.type === "unit" ? "bg-blue-500/[0.15] text-blue-300" :
                        test.type === "integration" ? "bg-purple-500/[0.15] text-purple-300" :
                        test.type === "e2e" ? "bg-emerald-500/[0.15] text-emerald-300" :
                        test.type === "api" ? "bg-amber-500/[0.15] text-amber-300" :
                        "bg-slate-500/[0.15] text-slate-300"
                      }`}>
                        {test.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-400">{test.description}</td>
                    <td className="py-3 text-xs text-slate-500">{test.priority || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {analysis.risks && analysis.risks.length > 0 && (
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-white">Risk Analizi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs text-slate-500">
                  <th className="pb-3 pr-4">Risk</th>
                  <th className="pb-3 pr-4">Etki</th>
                  <th className="pb-3">Çözüm</th>
                </tr>
              </thead>
              <tbody>
                {analysis.risks.map((risk, idx) => (
                  <tr key={idx} className="border-b border-white/[0.04]">
                    <td className="py-3 pr-4 text-slate-300">{risk.risk}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                        risk.impact === "High" ? "bg-red-500/[0.15] text-red-300" :
                        risk.impact === "Medium" ? "bg-amber-500/[0.15] text-amber-300" :
                        "bg-emerald-500/[0.15] text-emerald-300"
                      }`}>
                        {risk.impact}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{risk.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ExportTab({ projectId }: { projectId: string }) {
  
    (async () => (await import("../services/api.js")).then((m) => m))() as any;

  const handleExport = async (type: string) => {
    const api = await import("../services/api.js");
    switch (type) {
      case "json":
        await api.exportJson(projectId);
        break;
      case "markdown":
        await api.exportMarkdown(projectId);
        break;
      case "txt":
        await api.exportTxt(projectId);
        break;
      case "agents-md":
        await api.exportAgentsMd(projectId);
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[
        { id: "json", label: "JSON", desc: "roadmind-output.json", icon: "📄" },
        { id: "markdown", label: "Markdown Rapor", desc: "roadmind-technical-report.md", icon: "📝" },
        { id: "txt", label: "Plain Text", desc: "roadmind-master-prompt.txt", icon: "📃" },
        { id: "agents-md", label: "AGENTS.md", desc: "AGENTS.md", icon: "🤖" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => handleExport(item.id)}
          className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-left transition-all hover:border-brand-500/30 hover:bg-white/[0.04]"
        >
          <span className="text-2xl">{item.icon}</span>
          <div>
            <div className="font-semibold text-white transition group-hover:text-brand-300">
              {item.label}
            </div>
            <div className="mt-1 text-sm text-slate-500">{item.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function DetailPage() {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectWithAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProject(id);
        if (!cancelled) setProject(data);
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleDelete() {
    if (!project) return;
    if (!window.confirm(t.history.confirmDelete)) return;
    try {
      await deleteProject(project.id);
      navigate("/history");
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  if (!id) return <ErrorState message={t.detail.missingId} />;

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card relative overflow-hidden">
            <div className="animate-skeleton-shimmer absolute inset-0 bg-shimmer" />
            <div className="h-6 w-1/4 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <Link to="/history" className="text-sm text-brand-400 hover:underline">
          ← {t.detail.back}
        </Link>
        <ErrorState message={error ?? t.detail.notFound} />
      </div>
    );
  }

  const a = project.analysis;
  const statusKey = (project.status ?? "").toLowerCase();
  const statusLabel = t.statuses[statusKey] ?? project.status;

  return (
    <div className="space-y-8" ref={contentRef}>
      {/* Header */}
      <header className="animate-fade-up relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-transparent p-6 backdrop-blur-xl md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-10 h-72 w-72 rounded-full bg-brand-500/20 blur-[110px]"
        />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/history"
              className="group inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-300 transition-colors hover:text-brand-200"
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform group-hover:-translate-x-0.5">
                <path
                  d="M13 8H3m4-4-4 4 4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t.detail.back}
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-semibold uppercase tracking-wide text-slate-300">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {statusLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-slate-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
              {a && (
                <span className="font-mono text-brand-300">{a.modelName}</span>
              )}
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-balance text-white md:text-5xl">
            {project.title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-400">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="chip">{t.platforms[project.targetPlatform] ?? project.targetPlatform}</span>
            <span className="chip">{t.difficulties[project.difficultyLevel] ?? project.difficultyLevel}</span>
            <span className="chip">{t.priorities[project.priority] ?? project.priority}</span>
            <span className="chip">{t.detail.weekRequested(project.roadmapDurationWeeks)}</span>
            <span className="chip">{statusLabel}</span>
            {project.codingAgent && (
              <span className="chip border-brand-500/30 bg-brand-500/[0.08] text-brand-300">
                {project.codingAgent}
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button type="button" className="btn-soft" onClick={() => exportMarkdown(project.id)}>
              📄 {t.detail.quickActions.exportMd}
            </button>
            <button type="button" className="btn-soft" onClick={() => exportJson(project.id)}>
              📃 JSON
            </button>
            <button type="button" className="btn-soft text-brand-200" onClick={() => navigate(`/?draft=${encodeURIComponent(JSON.stringify({ title: project.title, description: project.description }))}`)}>
              Tekrar Dene
            </button>
            <button type="button" className="btn-soft text-rose-200 hover:text-rose-100" onClick={handleDelete}>
              Sil
            </button>
          </div>
        </div>
      </header>

      {!a && (
        <div className="card border-amber-900/50 bg-amber-950/30 text-sm text-amber-100">
          {project.status === "failed"
            ? t.detail.statusFailed
            : project.status === "analyzing"
            ? t.detail.statusInProgress
            : t.detail.statusEmpty}
        </div>
      )}

      {a && (
        <>
          <TabNavigation
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-6">
            {activeTab === "overview" && <OverviewTab analysis={a} />}
            {activeTab === "stack" && <StackTab analysis={a} />}
            {activeTab === "database" && <DatabaseTab analysis={a} />}
            {activeTab === "architecture" && <ArchitectureTab analysis={a} />}
            {activeTab === "ui" && <UITab analysis={a} />}
            {activeTab === "api" && <APITab analysis={a} />}
            {activeTab === "roadmap" && <RoadmapTab analysis={a} />}
            {activeTab === "prompt" && <PromptStudioTab analysis={a} />}
            {activeTab === "tests" && <TestPlanTab analysis={a} />}
            {activeTab === "export" && <ExportTab projectId={project.id} />}
          </div>
        </>
      )}

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#04060d]/80 text-slate-300 shadow-lg backdrop-blur transition hover:border-brand-500/40 hover:text-white"
          aria-label="Yukarı kaydır"
        >
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path
              d="M8 12V4m-4 4 4-4 4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
