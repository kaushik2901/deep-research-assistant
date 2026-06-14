import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { executeSearches } from "../services/search-executor.service";
import Search from "../types/search.type";

export default async function runSearchExecutor(searches: Search[]): Promise<string[]> {
  const spinner = ora({
    text: chalk.gray(`Executing ${searches.length} searches in parallel...`),
    spinner: "clock",
  }).start();

  try {
    const searchResults = await executeSearches(searches, { run });
    spinner.succeed(
      chalk.green(`Search execution completed. Retrieved ${searchResults.length} result sets`)
    );
    return searchResults;
  } catch (error) {
    spinner.fail(chalk.red("Failed during search execution"));
    throw error;
  }
}
