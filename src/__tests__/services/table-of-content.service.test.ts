import { describe, it, expect, vi } from "vitest";
import { generateTableOfContent } from "../../services/table-of-content.service";
import { AgentRunner } from "../../services/agent-runner";

function createRunner(overrides?: Partial<AgentRunner>): AgentRunner {
  return {
    run: vi.fn().mockResolvedValue({ finalOutput: null }),
    ...overrides,
  };
}

describe("generateTableOfContent", () => {
  it("returns TOC from agent output", async () => {
    const runner = createRunner({
      run: vi.fn().mockResolvedValue({
        finalOutput: {
          reportTitle: "AI Report",
          reportSummary: "Summary here",
          tableOfContents: [
            { id: "intro", title: "Introduction", summary: "Overview", specialElements: [] },
          ],
        },
      }),
    });

    const result = await generateTableOfContent(["data"], runner);
    expect(result.reportTitle).toBe("AI Report");
    expect(result.tableOfContents).toHaveLength(1);
  });

  it("returns fallback when agent returns null", async () => {
    const runner = createRunner();
    const result = await generateTableOfContent(["data"], runner);
    expect(result.reportTitle).toBe("");
    expect(result.reportSummary).toBe("");
    expect(result.tableOfContents).toEqual([]);
  });

  it("wraps errors in AgentError", async () => {
    const runner = { run: vi.fn().mockRejectedValue(new Error("TOC failed")) };
    await expect(generateTableOfContent(["data"], runner)).rejects.toThrow("TOC failed");
  });
});
