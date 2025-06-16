import { Agent, handoff } from "@openai/agents";
import reportWriterAgent from "./report-writer.agent";

const searchExecutorAgent = Agent.create({
  name: "SearchExecutorAgent",
  model: "gpt-4o-mini",
  instructions: `Hand off to the next agent`,
  handoffs: [handoff(reportWriterAgent)],
});

export default searchExecutorAgent;
