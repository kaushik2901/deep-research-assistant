import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import { generateSections } from "../services/report-sections.service";
import { withRetry } from "../utils/retry.util";
import { withTimeout } from "../utils/timeout.util";
import { TableOfContentSection } from "../types/table-of-content.type";
import Section from "../types/section.type";

const AGENT_TIMEOUT = 120_000;

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
      withTimeout(
        () => generateSections(tableOfContents, searchResults, { run }),
        AGENT_TIMEOUT,
        "Report sections"
      )
    );
    spinner.succeed(chalk.green("Sections generated successfully"));
    return sections;
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate sections"));
    throw error;
  }
}
