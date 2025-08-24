import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import searchExecutorAgent from "../agents/search-executor.agent";
import Search from "../types/search.type";

export default async function runSearchExecutor(
  searches: Search[]
): Promise<string[]> {
  const spinner = ora({
    text: chalk.gray(`Executing ${searches.length} searches in parallel...`),
    spinner: "clock",
  }).start();

  try {
    const response = await Promise.all(
      searches.map((search) => run(searchExecutorAgent, JSON.stringify(search)))
    );

    const searchResults = response
      .map((x) => x.finalOutput ?? "")
      .filter((x) => !!x);

    spinner.succeed(
      chalk.green(
        `Search execution completed. Retrieved ${searchResults.length} result sets`
      )
    );

    return searchResults;
  } catch (error) {
    spinner.fail(chalk.red("Failed during search execution"));
    throw error;
  }
}
