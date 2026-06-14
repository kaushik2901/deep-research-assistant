import { describe, it, expect, vi } from "vitest";
import { buildQuery } from "../../services/query-builder.service";
import { AgentRunner } from "../../services/agent-runner";

function createRunner(overrides?: Partial<AgentRunner>): AgentRunner {
  return {
    run: vi.fn().mockResolvedValue({ finalOutput: null }),
    ...overrides,
  };
}

describe("buildQuery", () => {
  it("returns enhanced query from agent", async () => {
    const runner = createRunner({
      run: vi.fn().mockResolvedValue({
        finalOutput: "Enhanced: AI impact on healthcare 2024",
      }),
    });

    const result = await buildQuery("AI impact", runner);
    expect(result).toBe("Enhanced: AI impact on healthcare 2024");
  });

  it("returns empty string when agent returns null", async () => {
    const runner = createRunner();
    const result = await buildQuery("test", runner);
    expect(result).toBe("");
  });

  it("wraps errors in AgentError", async () => {
    const runner = { run: vi.fn().mockRejectedValue(new Error("builder fail")) };
    await expect(buildQuery("test", runner)).rejects.toThrow("builder fail");
  });
});
