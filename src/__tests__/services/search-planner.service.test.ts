import { describe, it, expect, vi } from "vitest";
import { planSearches } from "../../services/search-planner.service";
import { AgentRunner } from "../../services/agent-runner";

function createRunner(overrides?: Partial<AgentRunner>): AgentRunner {
  return {
    run: vi.fn().mockResolvedValue({ finalOutput: null }),
    ...overrides,
  };
}

describe("planSearches", () => {
  it("returns searches from agent output", async () => {
    const runner = createRunner({
      run: vi.fn().mockResolvedValue({
        finalOutput: {
          searches: [
            { query: "AI trends", reason: "Find latest trends" },
            { query: "AI statistics", reason: "Get data" },
          ],
        },
      }),
    });

    const result = await planSearches("AI impact", runner);
    expect(result).toHaveLength(2);
    expect(result[0].query).toBe("AI trends");
    expect(result[1].reason).toBe("Get data");
  });

  it("returns empty array when agent returns null", async () => {
    const runner = createRunner();
    const result = await planSearches("test", runner);
    expect(result).toEqual([]);
  });

  it("wraps errors in AgentError", async () => {
    const runner = {
      run: vi.fn().mockRejectedValue(new Error("fail")),
    };
    await expect(planSearches("test", runner)).rejects.toThrow("fail");
  });
});
