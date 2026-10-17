import { HelixaConfig, CredResult, Agent, AgentSearchResult, Stats, OutcomePayload, OutcomeResult } from './types.js';
import { HelixaError } from './error.js';

const DEFAULT_BASE_URL = 'https://api.helixa.xyz/api/v2';

export class Helixa {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  constructor(config: HelixaConfig = {}) {
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiKey = config['apiKey'];
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (this.apiKey) headers['X-API-Key'] = this.apiKey;

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    } catch (err) {
      throw new HelixaError(`Network error: ${(err as Error).message}`, 0, 'NETWORK_ERROR');
    }

    const text = await res.text();
    let body: unknown;
    try { body = JSON.parse(text); } catch { body = text; }
    if (!res.ok) {
      const msg = typeof body === 'object' && body !== null && 'error' in body
        ? String((body as { error: unknown }).error)
        : typeof body === 'object' && body !== null && 'message' in body
          ? String((body as { message: unknown }).message)
          : `HTTP ${res.status}`;
      throw new HelixaError(msg, res.status, 'API_ERROR', body);
    }
    return body as T;
  }

  /** Get Cred by numeric Helixa token ID. Resolve wallets/names with searchAgents first. */
  async checkCred(tokenId: number): Promise<CredResult> {
    return this.request<CredResult>(`/agent/${tokenId}/cred`);
  }

  /** Get a full profile by numeric Helixa token ID. */
  async getAgent(tokenId: number): Promise<Agent> {
    return this.request<Agent>(`/agent/${tokenId}`);
  }

  /** Search names, wallets, or token IDs. */
  async searchAgents(search: string, page = 1, limit = 20): Promise<AgentSearchResult> {
    const params = new URLSearchParams({ search, page: String(page), limit: String(limit) });
    return this.request<AgentSearchResult>(`/agents?${params}`);
  }

  async getStats(): Promise<Stats> {
    return this.request<Stats>('/stats');
  }

  /** Report an outcome for a full agent wallet address using X-API-Key. */
  async reportOutcome(address: string, payload: OutcomePayload): Promise<OutcomeResult> {
    if (!this.apiKey) throw new HelixaError('API key required to report outcomes', 401, 'AUTH_REQUIRED');
    return this.request<OutcomeResult>(`/agent/${address}/session-outcome`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}
