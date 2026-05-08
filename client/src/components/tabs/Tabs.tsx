import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  children: ReactNode[];
  defaultTab?: string;
}

export function Tabs({ tabs, children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="relative">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {activeTab === tab.id && (
                <span
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-500/80 via-indigo-500/80 to-accent-500/80"
                  style={{ animation: "fadeIn 0.3s ease-out both" }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-up">
        {children[activeIndex] || children[0]}
      </div>
    </div>
  );
}
