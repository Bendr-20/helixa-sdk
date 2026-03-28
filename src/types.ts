// --- Config ---
export interface HelixaConfig {
  apiKey?: string;
  baseUrl?: string;
}

// --- Cred ---
export interface CredBreakdown {
  onchain: number;
  social: number;
  performance: number;
  longevity: number;
  [key: string]: number;
}

export interface CredResult {
  score: number;
  tier: string;
  breakdown: CredBreakdown;
  address: string;
  updatedAt: string;
}

// --- Agent ---
export interface Agent {
  id: number;
  name: string;
  address: string;
  cred: number;
  tier: string;
  description?: string;
  avatar?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface AgentSearchResult {
  agents: Agent[];
  total: number;
  page: number;
  pageSize: number;
}

// --- Stats ---
export interface Stats {
  totalAgents: number;
  totalChecks: number;
  averageCred: number;
  tierDistribution: Record<string, number>;
  [key: string]: unknown;
}

// --- Outcome ---
export interface OutcomePayload {
  outcome: string;
  sessionId?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface OutcomeResult {
  success: boolean;
  id?: string;
  [key: string]: unknown;
}
