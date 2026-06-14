import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { planSearches } from "../services/search-planner.service";
import { withRetry } from "../utils/retry.util";
import { withTimeout } from "../utils/timeout.util";
import Search from "../types/search.type";

const AGENT_TIMEOUT = 120_000;

export default async function runSearchPlanner(query: string): Promise<Search[]> {
  const spinner = ora({
    text: chalk.gray("Planning research strategy..."),
    spinner: "clock",
  }).start();

  try {
    const searches = await withRetry(() =>
      withTimeout(() => planSearches(query, { run }), AGENT_TIMEOUT, "Search planner")
    );
    spinner.succeed(chalk.green(`Research plan created with ${searches.length} search strategies`));
    return searches;
  } catch (error) {
    spinner.fail(chalk.red("Failed to create research plan"));
    throw error;
  }
}
