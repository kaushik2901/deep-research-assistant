import searchExecutorAgent from "../agents/search-executor.agent";
import { AgentError } from "../errors";
import Search from "../types/search.type";
import { AgentRunner } from "./agent-runner";
import { runBatched } from "../utils/batch.util";

const BATCH_SIZE = 3;

export async function executeSearches(searches: Search[], runner: AgentRunner): Promise<string[]> {
  try {
    const results = await runBatched(searches, BATCH_SIZE, async (search) => {
      try {
        const response = await runner.run<string>(searchExecutorAgent, JSON.stringify(search));
        return response.finalOutput ?? "";
      } catch {
        return "";
      }
    });

    return results.filter((x) => !!x);
  } catch (error) {
    throw new AgentError(
      error instanceof Error ? error.message : "Search executor agent failed",
      "SearchExecutor"
    );
  }
}
