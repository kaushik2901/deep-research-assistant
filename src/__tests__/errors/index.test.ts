import { describe, it, expect } from "vitest";
import {
  ErrorCode,
  ResearchError,
  AgentError,
  ConfigurationError,
  SearchError,
  TimeoutError,
  RateLimitError,
  NetworkError,
  isRetryable,
} from "../../errors";

describe("ErrorCode enum", () => {
  it("has expected error codes", () => {
    expect(ErrorCode.AGENT_ERROR).toBe("AGENT_ERROR");
    expect(ErrorCode.CONFIG_ERROR).toBe("CONFIG_ERROR");
    expect(ErrorCode.SEARCH_ERROR).toBe("SEARCH_ERROR");
    expect(ErrorCode.TIMEOUT_ERROR).toBe("TIMEOUT_ERROR");
    expect(ErrorCode.RATE_LIMIT_ERROR).toBe("RATE_LIMIT_ERROR");
    expect(ErrorCode.NETWORK_ERROR).toBe("NETWORK_ERROR");
  });
});

describe("ResearchError", () => {
  it("creates a basic error with code and retryable flag", () => {
    const error = new ResearchError("Something went wrong", ErrorCode.AGENT_ERROR, true);
    expect(error.message).toBe("Something went wrong");
    expect(error.code).toBe(ErrorCode.AGENT_ERROR);
    expect(error.retryable).toBe(true);
    expect(error.name).toBe("ResearchError");
    expect(error).toBeInstanceOf(Error);
  });

  it("defaults retryable to false", () => {
    const error = new ResearchError("Not retryable", ErrorCode.CONFIG_ERROR);
    expect(error.retryable).toBe(false);
  });
});

describe("AgentError", () => {
  it("creates error with agent name", () => {
    const error = new AgentError("Agent failed", "MyAgent");
    expect(error.message).toBe("Agent failed");
    expect(error.code).toBe(ErrorCode.AGENT_ERROR);
    expect(error.retryable).toBe(true);
    expect(error.agentName).toBe("MyAgent");
    expect(error.name).toBe("AgentError");
    expect(error).toBeInstanceOf(ResearchError);
  });
});

describe("ConfigurationError", () => {
  it("creates non-retryable config error", () => {
    const error = new ConfigurationError("Missing API key");
    expect(error.message).toBe("Missing API key");
    expect(error.code).toBe(ErrorCode.CONFIG_ERROR);
    expect(error.retryable).toBe(false);
    expect(error.name).toBe("ConfigurationError");
    expect(error).toBeInstanceOf(ResearchError);
  });
});

describe("SearchError", () => {
  it("creates retryable search error", () => {
    const error = new SearchError("Search failed");
    expect(error.message).toBe("Search failed");
    expect(error.code).toBe(ErrorCode.SEARCH_ERROR);
    expect(error.retryable).toBe(true);
    expect(error.name).toBe("SearchError");
    expect(error).toBeInstanceOf(ResearchError);
  });
});

describe("TimeoutError", () => {
  it("creates retryable timeout error with ms", () => {
    const error = new TimeoutError("Timed out", 30000);
    expect(error.message).toBe("Timed out");
    expect(error.code).toBe(ErrorCode.TIMEOUT_ERROR);
    expect(error.retryable).toBe(true);
    expect(error.timeoutMs).toBe(30000);
    expect(error.name).toBe("TimeoutError");
    expect(error).toBeInstanceOf(ResearchError);
  });
});

describe("RateLimitError", () => {
  it("creates retryable rate limit error", () => {
    const error = new RateLimitError("Too many requests", 5000);
    expect(error.message).toBe("Too many requests");
    expect(error.code).toBe(ErrorCode.RATE_LIMIT_ERROR);
    expect(error.retryable).toBe(true);
    expect(error.retryAfterMs).toBe(5000);
    expect(error.name).toBe("RateLimitError");
    expect(error).toBeInstanceOf(ResearchError);
  });

  it("works without retryAfterMs", () => {
    const error = new RateLimitError("Too many requests");
    expect(error.retryAfterMs).toBeUndefined();
  });
});

describe("NetworkError", () => {
  it("creates retryable network error", () => {
    const cause = new Error("ECONNREFUSED");
    const error = new NetworkError("Connection failed", cause);
    expect(error.message).toBe("Connection failed");
    expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(error.retryable).toBe(true);
    expect(error.cause).toBe(cause);
    expect(error.name).toBe("NetworkError");
    expect(error).toBeInstanceOf(ResearchError);
  });
});

describe("isRetryable", () => {
  it("returns true for retryable ResearchError", () => {
    expect(isRetryable(new AgentError("fail", "X"))).toBe(true);
    expect(isRetryable(new SearchError("fail"))).toBe(true);
    expect(isRetryable(new TimeoutError("fail", 1000))).toBe(true);
    expect(isRetryable(new RateLimitError("fail"))).toBe(true);
    expect(isRetryable(new NetworkError("fail"))).toBe(true);
  });

  it("returns false for non-retryable ResearchError", () => {
    expect(isRetryable(new ConfigurationError("fail"))).toBe(false);
    expect(isRetryable(new ResearchError("fail", ErrorCode.CONFIG_ERROR, false))).toBe(false);
  });

  it("returns true for AbortError", () => {
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    expect(isRetryable(abortError)).toBe(true);
  });

  it("returns true for network-related TypeErrors", () => {
    const networkError = new TypeError("fetch failed: network error");
    expect(isRetryable(networkError)).toBe(true);

    const connectError = new TypeError("connect ECONNREFUSED");
    expect(isRetryable(connectError)).toBe(true);
  });

  it("returns true for Node.js network system errors", () => {
    const econnrefused = new Error("connect ECONNREFUSED 127.0.0.1:443");
    expect(isRetryable(econnrefused)).toBe(true);

    const econnreset = new Error("read ECONNRESET");
    expect(isRetryable(econnreset)).toBe(true);

    const etimedout = new Error("connect ETIMEDOUT");
    expect(isRetryable(etimedout)).toBe(true);

    const enotfound = new Error("getaddrinfo ENOTFOUND api.openai.com");
    expect(isRetryable(enotfound)).toBe(true);

    const socketHang = new Error("socket hang up");
    expect(isRetryable(socketHang)).toBe(true);
  });

  it("returns false for generic errors", () => {
    expect(isRetryable(new Error("generic"))).toBe(false);
    expect(isRetryable("string error")).toBe(false);
    expect(isRetryable(null)).toBe(false);
  });

  it("returns false for non-network TypeError", () => {
    const typeError = new TypeError("x is not a function");
    expect(isRetryable(typeError)).toBe(false);
  });
});
