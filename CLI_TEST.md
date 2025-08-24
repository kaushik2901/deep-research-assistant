# Deep Research Agent CLI Test

This document describes how to test the CLI interface of the Deep Research Agent.

## Prerequisites

1. Ensure you have set up your `.env` file with valid API keys:
   - OpenAI API key (required for AI processing)
   - Tavily API key (required for web search functionality)
2. Make sure the project has been built successfully with `npm run build`

## Test Commands

### 1. Run in Development Mode
```bash
npm run dev
```

When prompted, enter a research query like:
> "Impact of AI on healthcare diagnostics"

Observe:
- Professional banner and styling
- Color-coded progress indicators
- Structured question prompts
- Clear status updates
- Results summary

### 2. Run in Production Mode
```bash
npm start
```

Follow the same steps as above to verify the production build works correctly.

## Expected Behavior

1. **Startup**: The application should display a professional banner with ASCII art
2. **Query Input**: User should be prompted with a clear, blue-colored input prompt
3. **Processing**: Progress spinners should indicate each phase of processing
4. **Clarification**: If the query is ambiguous, targeted questions should be presented
5. **Research Planning**: A summary of the search strategy should be displayed
6. **Execution**: Progress indicators should show parallel search execution
7. **Completion**: A summary of results should be displayed with next steps

## Troubleshooting

If the CLI doesn't start:
1. Verify your API keys are correctly set in `.env`:
   - Check that `OPENAI_API_KEY` is set
   - Check that `TAVILY_API_KEY` is set
2. Check that all dependencies are installed with `npm install`
3. Ensure the project builds correctly with `npm run build`

If the styling appears incorrect:
1. Verify chalk is properly installed as a dependency
2. Check that your terminal supports ANSI color codes