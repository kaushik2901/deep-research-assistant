import { describe, it, expect, vi } from "vitest";
import { detectAmbiguity } from "../../services/ambiguity-detector.service";
import { AgentRunner } from "../../services/agent-runner";

function createRunner(overrides?: Partial<AgentRunner>): AgentRunner {
  return {
    run: vi.fn().mockResolvedValue({ finalOutput: null }),
    ...overrides,
  };
}

describe("detectAmbiguity", () => {
  it("returns ambiguity when agent provides output", async () => {
    const runner = createRunner({
      run: vi.fn().mockResolvedValue({
        finalOutput: {
          isAmbiguousQuery: true,
          ambiguityReason: "Too broad",
          criticalAmbiguities: ["Scope unclear"],
          confidence: 0.9,
        },
      }),
    });

    const result = await detectAmbiguity("test query", runner);
    expect(result.isAmbiguousQuery).toBe(true);
    expect(result.ambiguityReason).toBe("Too broad");
    expect(result.criticalAmbiguities).toEqual(["Scope unclear"]);
    expect(result.confidence).toBe(0.9);
  });

  it("returns fallback defaults when agent returns null", async () => {
    const runner = createRunner();

    const result = await detectAmbiguity("test query", runner);
    expect(result.isAmbiguousQuery).toBe(false);
    expect(result.ambiguityReason).toBe("");
    expect(result.confidence).toBe(0);
    expect(result.criticalAmbiguities).toEqual([]);
  });

  it("wraps agent errors in AgentError", async () => {
    const runner = {
      run: vi.fn().mockRejectedValue(new Error("API failure")),
    };

    await expect(detectAmbiguity("test", runner)).rejects.toThrow("API failure");
  });
});
