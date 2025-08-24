import { config } from "dotenv";
import readline from "readline";
import { AgentInputItem, run, assistant, user } from "@openai/agents";
import queryClarifierAgent from "./query-clarifier.agent";

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
    const result = await run(queryClarifierAgent, history, { stream: true });

    console.log("🤖 Assistant:");

    console.log("");

    for await (const event of result) {
      if (
        event.type === "raw_model_stream_event" &&
        event.data.type == "output_text_delta"
      ) {
        process.stdout.write(event.data.delta);
      }

      if (event.type !== "run_item_stream_event") {
        continue;
      }

      if (
        event.item.type === "tool_call_item" &&
        (event.item.rawItem as any).name === "ambiguous_query_detector"
      ) {
        console.log("Detecting ambiguous query..");
      } else if (
        event.item.type === "tool_call_item" &&
        (event.item.rawItem as any).name === "generate_clarification_questions"
      ) {
        console.log("Generating clarification questions..");
      }
      else {
        console.log(event.item.toJSON());        
      }
    }

    console.log("");

    const assistantMsg = result.finalOutput;
    history.push(assistant(assistantMsg!));

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
