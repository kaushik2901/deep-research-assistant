import reportSectionGeneratorAgent from "../agents/report-section-generator.agent";
import { TableOfContentSection } from "../types/table-of-content.type";
import Section from "../types/section.type";
import { AgentRunner } from "./agent-runner";
import { runBatched } from "../utils/batch.util";

const BATCH_SIZE = 3;

async function generateSingleSection(
  title: string,
  summary: string,
  specialElements: string[],
  searchResults: string[],
  runner: AgentRunner
): Promise<string> {
  try {
    const response = await runner.run<{ html: string }>(
      reportSectionGeneratorAgent,
      JSON.stringify({ title, summary, specialElements, searchResults })
    );
    return response.finalOutput?.html ?? "";
  } catch {
    return "";
  }
}

export async function generateSections(
  tableOfContents: TableOfContentSection[],
  searchResults: string[],
  runner: AgentRunner
): Promise<Section[]> {
  const sections = await runBatched(
    tableOfContents,
    BATCH_SIZE,
    async ({ id, title, summary, specialElements }) => {
      const html = await generateSingleSection(
        title,
        summary,
        specialElements,
        searchResults,
        runner
      );
      return { id, title, html };
    }
  );
  return sections;
}
