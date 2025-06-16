import { config } from "dotenv";
import readline from "readline";
import { AgentInputItem, run, assistant, user } from "@openai/agents";
import queryClarifierAgent from "./agents/query-clarifier.agent";

config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt: string): Promise<string> {
  return new Promise((res) => rl.question(`👤 ${prompt}\n> `, res));
}

async function main() {
  const history: AgentInputItem[] = [];

  // initial user prompt
  const initial = await ask("Enter your research query");
  history.push({ role: "user", content: initial });

  while (true) {
    // run agent with conversation history
    const result = await run(queryClarifierAgent, history);

    const assistantMsg = result.finalOutput;
    history.push(assistant(assistantMsg!));

    // if agent produced a final answer
    console.log("🤖 Assistant:");
    console.log(result.finalOutput);

    // else, it should have asked a question
    const reply = await ask("You:");

    if (reply.toLocaleLowerCase() === "exit") {
      break;
    }

    history.push(user(reply));
  }

  rl.close();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  rl.close();
});
