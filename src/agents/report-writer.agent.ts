import { Agent } from "@openai/agents";

const reportWriterAgent = Agent.create({
  name: "ReportWriterAgent",
  model: "gpt-4o-mini",
  instructions: ``,
  handoffs: [],
});

export default reportWriterAgent;
