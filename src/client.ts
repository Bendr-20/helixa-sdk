import { HelixaConfig, CredResult, Agent, AgentSearchResult, Stats, OutcomePayload, OutcomeResult } from './types.js';
import { HelixaError } from './error.js';

const DEFAULT_BASE_URL = 'https://api.helixa.xyz/api/v2';

export class Helixa {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  constructor(config: HelixaConfig = {}) {
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiKey = config.apiKey;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const url = `${this.baseUrl}${path}`;
    let res: Response;

    try {
      res = await fetch(url, { ...options, headers });
    } catch (err) {
      throw new HelixaError(
        `Network error: ${(err as Error).message}`,
        0,
        'NETWORK_ERROR'
      );
    }

    let body: unknown;
    const text = await res.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    if (!res.ok) {
      const msg = typeof body === 'object' && body !== null && 'message' in body
        ? (body as { message: string }).message
        : `HTTP ${res.status}`;
      throw new HelixaError(msg, res.status, 'API_ERROR', body);
    }

    return body as T;
  }

  /** Check cred score for an address */
  async checkCred(address: string): Promise<CredResult> {
    return this.request<CredResult>(`/cred/${address}`);
  }

  /** Get agent by ID */
  async getAgent(id: number): Promise<Agent> {
    return this.request<Agent>(`/agents/${id}`);
  }

  /** Search agents by query */
  async searchAgents(query: string, page = 1, pageSize = 20): Promise<AgentSearchResult> {
    const params = new URLSearchParams({ q: query, page: String(page), pageSize: String(pageSize) });
    return this.request<AgentSearchResult>(`/agents?${params}`);
  }

  /** Get platform stats */
  async getStats(): Promise<Stats> {
    return this.request<Stats>('/stats');
  }

  /** Report an outcome (requires API key) */
  async reportOutcome(address: string, payload: OutcomePayload): Promise<OutcomeResult> {
    if (!this.apiKey) {
      throw new HelixaError('API key required to report outcomes', 401, 'AUTH_REQUIRED');
    }
    return this.request<OutcomeResult>(`/cred/${address}/outcomes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}
