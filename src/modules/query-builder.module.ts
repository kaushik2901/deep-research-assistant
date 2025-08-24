import { run } from "@openai/agents";
import queryBuilderAgent from "../agents/query-builder.agent";
import chalk from "chalk";
import ora from "ora";

export default async function runQueryBuilder(query: string): Promise<string> {
  const spinner = ora({
    text: chalk.gray("Building comprehensive query..."),
    spinner: "clock",
  }).start();

  try {
    const qbResponse = await run(queryBuilderAgent, query);
    spinner.succeed(chalk.green("Query built successfully"));
    return qbResponse.finalOutput ?? "";
  } catch (error) {
    spinner.fail(chalk.red("Failed to build query"));
    throw error;
  }
}
