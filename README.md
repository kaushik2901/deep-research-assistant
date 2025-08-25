# Deep Research Assistant 🧠

An intelligent research assistant with ambiguity detection and clarification capabilities that automates comprehensive deep research workflows and generates professional research reports.

## Overview

The Deep Research Assistant is an advanced AI-powered tool that transforms vague or ambiguous research queries into comprehensive, well-structured research reports. It uses multiple specialized agents working in coordination to ensure high-quality research output while maintaining an intuitive user experience. The agent not only conducts research but also synthesizes findings into professional HTML reports with proper structure, references, and formatting.

## Current Status ✅

**Fully Implemented Features:**
- Complete multi-agent research workflow
- Ambiguity detection and resolution system
- Web search integration via Tavily API
- Strategic search planning and execution
- Professional HTML report generation
- Interactive CLI interface
- TypeScript implementation with full type safety

**Ready for Production Use:**
- All core functionality implemented and tested
- Professional report output with proper formatting
- Comprehensive error handling and user feedback
- Modular architecture for easy maintenance and extension

## Key Features

### 🔍 Intelligent Query Processing
- **Ambiguity Detection**: Automatically identifies unclear or ambiguous research queries
- **Contextual Clarification**: Generates targeted questions to refine research scope
- **Query Enhancement**: Builds comprehensive research directives with current context

### 🧠 Multi-Agent Architecture
- **Query Builder Agent**: Transforms user inputs into structured research queries
- **Ambiguity Detector Agent**: Identifies and classifies query ambiguities
- **Clarification Questions Generator**: Creates targeted questions to resolve ambiguities
- **Search Planner Agent**: Creates strategic search plans covering diverse perspectives
- **Search Executor Agent**: Gathers factual information from authoritative sources
- **Table of Contents Generator**: Creates structured document outlines
- **Report Sections Generator**: Generates detailed content for each section
- **References Generator**: Compiles comprehensive reference lists
- **Report Generator**: Synthesizes everything into professional HTML reports

### 📊 Complete Research Workflow
1. **Query Refinement**: Enhances initial queries with current context and clarity
2. **Ambiguity Resolution**: Iteratively clarifies ambiguous elements through targeted questions
3. **Strategic Planning**: Designs comprehensive search strategies covering multiple angles
4. **Parallel Execution**: Executes searches concurrently for efficiency
5. **Content Generation**: Creates structured document outlines and detailed sections
6. **Report Synthesis**: Generates professional HTML reports with proper formatting

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
                                │
                                ▼
                    ┌──────────────────────┐
                    │ Table of Contents    │
                    │      Generator       │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │ Report Sections      │
                    │     Generator        │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │ References Generator │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Report Generator    │
                    │  (HTML Output)       │
                    └──────────────────────┘
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Tavily API key (for web search capabilities)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/kaushik2901/deep-research-assistant.git
cd deep-research-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env and add your API keys:
# OPENAI_API_KEY=your_openai_api_key_here
# TAVILY_API_KEY=your_tavily_api_key_here
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

### Global Installation (Optional)
You can also install the agent globally to use it from anywhere:
```bash
npm install -g .
deep-research
```

### CLI Interface
The agent provides an interactive CLI interface that guides you through the complete research process:

1. Enter your research query
2. Answer clarification questions (if any)
3. Review the research strategy
4. Wait for research completion
5. Receive a professional HTML research report

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

### Table of Contents Generator
Creates structured document outlines:
- Organizes research findings into logical sections
- Ensures comprehensive coverage of the topic
- Provides clear navigation structure

### Report Sections Generator
Generates detailed content for each section:
- Synthesizes research findings into coherent narratives
- Maintains academic writing standards
- Ensures proper flow between sections

### References Generator
Compiles comprehensive reference lists:
- Extracts source information from search results
- Formats references according to standard citation styles
- Provides direct links to source materials

### Report Generator
Synthesizes all components into professional reports:
- Generates clean, formatted HTML output
- Includes proper styling and navigation
- Creates self-contained reports ready for sharing

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

**Output**: Professional HTML research report with:
- Executive summary and table of contents
- Detailed sections covering each research area
- Comprehensive references and source links
- Professional formatting and styling

## Output

The agent generates a complete research report saved as `report.html` in your project directory. The report includes:

- **Professional Styling**: Clean, academic formatting with proper typography
- **Navigation**: Clickable table of contents for easy navigation
- **Structured Content**: Well-organized sections with clear headings
- **References**: Complete source citations with direct links
- **Responsive Design**: Optimized for both screen and print viewing

## Project Structure

```
src/
├── agents/           # AI agent implementations
├── modules/          # Main workflow modules
├── tools/            # External tool integrations
├── types/            # TypeScript type definitions
├── templates/        # HTML report templates
├── utils/            # Utility functions
└── index.ts          # Main entry point
```

### Key Components

- **Agents**: Specialized AI agents for different research tasks
- **Modules**: Orchestrate the research workflow
- **Tools**: External integrations (web search, etc.)
- **Types**: Comprehensive type definitions for type safety
- **Templates**: HTML templates for report generation

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