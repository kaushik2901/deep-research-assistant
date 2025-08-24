import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import referencesGeneratorAgent from "../agents/references-generator.agent";
import Reference from "../types/reference.type";

export default async function runReferencesGenerator(
  searchResults: string[]
): Promise<Reference[]> {
  const spinner = ora({
    text: chalk.gray("Generating references..."),
    spinner: "clock",
  }).start();

  try {
    const response = await run(
      referencesGeneratorAgent,
      JSON.stringify(searchResults)
    );
    spinner.succeed(chalk.green("References generated successfully"));
    return response.finalOutput?.references ?? [];
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate references"));
    throw error;
  }
}
