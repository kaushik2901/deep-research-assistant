import referencesGeneratorAgent from "../agents/references-generator.agent";
import Reference from "../types/reference.type";
import { AgentRunner } from "./agent-runner";

export async function generateReferences(
  searchResults: string[],
  runner: AgentRunner
): Promise<Reference[]> {
  const response = await runner.run<{ references: Reference[] }>(
    referencesGeneratorAgent,
    JSON.stringify(searchResults)
  );
  return response.finalOutput?.references ?? [];
}
