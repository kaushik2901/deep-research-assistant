import * as fs from "fs/promises";
import * as path from "path";
import chalk from "chalk";
import ora from "ora";
import TableOfContent from "../types/table-of-content.type";
import Reference from "../types/reference.type";
import Section from "../types/section.type";
import { buildReportHtml, buildFilename } from "../services/report-generator.service";

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
    const templatePath = path.resolve(__dirname, "../templates/report-template.html");
    const template = (await fs.readFile(templatePath)).toString();

    const report = buildReportHtml(documentOutline, sections, references, template);
    const filename = buildFilename(documentOutline.reportTitle, new Date());

    await fs.writeFile(filename, report);

    spinner.succeed(chalk.green(`Report generated successfully: ${filename}`));
  } catch (error) {
    spinner.fail(chalk.red("Failed to generate report"));
    throw error;
  }
}
