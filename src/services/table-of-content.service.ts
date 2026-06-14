import tableOfContentGeneratorAgent from "../agents/table-of-content-generator.agent";
import { AgentError } from "../errors";
import TableOfContent from "../types/table-of-content.type";
import { AgentRunner } from "./agent-runner";

export async function generateTableOfContent(
  searchResults: string[],
  runner: AgentRunner
): Promise<TableOfContent> {
  try {
    const response = await runner.run<TableOfContent>(
      tableOfContentGeneratorAgent,
      JSON.stringify(searchResults)
    );
    return (
      response.finalOutput ?? {
        reportTitle: "",
        reportSummary: "",
        tableOfContents: [],
      }
    );
  } catch (error) {
    throw new AgentError(
      error instanceof Error ? error.message : "Table of content generator agent failed",
      "TableOfContentGenerator"
    );
  }
}
