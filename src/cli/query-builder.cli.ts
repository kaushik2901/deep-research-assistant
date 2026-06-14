import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { buildQuery } from "../services/query-builder.service";
import { withRetry } from "../utils/retry.util";
import { withTimeout } from "../utils/timeout.util";

const AGENT_TIMEOUT = 120_000;

export default async function runQueryBuilder(query: string): Promise<string> {
  const spinner = ora({
    text: chalk.gray("Building comprehensive query..."),
    spinner: "clock",
  }).start();

  try {
    const result = await withRetry(() =>
      withTimeout(() => buildQuery(query, { run }), AGENT_TIMEOUT, "Query builder")
    );
    spinner.succeed(chalk.green("Query built successfully"));
    return result;
  } catch (error) {
    spinner.fail(chalk.red("Failed to build query"));
    throw error;
  }
}
