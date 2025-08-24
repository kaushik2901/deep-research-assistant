# Setup Guide

This guide will help you set up the Deep Research Agent on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (usually comes with Node.js) or yarn
- Git (optional, but recommended)

## Step 1: Get an OpenAI API Key

1. Visit [OpenAI's platform](https://platform.openai.com/)
2. Sign up for an account or log in if you already have one
3. Navigate to the API keys section
4. Create a new API key
5. Save this key securely - you'll need it in the next step

## Step 2: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/your-username/deep-research-agent.git
cd deep-research-agent
```

If you don't have Git installed, you can download the repository as a ZIP file and extract it.

## Step 3: Install Dependencies

Install the required packages:

```bash
npm install
```

Or if you're using yarn:

```bash
yarn install
```

## Step 4: Configure Environment Variables

Create a `.env` file from the example:

```bash
cp env.example .env
```

Open the `.env` file in a text editor and add your OpenAI API key:

```
OPENAI_API_KEY=your_actual_api_key_here
```

Optional: Add your OpenAI organization ID if you have one:

```
OPENAI_ORG_ID=your_org_id_here
```

## Step 5: Build the Project

Compile the TypeScript code:

```bash
npm run build
```

## Step 6: Run the Agent

You can now run the agent in two modes:

### Development Mode
```bash
npm run dev
```

This mode automatically restarts when you make code changes and shows detailed logs.

### Production Mode
```bash
npm start
```

This runs the compiled version of the agent.

## First Run

When you first run the agent, you'll be greeted with a professional CLI interface:

1. Enter your research query when prompted
2. Answer any clarification questions (if your query was ambiguous)
3. Review the research strategy that the agent generates
4. Wait for the research process to complete

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY is missing"**: Make sure you've added your API key to the `.env` file
2. **"Node.js version not supported"**: Update to Node.js 16 or higher
3. **"Command not found"**: Make sure you're in the project directory and have run `npm install`

### Getting Help

If you encounter any issues not covered here:
1. Check the [GitHub Issues](https://github.com/your-username/deep-research-agent/issues) page
2. Create a new issue if your problem hasn't been reported
3. Include detailed information about your environment and the error you're seeing