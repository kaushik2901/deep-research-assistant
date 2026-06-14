import chalk from "chalk";
import Ambiguity from "../types/ambiguity.type";
import QuestionAnswer from "../types/question-answer.type";
import ask from "../utils/ask.util";

export default async function askClarificationQuestions(
  ambiguity: Ambiguity
): Promise<QuestionAnswer[]> {
  console.log(
    chalk.yellow(`\n❓ ${ambiguity.criticalAmbiguities.length} clarification question(s) needed:`)
  );
  console.log(chalk.gray(`   Reason: ${ambiguity.ambiguityReason}\n`));

  const answers: QuestionAnswer[] = [];
  for (const [index, question] of ambiguity.criticalAmbiguities.entries()) {
    console.log(chalk.blue(`Question ${index + 1}/${ambiguity.criticalAmbiguities.length}:`));
    const answer = await ask(question);
    answers.push({ question, answer });
  }

  return answers;
}
