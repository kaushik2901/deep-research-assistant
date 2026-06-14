export class ResearchError extends Error {
  constructor(
    message: string,
    public readonly code: string,
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
    super(message, "AGENT_ERROR", true);
    this.name = "AgentError";
  }
}

export class ConfigurationError extends ResearchError {
  constructor(message: string) {
    super(message, "CONFIG_ERROR", false);
    this.name = "ConfigurationError";
  }
}

export class SearchError extends ResearchError {
  constructor(message: string) {
    super(message, "SEARCH_ERROR", true);
    this.name = "SearchError";
  }
}

export function isRetryable(error: unknown): boolean {
  return error instanceof ResearchError && error.retryable;
}
