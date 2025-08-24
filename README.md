# Deep Research Agent 🧠

An intelligent research agent with ambiguity detection and clarification capabilities that automates comprehensive deep research workflows.

## Overview

The Deep Research Agent is an advanced AI-powered tool that transforms vague or ambiguous research queries into comprehensive, well-structured research directives. It uses multiple specialized agents working in coordination to ensure high-quality research output while maintaining an intuitive user experience.

## Key Features

### 🔍 Intelligent Query Processing
- **Ambiguity Detection**: Automatically identifies unclear or ambiguous research queries
- **Contextual Clarification**: Generates targeted questions to refine research scope
- **Query Enhancement**: Builds comprehensive research directives with current context

### 🧠 Multi-Agent Architecture
- **Query Builder Agent**: Transforms user inputs into structured research queries
- **Ambiguity Detector Agent**: Identifies and classifies query ambiguities
- **Search Planner Agent**: Creates strategic search plans covering diverse perspectives
- **Search Executor Agent**: Gathers factual information from authoritative sources

### 📊 Research Process
1. **Query Refinement**: Enhances initial queries with current context and clarity
2. **Ambiguity Resolution**: Iteratively clarifies ambiguous elements through targeted questions
3. **Strategic Planning**: Designs comprehensive search strategies covering multiple angles
4. **Parallel Execution**: Executes searches concurrently for efficiency
5. *(Future)* **Report Generation**: Synthesizes findings into comprehensive reports

## Architecture

```
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   User Input    │───▶│   Query Builder      │───▶│ Ambiguity Detector   │
└─────────────────┘    └──────────────────────┘    └──────────────────────┘
                                │                           │
                                ▼                           ▼
                    ┌──────────────────────┐    ┌──────────────────────┐
                    │  Query Clarification │◀───│  Ambiguity Analysis  │
                    └──────────────────────┘    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │   Search Planner     │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │ Search Executor(s)   │
                    └──────────────────────┘
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd deep-research-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env and add your OpenAI API key
```

4. Build the project:
```bash
npm run build
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### CLI Interface
The agent provides an interactive CLI interface that guides you through the research process:

1. Enter your research query
2. Answer clarification questions (if any)
3. Review the research strategy
4. Wait for research completion

## Agent Details

### Query Builder Agent
Transforms user inputs into comprehensive research queries by:
- Performing immediate web searches for current context
- Building structured research directives with timeframes and focus areas
- Incorporating recent developments and trends

### Ambiguity Detector Agent
Analyzes queries for five types of ambiguities:
- **Scope Ambiguity**: Too broad or unclear boundaries
- **Temporal Ambiguity**: Missing or unclear timeframes
- **Definitional Ambiguity**: Unclear terms or jargon
- **Geographical/Demographic Ambiguity**: Missing location or population context
- **Purpose Ambiguity**: Unclear research goals or intended use

### Clarification Questions Generator
Creates targeted questions that resolve critical ambiguities while maintaining a smooth user experience:
- Prioritizes questions by impact on research quality
- Includes specific options or examples when helpful
- Uses conversational language for better user experience

### Search Planner Agent
Develops strategic search plans covering:
- Different aspects of the topic (no overlap)
- Various source types (news, academic, industry reports)
- Different time perspectives (recent, historical, future)
- Multiple viewpoints (industry, consumer, regulatory)

### Search Executor Agent
Executes searches and extracts factual information:
- Focuses on hard facts, statistics, and data
- Prioritizes recent, authoritative sources
- Outputs concise bullet points for easy synthesis

## Example Workflow

**User Input**: "AI impact on jobs"

**Clarification Questions**:
1. "What industry or job sector are you most interested in? (e.g., manufacturing, healthcare, customer service)"
2. "What timeframe are you interested in - recent impacts (2020-2024), historical analysis, or future projections?"
3. "Are you looking at this from a global perspective or a specific country/region?"

**Enhanced Query**: After user responses, creates a comprehensive research directive.

**Research Strategy**:
1. Recent statistics on AI adoption and job displacement (2022-2024)
2. Industry expert analysis on job transformation vs elimination
3. Government policies and workforce retraining initiatives
4. Economic impact studies on specific sectors
5. Future job market projections and emerging roles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please open an issue on the repository.