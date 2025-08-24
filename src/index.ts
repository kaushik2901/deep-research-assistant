import { config } from "dotenv";
import readline from "readline";
import { run } from "@openai/agents";
import queryBuilder from "./agents/query-builder.agent";
import ambiguityDetector from "./agents/ambiguous-query-detector.agent";
import searchPlanner from "./agents/search-planner.agent";
import searchExecutorAgent from "./agents/search-executor.agent";

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
    console.log("Query generation started..");

    const qbResponse = await run(queryBuilder, context.query);
    context.query = qbResponse.finalOutput ?? "";

    console.log("Query generation completed");

    console.log("Ambiguity detection started..");

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

  console.log("Ambiguity detection completed");

  console.log("Search planning started...");

  const spResponse = await run(searchPlanner, context.query);
  const searches = spResponse.finalOutput?.searches ?? [];

  console.log("Search planning completed");

  const seResponses = await Promise.all(
    searches.map((search) => run(searchExecutorAgent, JSON.stringify(search)))
  );
  const searchResults = seResponses
    .map((x) => x.finalOutput ?? "")
    .filter((x) => !!x);

  console.log(searchResults);

  rl.close();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  rl.close();
});
