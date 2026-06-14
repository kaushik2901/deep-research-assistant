import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { detectAmbiguity } from "../services/ambiguity-detector.service";
import { withRetry } from "../utils/retry.util";
import Ambiguity from "../types/ambiguity.type";

export default async function runAmbiguityDetector(query: string): Promise<Ambiguity> {
  const spinner = ora({
    text: chalk.gray("Detecting ambiguities..."),
    spinner: "clock",
  }).start();

  try {
    const result = await withRetry(() => detectAmbiguity(query, { run }));
    spinner.succeed(chalk.green("Ambiguity detection completed"));
    return result;
  } catch (error) {
    spinner.fail(chalk.red("Failed during ambiguity detection"));
    throw error;
  }
}
