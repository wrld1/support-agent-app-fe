import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import './App.css';
import { DecisionPanel } from './components/DecisionPanel';
import { HeaderBar } from './components/HeaderBar';
import { ScenarioSelector } from './components/ScenarioSelector';
import { StoreInspector } from './components/StoreInspector';
import { TicketForm } from './components/TicketForm';
import { TraceTimeline } from './components/TraceTimeline';
import {
  API_BASE,
  FALLBACK_SCENARIOS,
  FALLBACK_STORE,
  fetchScenariosAndStore,
  resetLiveOpsStore,
  submitTicketTriage,
} from './services/liveopsApi';
import type {
  NormalizedStoreState,
  PresetScenario,
  TriageResponse,
  TriageTicketPayload,
} from './types/liveops';

export function App() {
  const [scenarios, setScenarios] = useState<PresetScenario[]>(FALLBACK_SCENARIOS);
  const [store, setStore] = useState<NormalizedStoreState>(FALLBACK_STORE);
  const [executionMode, setExecutionMode] = useState<string>('loading...');
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('SCN-1');
  const [playerId, setPlayerId] = useState<string>(FALLBACK_SCENARIOS[0].playerId);
  const [platform, setPlatform] = useState<string>(FALLBACK_SCENARIOS[0].platform);
  const [subject, setSubject] = useState<string>(FALLBACK_SCENARIOS[0].subject);
  const [message, setMessage] = useState<string>(FALLBACK_SCENARIOS[0].message);

  const [isTriaging, setIsTriaging] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [triageResult, setTriageResult] = useState<TriageResponse | null>(null);

  const loadInitialState = useCallback(async () => {
    try {
      const data = await fetchScenariosAndStore();
      setBackendConnected(true);
      setExecutionMode(data.executionMode);
      setScenarios(data.scenarios);
      setStore(data.store);
    } catch {
      setBackendConnected(false);
      setExecutionMode('offline-preview');
    }
  }, []);

  useEffect(() => {
    void loadInitialState();
  }, [loadInitialState]);

  const selectScenario = (scn: PresetScenario) => {
    setSelectedScenarioId(scn.id);
    setPlayerId(scn.playerId);
    setPlatform(scn.platform);
    setSubject(scn.subject);
    setMessage(scn.message);
    setErrorMsg(null);
  };

  const runTriage = async (overrideTicket?: TriageTicketPayload) => {
    const payload: TriageTicketPayload = overrideTicket ?? {
      ticketId: selectedScenarioId,
      playerId,
      platform,
      subject,
      message,
    };

    setIsTriaging(true);
    setErrorMsg(null);

    try {
      const { response, store: updatedStore } = await submitTicketTriage(payload);
      setBackendConnected(true);
      if (response.executionMode) {
        setExecutionMode(String(response.executionMode));
      }
      setTriageResult(response);
      if (updatedStore) {
        setStore(updatedStore);
      } else {
        void loadInitialState();
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? `${err.message}. Ensure ai-app-backend is running on ${API_BASE}.`
          : 'Failed to connect to backend server.',
      );
    } finally {
      setIsTriaging(false);
    }
  };

  const handleQuickRunScenario = async (scn: PresetScenario) => {
    selectScenario(scn);
    await runTriage({
      ticketId: scn.id,
      playerId: scn.playerId,
      platform: scn.platform,
      subject: scn.subject,
      message: scn.message,
    });
  };

  const handleResetStore = async () => {
    setIsResetting(true);
    setErrorMsg(null);
    try {
      const updatedStore = await resetLiveOpsStore();
      if (updatedStore) {
        setStore(updatedStore);
      } else {
        await loadInitialState();
      }
      setTriageResult(null);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? `Could not reset store: ${err.message}` : 'Could not reset store',
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <HeaderBar
        backendConnected={backendConnected}
        executionMode={executionMode}
        isResetting={isResetting}
        onResetStore={() => void handleResetStore()}
      />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        <ScenarioSelector
          scenarios={scenarios}
          selectedScenarioId={selectedScenarioId}
          isTriaging={isTriaging}
          onSelect={selectScenario}
          onQuickRun={(scn) => void handleQuickRunScenario(scn)}
        />

        {errorMsg && (
          <div className="rounded-xl bg-rose-950/60 border border-rose-500/40 px-4 py-3 flex items-center justify-between gap-3 text-rose-200 text-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => void loadInitialState()}
              className="text-xs font-semibold underline hover:text-white cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <TicketForm
              selectedScenarioId={selectedScenarioId}
              playerId={playerId}
              platform={platform}
              subject={subject}
              message={message}
              isTriaging={isTriaging}
              onPlayerIdChange={setPlayerId}
              onPlatformChange={setPlatform}
              onSubjectChange={setSubject}
              onMessageChange={setMessage}
              onSubmit={() => void runTriage()}
            />

            <StoreInspector
              store={store}
              activePlayerId={playerId}
              onSelectPlayer={(id, plat) => {
                setPlayerId(id);
                setPlatform(plat);
              }}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <DecisionPanel triageResult={triageResult} />
            <TraceTimeline traces={triageResult?.traces ?? []} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
