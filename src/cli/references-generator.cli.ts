import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { generateReferences } from "../services/references-generator.service";
import { withRetry } from "../utils/retry.util";
import { withTimeout } from "../utils/timeout.util";
import Reference from "../types/reference.type";

const AGENT_TIMEOUT = 120_000;

export default async function runReferencesGenerator(
  searchResults: string[]
): Promise<Reference[]> {
  const spinner = ora({
    text: chalk.gray("Generating references..."),
    spinner: "clock",
  }).start();

  try {
    const references = await withRetry(() =>
      withTimeout(
        () => generateReferences(searchResults, { run }),
        AGENT_TIMEOUT,
        "References generator"
      )
    );
    spinner.succeed(chalk.green("References generated successfully"));
    return references;
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate references"));
    throw error;
  }
}
