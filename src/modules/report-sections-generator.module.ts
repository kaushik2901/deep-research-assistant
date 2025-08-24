import { run } from "@openai/agents";
import reportSectionGeneratorAgent from "../agents/report-section-generator.agent";
import ora from "ora";
import chalk from "chalk";
import { TableOfContentSection } from "../types/table-of-content.type";
import Section from "../types/section.type";

async function runReportSectionGenerator(
  title: string,
  summary: string,
  specialElements: string[],
  searchResults: string[]
): Promise<string> {
  try {
    const response = await run(
      reportSectionGeneratorAgent,
      JSON.stringify({
        title,
        summary,
        specialElements,
        searchResults,
      })
    );
    return response.finalOutput?.html ?? "";
  } catch (error) {
    return "";
  }
}

export default async function runReportSectionsGenerator(
  tableOfContents: TableOfContentSection[],
  searchResults: string[]
): Promise<Section[]> {
  const spinner = ora({
    text: chalk.gray("Generating sections..."),
    spinner: "clock",
  }).start();

  try {
    const sections = await Promise.all(
      tableOfContents.map(async ({ id, title, summary, specialElements }) => {
        const html = await runReportSectionGenerator(
          title,
          summary,
          specialElements,
          searchResults
        );
        return {
          id,
          title,
          html,
        };
      })
    );

    spinner.succeed(chalk.green("Sections generated successfully"));
    return sections;
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate sections"));
    throw error;
  }
}
