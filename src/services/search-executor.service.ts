import searchExecutorAgent from "../agents/search-executor.agent";
import Search from "../types/search.type";
import { AgentRunner } from "./agent-runner";

export async function executeSearches(searches: Search[], runner: AgentRunner): Promise<string[]> {
  const response = await Promise.all(
    searches.map((search) => runner.run<string>(searchExecutorAgent, JSON.stringify(search)))
  );

  return response.map((x) => x.finalOutput ?? "").filter((x) => !!x);
}
