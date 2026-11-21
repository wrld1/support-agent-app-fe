import { Play, Sparkles } from 'lucide-react';
import { DECISION_STYLES, type PresetScenario } from '../types/liveops';

interface ScenarioSelectorProps {
  scenarios: PresetScenario[];
  selectedScenarioId: string;
  isTriaging: boolean;
  onSelect: (scenario: PresetScenario) => void;
  onQuickRun: (scenario: PresetScenario) => void;
}

const SCENARIO_TAG_LABELS: Record<string, string> = {
  'SCN-1': 'AUTO_RESOLVE',
  'SCN-2': 'POLICY_DENY',
  'SCN-3': 'P1_ESCALATE',
  'SCN-4': 'NEEDS_INFO',
  'SCN-5': 'GUARDRAIL',
};

export function ScenarioSelector({
  scenarios,
  selectedScenarioId,
  isTriaging,
  onSelect,
  onQuickRun,
}: ScenarioSelectorProps) {
  return (
    <section className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            5 Required Business Case Scenarios (One-Click Triage)
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Select a scenario to populate the ticket form or click &ldquo;Run&rdquo; to execute immediately
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {scenarios.map((scn) => {
          const isSelected = selectedScenarioId === scn.id;
          const style = DECISION_STYLES[scn.expectedDecision] || DECISION_STYLES.NEEDS_MORE_INFO;

          return (
            <div
              key={scn.id}
              onClick={() => onSelect(scn)}
              className={`group relative rounded-xl p-3.5 border transition cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-indigo-950/35 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                  : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-indigo-400">{scn.id}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${style.bg} ${style.border} ${style.text}`}
                  >
                    {SCENARIO_TAG_LABELS[scn.id] ?? scn.expectedDecision}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 leading-snug">{scn.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{scn.message}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-400 truncate">
                  {scn.playerId || 'No ID'} • {scn.platform || 'No Platform'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickRun(scn);
                  }}
                  disabled={isTriaging}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600/90 hover:bg-indigo-500 text-[11px] font-semibold text-white transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
