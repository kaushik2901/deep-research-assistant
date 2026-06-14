import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { generateSections } from "../services/report-sections.service";
import { withRetry } from "../utils/retry.util";
import { TableOfContentSection } from "../types/table-of-content.type";
import Section from "../types/section.type";

export default async function runReportSectionsGenerator(
  tableOfContents: TableOfContentSection[],
  searchResults: string[]
): Promise<Section[]> {
  const spinner = ora({
    text: chalk.gray("Generating sections..."),
    spinner: "clock",
  }).start();

  try {
    const sections = await withRetry(() =>
      generateSections(tableOfContents, searchResults, { run })
    );
    spinner.succeed(chalk.green("Sections generated successfully"));
    return sections;
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate sections"));
    throw error;
  }
}
