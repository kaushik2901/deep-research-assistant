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

  it("isolates individual search failures instead of crashing all", async () => {
    const runner: AgentRunner = {
      run: vi
        .fn()
        .mockResolvedValueOnce({ finalOutput: "- Good result" })
        .mockRejectedValueOnce(new Error("search failed"))
        .mockResolvedValueOnce({ finalOutput: "- Another result" }),
    };

    const searches: Search[] = [
      { query: "q1", reason: "r1" },
      { query: "q2", reason: "r2" },
      { query: "q3", reason: "r3" },
    ];

    const results = await executeSearches(searches, runner);
    expect(results).toHaveLength(2);
    expect(results[0]).toBe("- Good result");
    expect(results[1]).toBe("- Another result");
  });

  it("returns empty array when all searches fail", async () => {
    const runner: AgentRunner = {
      run: vi.fn().mockRejectedValue(new Error("search failed")),
    };

    const results = await executeSearches([{ query: "q", reason: "r" }], runner);
    expect(results).toEqual([]);
  });
});
