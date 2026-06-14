import { describe, it, expect } from "vitest";
import rebuildAmbiguousQuery from "../../utils/rebuild-ambiguous-query.util";
import QuestionAnswer from "../../types/question-answer.type";

describe("rebuildAmbiguousQuery", () => {
  it("serializes query with reason and answers", () => {
    const answers: QuestionAnswer[] = [{ question: "What industry?", answer: "Healthcare" }];
    const result = rebuildAmbiguousQuery("AI impact", "Too broad", answers);
    const parsed = JSON.parse(result);
    expect(parsed.query).toBe("AI impact");
    expect(parsed.reason).toBe("Too broad");
    expect(parsed.questionAnswers).toHaveLength(1);
    expect(parsed.questionAnswers[0].question).toBe("What industry?");
    expect(parsed.questionAnswers[0].answer).toBe("Healthcare");
  });

  it("handles empty answers array", () => {
    const result = rebuildAmbiguousQuery("test", "reason", []);
    const parsed = JSON.parse(result);
    expect(parsed.questionAnswers).toEqual([]);
  });

  it("handles multiple Q&A pairs", () => {
    const answers: QuestionAnswer[] = [
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ];
    const result = rebuildAmbiguousQuery("query", "ambiguous", answers);
    const parsed = JSON.parse(result);
    expect(parsed.questionAnswers).toHaveLength(2);
  });
});
