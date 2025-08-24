import QuestionAnswer from "../types/question-answer.type";

export default function rebuildAmbiguousQuery(
  query: string,
  reason: string,
  questionAnswers: QuestionAnswer[]
) {
  return JSON.stringify({
    query,
    reason,
    questionAnswers,
  });
}
