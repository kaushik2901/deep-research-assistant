import { Agent, handoff } from "@openai/agents";
import searchExecutorAgent from "./search-executor.agent";

const researchAgent = Agent.create({
  name: "ResearchAgent",
  model: "gpt-4o-mini",
  instructions: `Hand off to the next agent`,
  handoffs: [handoff(searchExecutorAgent)],
});

export default researchAgent;
