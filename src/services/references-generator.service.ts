import referencesGeneratorAgent from "../agents/references-generator.agent";
import { AgentError } from "../errors";
import Reference from "../types/reference.type";
import { AgentRunner } from "./agent-runner";

export async function generateReferences(
  searchResults: string[],
  runner: AgentRunner
): Promise<Reference[]> {
  try {
    const response = await runner.run<{ references: Reference[] }>(
      referencesGeneratorAgent,
      JSON.stringify(searchResults)
    );
    return response.finalOutput?.references ?? [];
  } catch (error) {
    throw new AgentError(
      error instanceof Error ? error.message : "References generator agent failed",
      "ReferencesGenerator"
    );
  }
}
