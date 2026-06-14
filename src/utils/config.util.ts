import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

export interface LlmConfig {
  provider: string;
  apiKey: string;
  baseUrl: string;
}

export interface WebSearchConfig {
  provider: string;
  apiKey: string;
}

export interface AppConfig {
  llm: LlmConfig;
  webSearch: WebSearchConfig;
}

const CONFIG_DIR = path.join(os.homedir(), ".config", "deep-research");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

export function getConfigPath(): string {
  return CONFIG_PATH;
}

export async function loadConfig(): Promise<AppConfig | null> {
  try {
    const data = await fs.readFile(CONFIG_PATH, "utf-8");
    return JSON.parse(data) as AppConfig;
  } catch {
    return null;
  }
}

export async function saveConfig(config: AppConfig): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export function applyConfig(config: AppConfig): void {
  process.env.OPENAI_API_KEY = config.llm.apiKey;
  process.env.OPENAI_API_BASE = config.llm.baseUrl;
  process.env.TAVILY_API_KEY = config.webSearch.apiKey;
}
