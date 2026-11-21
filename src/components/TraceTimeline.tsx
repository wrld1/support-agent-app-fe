import { CheckCircle2, ChevronRight, Terminal, XCircle } from 'lucide-react';
import type { ToolTraceStep } from '../types/liveops';

interface TraceTimelineProps {
  traces: ToolTraceStep[];
}

export function TraceTimeline({ traces }: TraceTimelineProps) {
  return (
    <section className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Multi-Step Tool Execution &amp; Guardrail Trace Timeline
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {traces.length > 0 ? `${traces.length} steps recorded` : '0 steps'}
        </span>
      </div>

      {traces.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-xs text-slate-400">
          No tool execution traces yet. Run a scenario to inspect every tool invocation, input
          argument, guardrail check, and latency.
        </div>
      ) : (
        <div className="space-y-3">
          {traces.map((trace) => {
            const isGuardrail =
              trace.toolName.includes('guardrail') || trace.toolName.includes('security');
            const resultObj =
              trace.result && typeof trace.result === 'object'
                ? (trace.result as Record<string, unknown>)
                : null;
            const isBlocked =
              resultObj?.tripwireTriggered === true ||
              resultObj?.allowed === false ||
              resultObj?.success === false ||
              resultObj?.status === 'ACTION_BLOCKED_BY_GUARDRAIL';

            return (
              <div
                key={`${trace.step}-${trace.toolName}`}
                className={`rounded-xl border p-4 transition ${
                  isBlocked
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : isGuardrail
                      ? 'bg-indigo-950/20 border-indigo-500/30'
                      : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center">
                      {trace.step}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono text-sm font-bold text-emerald-300">
                      {trace.toolName}()
                    </span>
                    {isBlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <XCircle className="w-3 h-3" />
                        TRIPWIRE / BLOCKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        OK
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-slate-400">{trace.durationMs}ms</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800/90 p-2.5 overflow-x-auto">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                      Arguments
                    </div>
                    <pre className="text-slate-200 whitespace-pre-wrap break-words">
                      {JSON.stringify(trace.args, null, 2)}
                    </pre>
                  </div>

                  <div className="rounded-lg bg-slate-900/90 border border-slate-800/90 p-2.5 overflow-x-auto">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                      Return Payload
                    </div>
                    <pre className="text-emerald-200/90 whitespace-pre-wrap break-words">
                      {JSON.stringify(trace.result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
