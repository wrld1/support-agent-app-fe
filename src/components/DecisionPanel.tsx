import { useState } from 'react';
import { CheckCircle2, Code2, Shield, ShieldCheck } from 'lucide-react';
import { DECISION_STYLES, type TriageResponse } from '../types/liveops';

interface DecisionPanelProps {
  triageResult: TriageResponse | null;
}

export function DecisionPanel({ triageResult }: DecisionPanelProps) {
  const [showRawJson, setShowRawJson] = useState(false);

  const decisionStyle = triageResult?.output?.decision
    ? DECISION_STYLES[triageResult.output.decision] || DECISION_STYLES.NEEDS_MORE_INFO
    : null;

  return (
    <section className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Structured Agent Decision &amp; Response
          </h2>
        </div>

        {triageResult && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400 font-mono">
              Latency: {triageResult.totalDurationMs}ms
            </span>
            <button
              type="button"
              onClick={() => setShowRawJson((v) => !v)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showRawJson ? 'Hide Raw JSON' : 'Raw JSON'}</span>
            </button>
          </div>
        )}
      </div>

      {!triageResult ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center">
          <Shield className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300 mb-1">Ready for Ticket Triage</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Click any of the 5 business case presets above or submit the ticket form to run the
            LaunchShield LiveOps Agent and inspect its structured decision, policy citations, CRUD
            mutations, and tool execution trace.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {decisionStyle && (
            <div
              className={`rounded-xl p-4 border flex flex-wrap items-center justify-between gap-3 ${decisionStyle.bg} ${decisionStyle.border}`}
            >
              <div className="flex items-center gap-3">
                <decisionStyle.icon className={`w-6 h-6 ${decisionStyle.text} shrink-0`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm font-bold tracking-wide ${decisionStyle.text}`}>
                      {triageResult.output.decision}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      • Ticket {triageResult.ticketId}
                    </span>
                  </div>
                  <p className="text-sm text-slate-100 mt-0.5 font-medium">
                    {triageResult.output.summary}
                  </p>
                </div>
              </div>

              {triageResult.output.escalationTicketId && (
                <div className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-400/40 text-purple-200 font-mono text-xs font-semibold">
                  P1 Ticket: {triageResult.output.escalationTicketId}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-950/70 border border-slate-800/90 p-3.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Cited Launch KB Policies
              </div>
              {triageResult.output.policyCitations.length === 0 ? (
                <span className="text-xs text-slate-500 italic">None cited</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {triageResult.output.policyCitations.map((pol) => (
                    <span
                      key={pol}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-semibold"
                    >
                      {pol}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-800/90 p-3.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Autonomous Actions Taken
              </div>
              {triageResult.output.actionsTaken.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No mutating actions executed</span>
              ) : (
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {triageResult.output.actionsTaken.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Drafted Player Response
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Verified via draft_player_response
              </span>
            </div>
            <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {triageResult.output.playerReply}
            </p>
          </div>

          {showRawJson && (
            <div className="rounded-xl bg-slate-950 border border-indigo-500/40 p-4">
              <div className="text-xs font-mono font-semibold text-indigo-300 mb-2">
                Validated Zod Structured Output Payload (TriageOutputSchema)
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(triageResult.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
