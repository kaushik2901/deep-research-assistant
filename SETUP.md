# Deep Research Agent Setup Guide

## Issue Resolution: CLI Terminating Unexpectedly

The CLI was terminating after the first response due to missing environment variables. Here's how to fix it:

## 1. Environment Setup

Create a `.env` file in the root directory with your OpenAI API key:

```bash
# .env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

## 2. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## 3. Test Environment

Run this command to verify your environment is set up correctly:

```bash
npm run test-env
```

## 4. Run the CLI

Once your environment is configured, run:

```bash
npm run cli
```

## 5. Troubleshooting

If you still experience issues:

1. **Check API Key**: Ensure your OpenAI API key is valid and has credits
2. **Check Network**: Ensure you have internet access
3. **Check Permissions**: Ensure your API key has the necessary permissions
4. **Check Rate Limits**: OpenAI has rate limits that might cause issues

## 6. Alternative: Non-Streaming Mode

If streaming continues to cause issues, the CLI will automatically fall back to non-streaming mode.

## 7. Debug Mode

The CLI now includes debug logging to help identify where issues occur. Look for gray debug messages in the output.

## Common Error Messages

- `❌ Error: OPENAI_API_KEY environment variable is not set!` - Create a `.env` file
- `❌ Streaming error` - Check your API key and network connection
- `⚠️ Streaming failed, falling back to standard response...` - Normal fallback behavior

## Support

If you continue to experience issues, check the debug output for more specific error information.
