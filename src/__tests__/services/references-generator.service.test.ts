import { describe, it, expect, vi } from "vitest";
import { generateReferences } from "../../services/references-generator.service";
import { AgentRunner } from "../../services/agent-runner";

function createRunner(overrides?: Partial<AgentRunner>): AgentRunner {
  return {
    run: vi.fn().mockResolvedValue({ finalOutput: null }),
    ...overrides,
  };
}

describe("generateReferences", () => {
  it("returns references from agent output", async () => {
    const runner = createRunner({
      run: vi.fn().mockResolvedValue({
        finalOutput: {
          references: [
            { title: "Article 1", url: "https://example.com/1" },
            { title: "Article 2", url: "https://example.com/2" },
          ],
        },
      }),
    });

    const result = await generateReferences(["data"], runner);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Article 1");
    expect(result[0].url).toBe("https://example.com/1");
  });

  it("returns empty array when agent returns null", async () => {
    const runner = createRunner();
    const result = await generateReferences(["data"], runner);
    expect(result).toEqual([]);
  });

  it("wraps errors in AgentError", async () => {
    const runner = { run: vi.fn().mockRejectedValue(new Error("refs fail")) };
    await expect(generateReferences(["data"], runner)).rejects.toThrow("refs fail");
  });
});
