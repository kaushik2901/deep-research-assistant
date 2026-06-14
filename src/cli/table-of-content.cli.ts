import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { generateTableOfContent } from "../services/table-of-content.service";
import { withRetry } from "../utils/retry.util";
import TableOfContent from "../types/table-of-content.type";

export default async function runTableOfContentGenerator(
  searchResults: string[]
): Promise<TableOfContent> {
  const spinner = ora({
    text: chalk.gray("Generating table of content..."),
    spinner: "clock",
  }).start();

  try {
    const result = await withRetry(() => generateTableOfContent(searchResults, { run }));
    spinner.succeed(chalk.green("Table of content generated successfully"));
    return result;
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate table of content"));
    throw error;
  }
}
