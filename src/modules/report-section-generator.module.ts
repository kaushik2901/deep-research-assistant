import { run } from "@openai/agents";
import reportSectionGeneratorAgent from "../agents/report-section-generator.agent";

export default async function runReportSectionGenerator(
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
    throw error;
  }
}
