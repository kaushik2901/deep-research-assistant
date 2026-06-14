import { describe, it, expect, vi } from "vitest";
import { generateSections } from "../../services/report-sections.service";
import { AgentRunner } from "../../services/agent-runner";
import { TableOfContentSection } from "../../types/table-of-content.type";

describe("generateSections", () => {
  it("generates HTML for all sections", async () => {
    const runner: AgentRunner = {
      run: vi.fn().mockResolvedValue({
        finalOutput: { html: "<section><p>Content</p></section>" },
      }),
    };

    const toc: TableOfContentSection[] = [
      { id: "sec1", title: "Section 1", summary: "Sum", specialElements: [] },
      { id: "sec2", title: "Section 2", summary: "Sum", specialElements: [] },
    ];

    const sections = await generateSections(toc, ["data"], runner);
    expect(sections).toHaveLength(2);
    expect(sections[0].id).toBe("sec1");
    expect(sections[0].html).toBe("<section><p>Content</p></section>");
    expect(runner.run).toHaveBeenCalledTimes(2);
  });

  it("handles partial agent failures gracefully", async () => {
    const runner: AgentRunner = {
      run: vi
        .fn()
        .mockResolvedValueOnce({ finalOutput: { html: "<section>OK</section>" } })
        .mockRejectedValueOnce(new Error("fail")),
    };

    const toc: TableOfContentSection[] = [
      { id: "sec1", title: "S1", summary: "S", specialElements: [] },
      { id: "sec2", title: "S2", summary: "S", specialElements: [] },
    ];

    const sections = await generateSections(toc, ["data"], runner);
    expect(sections).toHaveLength(2);
    expect(sections[0].html).toBe("<section>OK</section>");
    expect(sections[1].html).toBe("");
  });

  it("returns empty HTML when agent returns null", async () => {
    const runner: AgentRunner = {
      run: vi.fn().mockResolvedValue({ finalOutput: null }),
    };

    const toc: TableOfContentSection[] = [
      { id: "s1", title: "S1", summary: "S", specialElements: [] },
    ];

    const sections = await generateSections(toc, ["data"], runner);
    expect(sections[0].html).toBe("");
  });
});
