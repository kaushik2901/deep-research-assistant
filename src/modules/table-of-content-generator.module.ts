import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import tableOfContentGeneratorAgent from "../agents/table-of-content-generator.agent";
import TableOfContent from "../types/table-of-content.type";

export default async function runTableOfContentGenerator(
  searchResults: string[]
): Promise<TableOfContent> {
  const spinner = ora({
    text: chalk.gray("Generating table of content..."),
    spinner: "clock",
  }).start();

  try {
    const response = await run(
      tableOfContentGeneratorAgent,
      JSON.stringify(searchResults)
    );
    spinner.succeed(chalk.green("Table of content generated successfully"));
    return (
      response.finalOutput ?? {
        reportTitle: "",
        reportSummary: "",
        tableOfContents: [],
      }
    );
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate table of content"));
    throw error;
  }
}
