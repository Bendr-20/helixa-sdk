export interface HelixaConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface EvidenceCoverage {
  score: number;
  label: string;
  helixaNative?: boolean;
  intuitionStatus?: string;
  signals?: Array<Record<string, unknown>>;
  missing?: string[];
}

export interface CredResult {
  tokenId: number;
  name: string;
  credScore: number;
  tier: 'JUNK' | 'MARGINAL' | 'QUALIFIED' | 'PRIME' | 'PREFERRED' | string;
  tierLabel: 'Junk' | 'Marginal' | 'Qualified' | 'Prime' | 'Preferred' | string;
  evidenceCoverage: EvidenceCoverage;
  scale: Record<string, string>;
  [key: string]: unknown;
}

export interface Trait {
  name: string;
  category: string;
  addedAt?: number | string | null;
}

export interface Agent {
  tokenId: number;
  agentAddress: string;
  owner: string;
  name: string;
  framework: string;
  mintedAt: string;
  verified: boolean;
  soulbound: boolean;
  mintOrigin: string;
  generation: number;
  version: number | string;
  mutationCount: number;
  points: number;
  credScore: number;
  traits: Trait[];
  personality?: Record<string, unknown> | null;
  narrative?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  services?: Record<string, unknown>;
  socials?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AgentSearchResult {
  agents: Agent[];
  total: number;
  totalUnfiltered?: number;
  page: number;
  pages: number;
  limit: number;
  cached?: boolean;
  cachedAt?: string;
}

export interface Stats {
  totalAgents: number;
  totalCredScore: number;
  frameworks: number;
  soulboundCount: number;
  totalHumans?: number;
  totalOrganizations?: number;
  mintPrice: string;
  network: string;
  chainId: number;
  contract: string;
  contractDeployed: boolean;
  phase: number;
  gasWallet: string;
  gasBalance: string;
  [key: string]: unknown;
}

export type SessionOutcome = 'COMPLETED' | 'FAILED' | 'VIOLATED' | 'DEFAULTED' | 'INJECTED';

export interface OutcomePayload {
  outcome: SessionOutcome;
  sessionId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  invoiceId?: string;
  amountUsdc?: number;
  counterparty?: string;
}

export interface OutcomeResult {
  ok: boolean;
  credDelta: string;
  newCred: number;
  tier: string;
  [key: string]: unknown;
}
