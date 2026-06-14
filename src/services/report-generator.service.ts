import TableOfContent from "../types/table-of-content.type";
import Reference from "../types/reference.type";
import Section from "../types/section.type";

export interface FileSystem {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
}

export function buildReportHtml(
  documentOutline: TableOfContent,
  sections: Section[],
  references: Reference[],
  template: string
): string {
  const tableOfContentHtml = documentOutline.tableOfContents
    .map((x) => `<li><a href="#${x.id}">${x.title}</a></li>`)
    .join("\n");

  const referencesHtml = references
    .map((x) => `<li>${x.title}<a href="${x.url}">${x.url}</a></li>`)
    .join("\n");

  const sectionsHtml = sections
    .map((x) => `<h2 id="${x.id}">${x.title}</h2>\n${x.html}`)
    .join("\n");

  return template
    .replace("##ReportTitle##", documentOutline.reportTitle)
    .replace("##ReportSummary##", documentOutline.reportSummary)
    .replace("##TableOfContents##", tableOfContentHtml)
    .replace("##Sections##", sectionsHtml)
    .replace("##References##", referencesHtml);
}

export function buildFilename(reportTitle: string, timestamp: Date): string {
  const ts = timestamp.toISOString().replace(/[:.]/g, "-").slice(0, -5);
  const slug = reportTitle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug}-${ts}.html`;
}
