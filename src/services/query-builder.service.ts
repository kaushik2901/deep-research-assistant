import queryBuilderAgent from "../agents/query-builder.agent";
import { AgentRunner } from "./agent-runner";

export async function buildQuery(query: string, runner: AgentRunner): Promise<string> {
  const response = await runner.run<string>(queryBuilderAgent, query);
  return response.finalOutput ?? "";
}
