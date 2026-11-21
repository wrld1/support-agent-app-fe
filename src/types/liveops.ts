import {
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';

export type DecisionCategory =
  | 'AUTO_RESOLVED'
  | 'POLICY_DENIED'
  | 'ESCALATED_TO_HUMAN'
  | 'NEEDS_MORE_INFO'
  | 'SECURITY_REFUSAL';

export interface TriageOutput {
  decision: DecisionCategory;
  summary: string;
  playerReply: string;
  policyCitations: string[];
  actionsTaken: string[];
  escalationTicketId: string | null;
}

export interface ToolTraceStep {
  step: number;
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
  durationMs: number;
  timestamp: string;
}

export interface TriageTicketPayload {
  ticketId?: string;
  playerId: string;
  platform: string;
  subject: string;
  message: string;
}

export interface TriageResponse {
  ticketId: string;
  executionMode: 'vercel-ai-sdk' | 'deterministic-fallback' | string;
  output: TriageOutput;
  traces: ToolTraceStep[];
  totalDurationMs: number;
  store?: Record<string, unknown>;
}

export interface PlayerRecord {
  id: string;
  username: string;
  edition: 'STANDARD' | 'DELUXE' | 'ULTIMATE' | string;
  platform: 'Steam' | 'PS5' | 'Xbox' | string;
  playtimeHours: number;
  outageOverlapMinutes: number;
  banned: boolean;
  banReason?: string | null;
  saveCorruptionFlag?: boolean;
  currencyBalance: number;
  entitlements: string[];
  missingEntitlements?: string[];
}

export interface GrantRecord {
  id: string;
  playerId: string;
  item?: string | null;
  currencyAmount?: number;
  type?: string;
  reason?: string;
  timestamp?: string;
}

export interface EscalationRecord {
  id: string;
  playerId: string;
  priority?: string;
  reason?: string;
  platform?: string;
  status?: string;
  timestamp?: string;
}

export interface NormalizedStoreState {
  players: PlayerRecord[];
  grants: GrantRecord[];
  escalations: EscalationRecord[];
}

export interface PresetScenario {
  id: string;
  title: string;
  badge: string;
  expectedDecision: DecisionCategory;
  playerId: string;
  platform: string;
  subject: string;
  message: string;
}

export interface DecisionStyle {
  label: string;
  bg: string;
  border: string;
  text: string;
  icon: typeof ShieldCheck;
}

export const DECISION_STYLES: Record<DecisionCategory, DecisionStyle> = {
  AUTO_RESOLVED: {
    label: 'AUTO_RESOLVED',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    icon: ShieldCheck,
  },
  POLICY_DENIED: {
    label: 'POLICY_DENIED',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    text: 'text-amber-300',
    icon: ShieldX,
  },
  ESCALATED_TO_HUMAN: {
    label: 'ESCALATED_TO_HUMAN',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/40',
    text: 'text-purple-300',
    icon: AlertTriangle,
  },
  NEEDS_MORE_INFO: {
    label: 'NEEDS_MORE_INFO',
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/40',
    text: 'text-sky-300',
    icon: HelpCircle,
  },
  SECURITY_REFUSAL: {
    label: 'SECURITY_REFUSAL',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    text: 'text-rose-300',
    icon: ShieldAlert,
  },
};
