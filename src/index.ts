import { config } from "dotenv";
import chalk from "chalk";
import Context from "./types/context.type";
import QuestionAnswer from "./types/question-answer.type";
import ask from "./utils/ask.util";
import runQueryBuilder from "./modules/query-builder.module";
import runAmbiguityDetector from "./modules/ambiguity-detector.module";
import askClarificationQuestions from "./modules/ask-clarification-questions.module";
import printBanner from "./utils/print-banner.util";
import { printGreen, printYellow } from "./utils/print.util";
import runSearchPlanner from "./modules/search-planner.module";
import runSearchExecutor from "./modules/search-executor.module";
import rebuildAmbiguousQuery from "./utils/rebuild-ambiguous-query.util";

config();

const MAX_CLARIFICATION_ITERATION = 2;

async function main() {
  printBanner();

  const context: Context = {
    query: "",
    clarificationIterationCount: 0,
    searches: [],
    searchResults: [],
  };

  context.query = await ask("Enter your research query");

  while (true) {
    context.query = await runQueryBuilder(context.query);

    try {
      const ambiguity = await runAmbiguityDetector(context.query);

      if (!ambiguity.isAmbiguousQuery) {
        printGreen(
          "✔ Query is clear and unambiguous. Proceeding to research..."
        );
        break;
      }

      if (context.clarificationIterationCount >= MAX_CLARIFICATION_ITERATION) {
        printYellow(
          "⚠️  Maximum clarification iterations reached. Proceeding with current query..."
        );
        break;
      }

      const answers: QuestionAnswer[] = await askClarificationQuestions(
        ambiguity
      );

      context.query = rebuildAmbiguousQuery(
        context.query,
        ambiguity?.ambiguityReason,
        answers
      );

      context.clarificationIterationCount++;

      printGreen(
        `\n✔ Clarification round ${context.clarificationIterationCount} completed. Refining query...\n`
      );
    } catch (error) {
      throw error;
    }
  }

  context.searches = await runSearchPlanner(context.query);

  console.log(chalk.blue("\n📋 Research Strategy:"));
  context.searches.forEach((search, index) => {
    console.log(chalk.gray(`  ${index + 1}. ${search.query}`));
    console.log(chalk.gray(`     Reason: ${search.reason}\n`));
  });

  context.searchResults = await runSearchExecutor(context.searches);

  // Display results summary
  console.log(chalk.blue("\n📊 Research Results Summary:"));
  console.log(
    chalk.gray(`  Found ${context.searchResults.length} distinct result sets`)
  );
  console.log(chalk.gray(`  Research data ready for synthesis`));

  console.log(chalk.green("\n✔ Research process completed successfully!"));
  console.log(
    chalk.yellow(
      "Next steps: Implement the report generation agent to synthesize these results."
    )
  );
}

main().catch((err) => {
  console.error(chalk.red("❌ Error:"), err);
  process.exit(1);
});
