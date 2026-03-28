export class HelixaError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly body: unknown;

  constructor(message: string, status: number, code: string = 'HELIXA_ERROR', body?: unknown) {
    super(message);
    this.name = 'HelixaError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
}
