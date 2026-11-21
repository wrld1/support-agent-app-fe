import { Award, Ban, Bug, Clock, Coins, Database, User } from 'lucide-react';
import type { NormalizedStoreState } from '../types/liveops';

interface StoreInspectorProps {
  store: NormalizedStoreState;
  activePlayerId: string;
  onSelectPlayer: (playerId: string, platform: string) => void;
}

export function StoreInspector({
  store,
  activePlayerId,
  onSelectPlayer,
}: StoreInspectorProps) {
  return (
    <section className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Live Player Telemetry &amp; CRUD Store
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          {store.players.length} Players • {store.grants.length} Grants •{' '}
          {store.escalations.length} P1 Tickets
        </span>
      </div>

      <div className="space-y-2.5">
        {store.players.map((p) => {
          const isActivePlayer = p.id === activePlayerId;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPlayer(p.id, p.platform)}
              className={`rounded-xl p-3 border transition cursor-pointer ${
                isActivePlayer
                  ? 'bg-slate-900 border-indigo-500/50'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-xs font-bold text-indigo-300">{p.id}</span>
                  <span className="text-sm font-semibold text-white">{p.username}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {p.platform}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      p.edition === 'ULTIMATE'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : p.edition === 'DELUXE'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {p.edition}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {p.banned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      <Ban className="w-3 h-3" />
                      BANNED
                    </span>
                  )}
                  {p.saveCorruptionFlag && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Bug className="w-3 h-3" />
                      SAVE_CORRUPT
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Balance:</span>
                  <span className="font-mono font-semibold text-amber-300">
                    {p.currencyBalance} Shards
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Outage Overlap:</span>
                  <span className="font-mono font-semibold text-sky-300">
                    {p.outageOverlapMinutes}m
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {p.entitlements.length === 0 ? (
                  <span className="text-[11px] text-slate-500 italic">No entitlements</span>
                ) : (
                  p.entitlements.map((item) => (
                    <span
                      key={item}
                      className={`text-[11px] px-2 py-0.5 rounded-md border ${
                        item.includes('Voidwalker')
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-medium'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {item}
                    </span>
                  ))
                )}
                {p.missingEntitlements?.map((missing) => (
                  <span
                    key={`missing-${missing}`}
                    className="text-[11px] px-2 py-0.5 rounded-md border bg-amber-950/50 border-amber-500/40 text-amber-300 font-medium"
                  >
                    Missing: {missing}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-3">
          <div className="text-xs font-semibold text-emerald-300 mb-2 flex items-center justify-between">
            <span>Executed Grants Ledger</span>
            <span className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px]">
              {store.grants.length}
            </span>
          </div>
          {store.grants.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No autonomous grants executed yet. Run SCN-1 to see live mutation.
            </p>
          ) : (
            <ul className="space-y-1.5 text-xs">
              {store.grants.map((g) => (
                <li
                  key={g.id}
                  className="p-2 rounded bg-emerald-950/30 border border-emerald-500/25 text-emerald-200"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400">
                    <span>{g.id}</span>
                    <span>{g.playerId}</span>
                  </div>
                  <div className="font-medium mt-0.5">
                    {g.item ? `+ ${g.item}` : ''}
                    {g.item && g.currencyAmount ? ' & ' : ''}
                    {g.currencyAmount ? `+${g.currencyAmount} Apex Shards` : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-3">
          <div className="text-xs font-semibold text-purple-300 mb-2 flex items-center justify-between">
            <span>P1 Engineering Escalations</span>
            <span className="font-mono bg-purple-500/20 px-1.5 py-0.5 rounded text-[10px]">
              {store.escalations.length}
            </span>
          </div>
          {store.escalations.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No P1 tickets opened yet. Run SCN-3 to escalate save corruption.
            </p>
          ) : (
            <ul className="space-y-1.5 text-xs">
              {store.escalations.map((esc) => (
                <li
                  key={esc.id}
                  className="p-2 rounded bg-purple-950/30 border border-purple-500/25 text-purple-200"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] text-purple-400">
                    <span>{esc.id}</span>
                    <span>
                      {esc.playerId} ({esc.priority || 'P1'})
                    </span>
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-300">{esc.reason}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
