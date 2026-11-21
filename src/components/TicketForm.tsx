import { FileText, RefreshCw, Send } from 'lucide-react';

interface TicketFormProps {
  selectedScenarioId: string;
  playerId: string;
  platform: string;
  subject: string;
  message: string;
  isTriaging: boolean;
  onPlayerIdChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
}

export function TicketForm({
  selectedScenarioId,
  playerId,
  platform,
  subject,
  message,
  isTriaging,
  onPlayerIdChange,
  onPlatformChange,
  onSubjectChange,
  onMessageChange,
  onSubmit,
}: TicketFormProps) {
  return (
    <section className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Incoming Support Ticket Payload
          </h2>
        </div>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
          Preset: {selectedScenarioId}
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-3.5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="playerId-input"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Player ID (<code className="text-indigo-300">USR-XXXX</code>)
            </label>
            <input
              id="playerId-input"
              type="text"
              value={playerId}
              onChange={(e) => onPlayerIdChange(e.target.value)}
              placeholder="e.g. USR-1001"
              className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none px-3 py-2 text-sm font-mono text-white"
            />
          </div>

          <div>
            <label
              htmlFor="platform-select"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Platform
            </label>
            <select
              id="platform-select"
              value={platform}
              onChange={(e) => onPlatformChange(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none px-3 py-2 text-sm text-white"
            >
              <option value="">-- Missing / Unspecified --</option>
              <option value="Steam">Steam</option>
              <option value="PS5">PS5</option>
              <option value="Xbox">Xbox</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="subject-input" className="block text-xs font-medium text-slate-300 mb-1">
            Ticket Subject
          </label>
          <input
            id="subject-input"
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="Brief issue summary"
            className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none px-3 py-2 text-sm text-white"
          />
        </div>

        <div>
          <label htmlFor="message-input" className="block text-xs font-medium text-slate-300 mb-1">
            Player Message / Transcript
          </label>
          <textarea
            id="message-input"
            rows={4}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Describe the player issue..."
            className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none px-3 py-2 text-sm text-white leading-relaxed resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={isTriaging}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          {isTriaging ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Executing Multi-Step Agent Triage...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Run Autonomous Agent Triage</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
