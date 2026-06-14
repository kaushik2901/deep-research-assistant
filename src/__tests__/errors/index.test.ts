import { describe, it, expect } from "vitest";
import {
  ResearchError,
  AgentError,
  ConfigurationError,
  SearchError,
  isRetryable,
} from "../../errors";

describe("ResearchError", () => {
  it("creates a basic error with code and retryable flag", () => {
    const error = new ResearchError("Something went wrong", "TEST_ERROR", true);
    expect(error.message).toBe("Something went wrong");
    expect(error.code).toBe("TEST_ERROR");
    expect(error.retryable).toBe(true);
    expect(error.name).toBe("ResearchError");
    expect(error).toBeInstanceOf(Error);
  });

  it("defaults retryable to false", () => {
    const error = new ResearchError("Not retryable", "FATAL");
    expect(error.retryable).toBe(false);
  });
});

describe("AgentError", () => {
  it("creates error with agent name", () => {
    const error = new AgentError("Agent failed", "MyAgent");
    expect(error.message).toBe("Agent failed");
    expect(error.code).toBe("AGENT_ERROR");
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
    expect(error.code).toBe("CONFIG_ERROR");
    expect(error.retryable).toBe(false);
    expect(error.name).toBe("ConfigurationError");
    expect(error).toBeInstanceOf(ResearchError);
  });
});

describe("SearchError", () => {
  it("creates retryable search error", () => {
    const error = new SearchError("Search failed");
    expect(error.message).toBe("Search failed");
    expect(error.code).toBe("SEARCH_ERROR");
    expect(error.retryable).toBe(true);
    expect(error.name).toBe("SearchError");
    expect(error).toBeInstanceOf(ResearchError);
  });
});

describe("isRetryable", () => {
  it("returns true for retryable ResearchError", () => {
    expect(isRetryable(new AgentError("fail", "X"))).toBe(true);
    expect(isRetryable(new SearchError("fail"))).toBe(true);
  });

  it("returns false for non-retryable ResearchError", () => {
    expect(isRetryable(new ConfigurationError("fail"))).toBe(false);
    expect(isRetryable(new ResearchError("fail", "X", false))).toBe(false);
  });

  it("returns false for non-ResearchError errors", () => {
    expect(isRetryable(new Error("generic"))).toBe(false);
    expect(isRetryable("string error")).toBe(false);
    expect(isRetryable(null)).toBe(false);
  });
});
