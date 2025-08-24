import { config } from "dotenv";
import readline from "readline";
import { run } from "@openai/agents";
import queryBuilder from "./agents/query-builder.agent";
import ambiguityDetector from "./agents/ambiguous-query-detector.agent";
import searchPlanner from "./agents/search-planner.agent";

config();

const MAX_CLARIFICATION_ITERATION = 2;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt: string): Promise<string> {
  return new Promise((res) => rl.question(`👤 ${prompt}\n> `, res));
}

async function main() {
  const context = {
    query: "",
    iterationCount: 0,
  };

  const userInput = await ask("Enter your research query");
  context.query = userInput;

  while (true) {
    const qbResponse = await run(queryBuilder, context.query);
    context.query = qbResponse.finalOutput ?? "";

    const adResponse = await run(ambiguityDetector, context.query);
    const ambiguity = adResponse.finalOutput;
    if (!ambiguity || !ambiguity?.isAmbiguousQuery) {
      break;
    }

    if (context.iterationCount < MAX_CLARIFICATION_ITERATION) {
      break;
    }

    const answers = [];
    for (const question of ambiguity.criticalAmbiguities) {
      const answer = await ask(`${question}`);
      answers.push({ question, answer });
    }

    const reason = ambiguity?.ambiguityReason;
    context.query = `
        {
            "query": "${context.query}", 
            "ambiguityReason": "${reason}", 
            "questionAnswers": "${JSON.stringify(answers)}"
        }
    `;

    context.iterationCount++;
  }

  const spResponse = await run(searchPlanner, context.query);
  for (const item of spResponse.finalOutput?.searches ?? []) {
    console.log(item.reason, item.query);
  }

  rl.close();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  rl.close();
});
