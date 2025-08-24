import { run } from "@openai/agents";
import chalk from "chalk";
import ora from "ora";
import ambiguousQueryDetectorAgent from "../agents/ambiguous-query-detector.agent";
import Ambiguity from "../types/ambiguity.type";

export default async function runAmbiguityDetector(
  query: string
): Promise<Ambiguity> {
  const spinner = ora({
    text: chalk.gray("Detecting ambiguities..."),
    spinner: "clock",
  }).start();

  try {
    const response = await run(ambiguousQueryDetectorAgent, query);
    spinner.succeed(chalk.green("Ambiguity detection completed"));
    return (
      response.finalOutput ?? {
        isAmbiguousQuery: false,
        ambiguityReason: "",
        confidence: 0,
        criticalAmbiguities: [],
      }
    );
  } catch (error) {
    spinner.fail(chalk.red("Failed during ambiguity detection"));
    throw error;
  }
}
