import { tool } from "@openai/agents";
import { tavily } from "@tavily/core";
import { z } from "zod";

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
    const client = tavily({
      apiKey: process.env.TAVILY_API_KEY,
    });
    const searchResult = await client.search(searchQuery);
    return searchResult;
  },
});

export default webSearchTool;
