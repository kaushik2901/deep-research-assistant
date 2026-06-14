import { describe, it, expect, vi } from "vitest";
import { runResearch, RunDeps } from "../run";

function createMockDeps(overrides?: Partial<RunDeps>): RunDeps {
  return {
    ask: vi.fn().mockResolvedValue("my query"),
    buildQuery: vi.fn().mockResolvedValue("enhanced query"),
    detectAmbiguity: vi.fn().mockResolvedValue({
      isAmbiguousQuery: false,
      ambiguityReason: "",
      criticalAmbiguities: [],
      confidence: 1,
    }),
    askClarificationQuestions: vi.fn(),
    rebuildAmbiguousQuery: vi.fn().mockReturnValue("clarified query"),
    planSearches: vi.fn().mockResolvedValue([{ query: "search 1", reason: "reason 1" }]),
    executeSearches: vi.fn().mockResolvedValue(["result 1"]),
    generateTableOfContent: vi.fn().mockResolvedValue({
      reportTitle: "Test Report",
      reportSummary: "Summary",
      tableOfContents: [{ id: "s1", title: "S1", summary: "S", specialElements: [] }],
    }),
    generateSections: vi
      .fn()
      .mockResolvedValue([{ id: "s1", title: "S1", html: "<p>Content</p>" }]),
    generateReferences: vi.fn().mockResolvedValue([{ title: "Ref", url: "https://example.com" }]),
    generateReport: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("runResearch", () => {
  it("executes full happy path flow", async () => {
    const deps = createMockDeps();

    await runResearch(deps);

    expect(deps.ask).toHaveBeenCalledWith("Enter your research query");
    expect(deps.buildQuery).toHaveBeenCalled();
    expect(deps.detectAmbiguity).toHaveBeenCalled();
    expect(deps.planSearches).toHaveBeenCalled();
    expect(deps.executeSearches).toHaveBeenCalled();
    expect(deps.generateTableOfContent).toHaveBeenCalled();
    expect(deps.generateSections).toHaveBeenCalled();
    expect(deps.generateReferences).toHaveBeenCalled();
    expect(deps.generateReport).toHaveBeenCalled();
  });

  it("triggers onAmbiguityClear when query is clear", async () => {
    const onAmbiguityClear = vi.fn();
    const deps = createMockDeps({ onAmbiguityClear });

    await runResearch(deps);
    expect(onAmbiguityClear).toHaveBeenCalled();
  });

  it("asks clarification questions when ambiguous", async () => {
    const detectAmbiguity = vi
      .fn()
      .mockResolvedValueOnce({
        isAmbiguousQuery: true,
        ambiguityReason: "Too broad",
        criticalAmbiguities: ["Specify scope?"],
        confidence: 0.8,
      })
      .mockResolvedValueOnce({
        isAmbiguousQuery: false,
        ambiguityReason: "",
        criticalAmbiguities: [],
        confidence: 1,
      });

    const askClarificationQuestions = vi
      .fn()
      .mockResolvedValue([{ question: "Specify scope?", answer: "Healthcare" }]);

    const onClarificationCompleted = vi.fn();

    const deps = createMockDeps({
      detectAmbiguity,
      askClarificationQuestions,
      onClarificationCompleted,
    });

    await runResearch(deps);
    expect(askClarificationQuestions).toHaveBeenCalled();
    expect(onClarificationCompleted).toHaveBeenCalledWith(1);
  });

  it("stops at max clarification iterations", async () => {
    const detectAmbiguity = vi.fn().mockResolvedValue({
      isAmbiguousQuery: true,
      ambiguityReason: "Still broad",
      criticalAmbiguities: ["More info needed"],
      confidence: 0.8,
    });

    const onMaxIterationsReached = vi.fn();

    const deps = createMockDeps({
      detectAmbiguity,
      onMaxIterationsReached,
    });

    await runResearch(deps);
    expect(onMaxIterationsReached).toHaveBeenCalled();
  });
});
