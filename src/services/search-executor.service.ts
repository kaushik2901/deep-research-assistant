import searchExecutorAgent from "../agents/search-executor.agent";
import { AgentError } from "../errors";
import Search from "../types/search.type";
import { AgentRunner } from "./agent-runner";

export async function executeSearches(searches: Search[], runner: AgentRunner): Promise<string[]> {
  try {
    const response = await Promise.all(
      searches.map((search) => runner.run<string>(searchExecutorAgent, JSON.stringify(search)))
    );

    return response.map((x) => x.finalOutput ?? "").filter((x) => !!x);
  } catch (error) {
    throw new AgentError(
      error instanceof Error ? error.message : "Search executor agent failed",
      "SearchExecutor"
    );
  }
}
