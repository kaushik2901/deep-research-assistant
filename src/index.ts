import { config as dotenvConfig } from "dotenv";
import chalk from "chalk";
import logSymbols from "log-symbols";
import { ConfigurationError } from "./errors";
import { parseArgs, printHelp, printVersion } from "./utils/args.util";
import { loadConfig, applyConfig } from "./utils/config.util";
import { runResearch } from "./run";
import ask from "./utils/ask.util";
import printBanner from "./utils/print-banner.util";
import { printGreen, printYellow } from "./utils/print.util";
import rebuildAmbiguousQuery from "./utils/rebuild-ambiguous-query.util";
import askClarificationQuestions from "./modules/ask-clarification-questions.module";
import runQueryBuilder from "./cli/query-builder.cli";
import runAmbiguityDetector from "./cli/ambiguity-detector.cli";
import runSearchPlanner from "./cli/search-planner.cli";
import runSearchExecutor from "./cli/search-executor.cli";
import runTableOfContentGenerator from "./cli/table-of-content.cli";
import runReportSectionsGenerator from "./cli/report-sections.cli";
import runReferencesGenerator from "./cli/references-generator.cli";
import runReportGenerator from "./cli/report-generator.cli";
import { runSetup } from "./cli/setup";
import Search from "./types/search.type";

dotenvConfig();

const args = parseArgs(process.argv);

if (args.help) {
  printHelp();
  process.exit(0);
}

if (args.version) {
  printVersion();
  process.exit(0);
}

async function main() {
  const config = await loadConfig();

  if (!config || args.setup) {
    const newConfig = await runSetup(config ?? undefined);
    applyConfig(newConfig);

    if (args.setup) {
      console.log(chalk.green("Setup complete! Run `deep-research` to start researching.\n"));
      return;
    }
  } else {
    applyConfig(config);
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new ConfigurationError(
      "OPENAI_API_KEY is not configured. Run `deep-research --setup` to configure."
    );
  }
  if (!process.env.TAVILY_API_KEY) {
    throw new ConfigurationError(
      "TAVILY_API_KEY is not configured. Run `deep-research --setup` to configure."
    );
  }

  printBanner();

  await runResearch({
    ask,
    buildQuery: runQueryBuilder,
    detectAmbiguity: runAmbiguityDetector,
    askClarificationQuestions,
    rebuildAmbiguousQuery,
    planSearches: runSearchPlanner,
    executeSearches: runSearchExecutor,
    generateTableOfContent: runTableOfContentGenerator,
    generateSections: runReportSectionsGenerator,
    generateReferences: runReferencesGenerator,
    generateReport: runReportGenerator,

    onAmbiguityClear: () => {
      printGreen(`${logSymbols.success} Query is clear and unambiguous. Proceeding to research...`);
    },
    onMaxIterationsReached: () => {
      printYellow(
        `${logSymbols.warning} Maximum clarification iterations reached. Proceeding with current query...`
      );
    },
    onClarificationCompleted: (iteration) => {
      printGreen(
        `\n${logSymbols.success} Clarification round ${iteration} completed. Refining query...\n`
      );
    },
    onSearchPlanCreated: (searches: Search[]) => {
      console.log(chalk.blue("\n\u{1F4CB} Research Strategy:"));
      searches.forEach((search, index) => {
        console.log(chalk.gray(`  ${index + 1}. ${search.query}`));
        console.log(chalk.gray(`     Reason: ${search.reason}\n`));
      });
    },
    onSearchResults: (results: string[]) => {
      console.log(chalk.blue("\n\u{1F4CA} Research Results Summary:"));
      console.log(chalk.gray(`  Found ${results.length} distinct result sets`));
      console.log(chalk.gray(`  Research data ready for synthesis`));
      console.log(chalk.green(`\n${logSymbols.success} Research process completed successfully!`));
    },
  });
}

main().catch((err) => {
  console.error(chalk.red("\u274C Error:"), err);
  process.exit(1);
});
