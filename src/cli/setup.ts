import chalk from "chalk";
import ask from "../utils/ask.util";
import { AppConfig, saveConfig, getConfigPath } from "../utils/config.util";

const LLM_CHOICES = ["openai", "openai-compatible (any OpenAI API-compatible provider)"];

function parseProviderChoice(input: string): string {
  return input.startsWith("openai-compatible") ? "openai-compatible" : "openai";
}

export async function runSetup(config?: AppConfig): Promise<AppConfig> {
  console.log(chalk.bold.blue("\n\u2699\uFE0F  Deep Research Assistant - Setup\n"));
  console.log(chalk.gray("This will configure your LLM and web search providers.\n"));

  let llmProvider: string;
  let baseUrl: string;
  let llmApiKey: string;

  if (config?.llm) {
    console.log(chalk.gray("LLM Provider:"));
    console.log(chalk.gray(`  Current: ${config.llm.provider}`));
    if (config.llm.baseUrl) {
      console.log(chalk.gray(`  Base URL: ${config.llm.baseUrl}`));
    }
    console.log(chalk.gray(`  API Key: ${maskKey(config.llm.apiKey)}`));

    const changeLlm = await ask("Change LLM configuration? (y/N)");
    if (changeLlm.toLowerCase() !== "y") {
      llmProvider = config.llm.provider;
      baseUrl = config.llm.baseUrl;
      llmApiKey = config.llm.apiKey;
    } else {
      const result = await promptLlm();
      llmProvider = result.provider;
      baseUrl = result.baseUrl;
      llmApiKey = result.apiKey;
    }
  } else {
    const result = await promptLlm();
    llmProvider = result.provider;
    baseUrl = result.baseUrl;
    llmApiKey = result.apiKey;
  }

  let searchProvider: string;
  let searchApiKey: string;

  if (config?.webSearch) {
    console.log(chalk.gray("\nWeb Search Provider:"));
    console.log(chalk.gray(`  Current: ${config.webSearch.provider}`));
    console.log(chalk.gray(`  API Key: ${maskKey(config.webSearch.apiKey)}`));

    const changeSearch = await ask("Change web search configuration? (y/N)");
    if (changeSearch.toLowerCase() !== "y") {
      searchProvider = config.webSearch.provider;
      searchApiKey = config.webSearch.apiKey;
    } else {
      const result = await promptWebSearch();
      searchProvider = result.provider;
      searchApiKey = result.apiKey;
    }
  } else {
    const result = await promptWebSearch();
    searchProvider = result.provider;
    searchApiKey = result.apiKey;
  }

  const newConfig: AppConfig = {
    llm: { provider: llmProvider, apiKey: llmApiKey, baseUrl },
    webSearch: { provider: searchProvider, apiKey: searchApiKey },
  };

  await saveConfig(newConfig);
  console.log(chalk.green(`\n\u2705 Configuration saved to ${getConfigPath()}\n`));

  return newConfig;
}

async function promptLlm(): Promise<{ provider: string; baseUrl: string; apiKey: string }> {
  const rawChoice = await ask(`Choose LLM provider (${LLM_CHOICES.join(" / ")}):`);
  const provider = parseProviderChoice(rawChoice);

  const baseUrl =
    provider === "openai-compatible"
      ? await ask("Enter your OpenAI-compatible API base URL:")
      : "https://api.openai.com/v1";

  const apiKey = await ask(`Enter your ${provider === "openai" ? "OpenAI" : ""} API key:`);

  return { provider, baseUrl, apiKey };
}

async function promptWebSearch(): Promise<{ provider: string; apiKey: string }> {
  const provider = "tavily";
  const apiKey = await ask("Enter your Tavily API key:");
  return { provider, apiKey };
}

function maskKey(key: string): string {
  if (key.length <= 8) return "********";
  return key.slice(0, 4) + "****" + key.slice(-4);
}
