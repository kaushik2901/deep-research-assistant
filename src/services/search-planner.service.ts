import searchPlannerAgent from "../agents/search-planner.agent";
import { AgentError } from "../errors";
import Search from "../types/search.type";
import { AgentRunner } from "./agent-runner";

export async function planSearches(query: string, runner: AgentRunner): Promise<Search[]> {
  try {
    const response = await runner.run<{ searches: Search[] }>(searchPlannerAgent, query);
    return response.finalOutput?.searches ?? [];
  } catch (error) {
    throw new AgentError(
      error instanceof Error ? error.message : "Search planner agent failed",
      "SearchPlanner"
    );
  }
}
