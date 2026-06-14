import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { detectAmbiguity } from "../services/ambiguity-detector.service";
import { withRetry } from "../utils/retry.util";
import { withTimeout } from "../utils/timeout.util";
import Ambiguity from "../types/ambiguity.type";

const AGENT_TIMEOUT = 120_000;

export default async function runAmbiguityDetector(query: string): Promise<Ambiguity> {
  const spinner = ora({
    text: chalk.gray("Detecting ambiguities..."),
    spinner: "clock",
  }).start();

  try {
    const result = await withRetry(() =>
      withTimeout(() => detectAmbiguity(query, { run }), AGENT_TIMEOUT, "Ambiguity detector")
    );
    spinner.succeed(chalk.green("Ambiguity detection completed"));
    return result;
  } catch (error) {
    spinner.fail(chalk.red("Failed during ambiguity detection"));
    throw error;
  }
}
