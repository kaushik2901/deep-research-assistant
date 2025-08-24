import * as fs from "fs/promises";
import chalk from "chalk";
import ora from "ora";
import TableOfContent from "../types/table-of-content.type";
import Reference from "../types/reference.type";
import Section from "../types/section.type";

export default async function runReportGenerator(
  documentOutline: TableOfContent,
  sections: Section[],
  references: Reference[]
): Promise<void> {
  const spinner = ora({
    text: chalk.gray("Generating report..."),
    spinner: "clock",
  }).start();

  try {
    const reportTemplate = (
      await fs.readFile("./src/templates/report-template.html")
    ).toString();

    const tableOfContentTemplate = documentOutline.tableOfContents
      .map((x) => `<li><a href="#${x.id}">${x.title}</a></li>`)
      .join("\n");
    const referencesTemplate = references
      .map((x) => `<li>${x.title}<a href="${x.url}">${x.url}</a></li>`)
      .join("\n");
    const sectionsTemplate = sections
      .map((x) => `<h2 id="${x.id}">${x.title}</h2>\n${x.html}`)
      .join("\n");

    const report = reportTemplate
      .replace("##ReportTitle##", documentOutline.reportTitle)
      .replace("##ReportSummary##", documentOutline.reportSummary)
      .replace("##TableOfContents##", tableOfContentTemplate)
      .replace("##Sections##", sectionsTemplate)
      .replace("##References##", referencesTemplate);

    await fs.writeFile("./report.html", report);

    spinner.succeed(chalk.green("Report successfully"));
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate report"));
    throw error;
  }
}
