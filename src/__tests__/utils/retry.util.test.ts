import { describe, it, expect, vi } from "vitest";
import { withRetry } from "../../utils/retry.util";
import { AgentError } from "../../errors";

describe("withRetry", () => {
  it("returns result on first success", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await withRetry(fn);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on retryable error and eventually succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new AgentError("temporary", "X"))
      .mockRejectedValueOnce(new AgentError("temporary", "X"))
      .mockResolvedValue("success");

    const result = await withRetry(fn, { maxRetries: 3, baseDelay: 10 });
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("throws after all retries exhausted", async () => {
    const fn = vi.fn().mockRejectedValue(new AgentError("persistent", "X"));

    await expect(withRetry(fn, { maxRetries: 2, baseDelay: 10 })).rejects.toThrow("persistent");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not retry non-retryable errors", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fatal"));

    await expect(withRetry(fn, { maxRetries: 3, baseDelay: 10 })).rejects.toThrow("fatal");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("uses default options when none provided", async () => {
    const fn = vi.fn().mockRejectedValue(new AgentError("fail", "X"));
    await expect(withRetry(fn)).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
