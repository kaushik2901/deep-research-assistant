export enum ErrorCode {
  AGENT_ERROR = "AGENT_ERROR",
  CONFIG_ERROR = "CONFIG_ERROR",
  SEARCH_ERROR = "SEARCH_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
}

export class ResearchError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = "ResearchError";
  }
}

export class AgentError extends ResearchError {
  constructor(
    message: string,
    public readonly agentName: string
  ) {
    super(message, ErrorCode.AGENT_ERROR, true);
    this.name = "AgentError";
  }
}

export class ConfigurationError extends ResearchError {
  constructor(message: string) {
    super(message, ErrorCode.CONFIG_ERROR, false);
    this.name = "ConfigurationError";
  }
}

export class SearchError extends ResearchError {
  constructor(message: string) {
    super(message, ErrorCode.SEARCH_ERROR, true);
    this.name = "SearchError";
  }
}

export class TimeoutError extends ResearchError {
  constructor(
    message: string,
    public readonly timeoutMs: number
  ) {
    super(message, ErrorCode.TIMEOUT_ERROR, true);
    this.name = "TimeoutError";
  }
}

export class RateLimitError extends ResearchError {
  constructor(
    message: string,
    public readonly retryAfterMs?: number
  ) {
    super(message, ErrorCode.RATE_LIMIT_ERROR, true);
    this.name = "RateLimitError";
  }
}

export class NetworkError extends ResearchError {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message, ErrorCode.NETWORK_ERROR, true);
    this.name = "NetworkError";
  }
}

export function isRetryable(error: unknown): boolean {
  if (error instanceof ResearchError) {
    return error.retryable;
  }

  if (error instanceof Error) {
    const name = error.name;
    const msg = error.message.toLowerCase();

    if (name === "AbortError") return true;

    if (
      name === "TypeError" &&
      (msg.includes("network") ||
        msg.includes("fetch") ||
        msg.includes("connect") ||
        msg.includes("socket"))
    ) {
      return true;
    }

    if (
      msg.includes("econnrefused") ||
      msg.includes("econnreset") ||
      msg.includes("etimedout") ||
      msg.includes("enotfound") ||
      msg.includes("socket hang up")
    ) {
      return true;
    }
  }

  return false;
}
