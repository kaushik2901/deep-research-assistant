import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import Search from "../types/search.type";
import searchPlannerAgent from "../agents/search-planner.agent";

export default async function runSearchPlanner(
  query: string
): Promise<Search[]> {
  const spinner = ora({
    text: chalk.gray("Planning research strategy..."),
    spinner: "clock",
  }).start();

  try {
    const response = await run(searchPlannerAgent, query);
    const searches = response.finalOutput?.searches ?? [];
    spinner.succeed(
      chalk.green(
        `Research plan created with ${searches.length} search strategies`
      )
    );
    return searches;
  } catch (error) {
    spinner.fail(chalk.red("Failed to create research plan"));
    throw error;
  }
}
