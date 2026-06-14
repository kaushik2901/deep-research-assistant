import queryBuilderAgent from "../agents/query-builder.agent";
import { AgentError } from "../errors";
import { AgentRunner } from "./agent-runner";

export async function buildQuery(query: string, runner: AgentRunner): Promise<string> {
  try {
    const response = await runner.run<string>(queryBuilderAgent, query);
    return response.finalOutput ?? "";
  } catch (error) {
    throw new AgentError(
      error instanceof Error ? error.message : "Query builder agent failed",
      "QueryBuilder"
    );
  }
}
