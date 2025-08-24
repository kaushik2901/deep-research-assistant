import { config } from "dotenv";
import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import * as inquirer from "inquirer";
import queryBuilder from "./agents/query-builder.agent";
import ambiguityDetector from "./agents/ambiguous-query-detector.agent";
import searchPlanner from "./agents/search-planner.agent";
import searchExecutorAgent from "./agents/search-executor.agent";

config();

interface Search {
  query: string;
  reason: string;
}

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface Context {
  query: string;
  iterationCount: number;
  searches: Search[];
  searchResults: string[];
}

const MAX_CLARIFICATION_ITERATION = 2;

async function ask(prompt: string): Promise<string> {
  const answers = await inquirer.default.prompt([
    {
      type: "input",
      name: "response",
      message: prompt,
    },
  ]);
  return answers.response;
}

function printBanner() {
  console.log(
    chalk.bold.blue(`

  ██████╗ ███████╗███████╗██████╗ ██╗   ██╗███████╗██╗      █████╗ ██╗   ██╗
  ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██║     ██╔══██╗╚██╗ ██╔╝
  ██║  ██║█████╗  █████╗  ██████╔╝██║   ██║█████╗  ██║     ███████║ ╚████╔╝ 
  ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██║     ██╔══██║  ╚██╔╝  
  ██████╔╝███████╗███████╗██║  ██║ ╚████╔╝ ███████╗███████╗██║  ██║   ██║   
  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   
                                                                            
  `)
  );
  console.log(
    chalk.yellow(
      "An intelligent research agent with ambiguity detection and clarification capabilities\n"
    )
  );
}

async function main() {
  printBanner();

  const context: Context = {
    query: "",
    iterationCount: 0,
    searches: [],
    searchResults: [],
  };

  context.query = await ask("Enter your research query");

  while (true) {
    // Query Building Phase
    const queryBuildingSpinner = ora({
      text: chalk.gray("Building comprehensive query..."),
      spinner: "clock",
    }).start();

    try {
      const qbResponse = await run(queryBuilder, context.query);
      context.query = qbResponse.finalOutput ?? "";
      queryBuildingSpinner.succeed(chalk.green("Query built successfully"));
    } catch (error) {
      queryBuildingSpinner.fail(chalk.red("Failed to build query"));
      throw error;
    }

    const ambiguitySpinner = ora({
      text: chalk.gray("Detecting ambiguities..."),
      spinner: "clock",
    }).start();

    try {
      const adResponse = await run(ambiguityDetector, context.query);
      const ambiguity = adResponse.finalOutput;
      ambiguitySpinner.succeed(chalk.green("Ambiguity detection completed"));

      if (!ambiguity || !ambiguity?.isAmbiguousQuery) {
        console.log(
          chalk.green(
            "✅ Query is clear and unambiguous. Proceeding to research..."
          )
        );
        break;
      }

      if (context.iterationCount >= MAX_CLARIFICATION_ITERATION) {
        console.log(
          chalk.yellow(
            "⚠️  Maximum clarification iterations reached. Proceeding with current query..."
          )
        );
        break;
      }

      console.log(
        chalk.yellow(
          `\n❓ ${ambiguity.criticalAmbiguities.length} clarification question(s) needed:`
        )
      );
      console.log(chalk.gray(`   Reason: ${ambiguity.ambiguityReason}\n`));

      const answers: QuestionAnswer[] = [];
      for (const [index, question] of ambiguity.criticalAmbiguities.entries()) {
        console.log(
          chalk.blue(
            `Question ${index + 1}/${ambiguity.criticalAmbiguities.length}:`
          )
        );
        const answer = await ask(question);
        answers.push({ question, answer });
      }

      const reason = ambiguity?.ambiguityReason;
      context.query = `
        {
            "query": "${context.query}", 
            "ambiguityReason": "${reason}", 
            "questionAnswers": "${JSON.stringify(answers)}"
        }
      `;

      context.iterationCount++;
      console.log(
        chalk.green(
          `\n✅ Clarification round ${context.iterationCount} completed. Refining query...\n`
        )
      );
    } catch (error) {
      ambiguitySpinner.fail(chalk.red("Failed during ambiguity detection"));
      throw error;
    }
  }

  const planningSpinner = ora({
    text: chalk.gray("Planning research strategy..."),
    spinner: "clock",
  }).start();

  try {
    const spResponse = await run(searchPlanner, context.query);
    context.searches = spResponse.finalOutput?.searches ?? [];
    planningSpinner.succeed(
      chalk.green(
        `Research plan created with ${context.searches.length} search strategies`
      )
    );
  } catch (error) {
    planningSpinner.fail(chalk.red("Failed to create research plan"));
    throw error;
  }

  console.log(chalk.blue("\n📋 Research Strategy:"));
  context.searches.forEach((search, index) => {
    console.log(chalk.gray(`  ${index + 1}. ${search.query}`));
    console.log(chalk.gray(`     Reason: ${search.reason}\n`));
  });

  const executionSpinner = ora({
    text: chalk.gray(
      `Executing ${context.searches.length} searches in parallel...`
    ),
    spinner: "clock",
  }).start();

  try {
    const seResponses = await Promise.all(
      context.searches.map((search) =>
        run(searchExecutorAgent, JSON.stringify(search))
      )
    );

    context.searchResults = seResponses
      .map((x) => x.finalOutput ?? "")
      .filter((x) => !!x);

    executionSpinner.succeed(
      chalk.green(
        `Search execution completed. Retrieved ${context.searchResults.length} result sets`
      )
    );
  } catch (error) {
    executionSpinner.fail(chalk.red("Failed during search execution"));
    throw error;
  }

  // Display results summary
  console.log(chalk.blue("\n📊 Research Results Summary:"));
  console.log(
    chalk.gray(`  Found ${context.searchResults.length} distinct result sets`)
  );
  console.log(chalk.gray(`  Research data ready for synthesis`));

  console.log(chalk.green("\n✅ Research process completed successfully!"));
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
