import { describe, it, expect } from "vitest";
import { buildReportHtml, buildFilename } from "../../services/report-generator.service";
import TableOfContent from "../../types/table-of-content.type";
import Section from "../../types/section.type";
import Reference from "../../types/reference.type";

const sampleTemplate = `<!DOCTYPE html>
<html>
<head><title>Research Report</title></head>
<body>
<h1>##ReportTitle##</h1>
<p>##ReportSummary##</p>
<ul>##TableOfContents##</ul>
<main>##Sections##</main>
<ol>##References##</ol>
</body>
</html>`;

describe("buildReportHtml", () => {
  it("replaces all placeholders correctly", () => {
    const outline: TableOfContent = {
      reportTitle: "Test Report",
      reportSummary: "A test summary",
      tableOfContents: [{ id: "sec1", title: "Section 1", summary: "S1", specialElements: [] }],
    };

    const sections: Section[] = [{ id: "sec1", title: "Section 1", html: "<p>Content</p>" }];

    const references: Reference[] = [{ title: "Ref 1", url: "https://example.com" }];

    const result = buildReportHtml(outline, sections, references, sampleTemplate);

    expect(result).toContain("Test Report");
    expect(result).toContain("A test summary");
    expect(result).toContain("Section 1");
    expect(result).toContain("<p>Content</p>");
    expect(result).toContain("Ref 1");
    expect(result).toContain("https://example.com");
    expect(result).not.toContain("##ReportTitle##");
    expect(result).not.toContain("##Sections##");
    expect(result).not.toContain("##References##");
  });

  it("handles empty sections and references", () => {
    const outline: TableOfContent = {
      reportTitle: "Empty Report",
      reportSummary: "No content",
      tableOfContents: [],
    };

    const result = buildReportHtml(outline, [], [], sampleTemplate);
    expect(result).toContain("Empty Report");
    expect(result).toContain("No content");
  });
});

describe("buildFilename", () => {
  it("creates filename with slug and timestamp", () => {
    const date = new Date("2025-08-25T10:56:05.000Z");
    const filename = buildFilename("AI Impact on Jobs", date);
    expect(filename).toMatch(/^ai-impact-on-jobs-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.html$/);
  });

  it("handles special characters in title", () => {
    const date = new Date("2025-01-01T00:00:00.000Z");
    const filename = buildFilename("Hello, World! @ Test", date);
    expect(filename).toMatch(/^hello-world-test-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.html$/);
  });
});
