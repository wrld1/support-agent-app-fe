import { Cpu, RotateCcw, Shield } from 'lucide-react';

interface HeaderBarProps {
  backendConnected: boolean;
  executionMode: string;
  isResetting: boolean;
  onResetStore: () => void;
}

export function HeaderBar({
  backendConnected,
  executionMode,
  isResetting,
  onResetStore,
}: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight text-white">
                LaunchShield LiveOps
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Day-1 AAA Triage Agent
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Entitlement Verification, Capped Compensation &amp; P1 Escalation Console
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
              backendConnected
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/50 border-amber-500/30 text-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{backendConnected ? 'API Connected' : 'API Offline (Fallback Presets)'}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/90 text-xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Engine:</span>
            <span className="font-mono font-semibold text-indigo-300">{executionMode}</span>
          </div>

          <button
            type="button"
            onClick={onResetStore}
            disabled={isResetting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset CRUD Store</span>
          </button>
        </div>
      </div>
    </header>
  );
}
