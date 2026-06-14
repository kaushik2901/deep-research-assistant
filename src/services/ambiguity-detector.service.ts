import ambiguousQueryDetectorAgent from "../agents/ambiguous-query-detector.agent";
import Ambiguity from "../types/ambiguity.type";
import { AgentRunner } from "./agent-runner";

export async function detectAmbiguity(query: string, runner: AgentRunner): Promise<Ambiguity> {
  const response = await runner.run<Ambiguity>(ambiguousQueryDetectorAgent, query);
  return (
    response.finalOutput ?? {
      isAmbiguousQuery: false,
      ambiguityReason: "",
      confidence: 0,
      criticalAmbiguities: [],
    }
  );
}
