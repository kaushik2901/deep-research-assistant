import { describe, it, expect, vi } from "vitest";
import { executeSearches } from "../../services/search-executor.service";
import { AgentRunner } from "../../services/agent-runner";
import Search from "../../types/search.type";

describe("executeSearches", () => {
  it("executes all searches and returns results", async () => {
    const runner: AgentRunner = {
      run: vi.fn().mockResolvedValue({
        finalOutput: "- Result data here",
      }),
    };

    const searches: Search[] = [
      { query: "q1", reason: "r1" },
      { query: "q2", reason: "r2" },
    ];

    const results = await executeSearches(searches, runner);
    expect(results).toHaveLength(2);
    expect(results[0]).toBe("- Result data here");
    expect(runner.run).toHaveBeenCalledTimes(2);
  });

  it("filters out null results", async () => {
    const runner: AgentRunner = {
      run: vi
        .fn()
        .mockResolvedValueOnce({ finalOutput: "- Data" })
        .mockResolvedValueOnce({ finalOutput: null }),
    };

    const searches: Search[] = [
      { query: "q1", reason: "r1" },
      { query: "q2", reason: "r2" },
    ];

    const results = await executeSearches(searches, runner);
    expect(results).toHaveLength(1);
    expect(results[0]).toBe("- Data");
  });

  it("wraps errors in AgentError", async () => {
    const runner: AgentRunner = {
      run: vi.fn().mockRejectedValue(new Error("search failed")),
    };

    await expect(executeSearches([{ query: "q", reason: "r" }], runner)).rejects.toThrow(
      "search failed"
    );
  });
});
