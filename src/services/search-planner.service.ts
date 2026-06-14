import searchPlannerAgent from "../agents/search-planner.agent";
import Search from "../types/search.type";
import { AgentRunner } from "./agent-runner";

export async function planSearches(query: string, runner: AgentRunner): Promise<Search[]> {
  const response = await runner.run<{ searches: Search[] }>(searchPlannerAgent, query);
  return response.finalOutput?.searches ?? [];
}
