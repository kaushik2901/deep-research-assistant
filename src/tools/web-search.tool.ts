import { tool } from "@openai/agents";
import { tavily } from "@tavily/core";
import { z } from "zod";
import { SearchError, RateLimitError, NetworkError, TimeoutError } from "../errors";
import { withTimeout } from "../utils/timeout.util";

const TAVILY_TIMEOUT = 30_000;

const webSearchTool = tool({
  name: "web_search",
  description:
    "Search the web for current information, news, data, and insights on any topic. Returns comprehensive search results with summaries, URLs, and content from authoritative sources across the internet.",
  parameters: z.object({
    searchQuery: z
      .string()
      .describe(
        "The search query to find relevant information. Use specific, targeted terms for better results. Include timeframes (e.g., '2024', 'recent') when looking for current information."
      ),
  }),
  async execute({ searchQuery }) {
    try {
      return await withTimeout(
        async () => {
          const client = tavily({
            apiKey: process.env.TAVILY_API_KEY,
          });
          return await client.search(searchQuery);
        },
        TAVILY_TIMEOUT,
        "Tavily search"
      );
    } catch (error) {
      if (
        error instanceof RateLimitError ||
        error instanceof SearchError ||
        error instanceof NetworkError ||
        error instanceof TimeoutError
      ) {
        throw error;
      }

      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes("rate limit") ||
          msg.includes("429") ||
          msg.includes("too many requests")
        ) {
          throw new RateLimitError("Tavily rate limit exceeded");
        }
        if (
          msg.includes("econnrefused") ||
          msg.includes("econnreset") ||
          msg.includes("enotfound") ||
          msg.includes("etimedout") ||
          msg.includes("socket hang up")
        ) {
          throw new NetworkError(`Tavily network error: ${error.message}`, error);
        }
      }

      throw new SearchError(error instanceof Error ? error.message : "Tavily search failed");
    }
  },
});

export default webSearchTool;
