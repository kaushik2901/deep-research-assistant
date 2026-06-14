import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { buildQuery } from "../services/query-builder.service";

export default async function runQueryBuilder(query: string): Promise<string> {
  const spinner = ora({
    text: chalk.gray("Building comprehensive query..."),
    spinner: "clock",
  }).start();

  try {
    const result = await buildQuery(query, { run });
    spinner.succeed(chalk.green("Query built successfully"));
    return result;
  } catch (error) {
    spinner.fail(chalk.red("Failed to build query"));
    throw error;
  }
}
