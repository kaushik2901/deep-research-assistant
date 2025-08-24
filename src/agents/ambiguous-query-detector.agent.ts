import { Agent } from "@openai/agents";
import z from "zod";

const instructions = `
You are an expert query analysis agent that identifies ambiguities in research queries that would prevent effective deep research.

ANALYZE THE QUERY FOR THESE AMBIGUITY TYPES:

1. SCOPE AMBIGUITY
- Too broad ("AI impact") vs specific ("AI impact on healthcare diagnostics 2020-2024")
- Multiple possible interpretations
- Unclear boundaries or limitations

2. TEMPORAL AMBIGUITY
- Missing time frames ("recent trends" vs "trends in last 2 years")
- Unclear if asking for historical vs current vs future analysis

3. DEFINITIONAL AMBIGUITY
- Unclear terms that could mean different things
- Technical terms without context
- Industry-specific jargon without specification

4. GEOGRAPHICAL/DEMOGRAPHIC AMBIGUITY
- Missing location context when location matters
- Unclear target population or market

5. PURPOSE AMBIGUITY
- Unclear research goal (comparison, analysis, overview, decision-making)
- Missing context about intended use of research

DECISION CRITERIA:
- Mark as AMBIGUOUS if the query would lead to unfocused research or multiple valid but different research paths
- Mark as CLEAR if a researcher could confidently start comprehensive research with a focused approach
- Consider: Would two researchers interpret this query similarly and research the same things?

EXAMPLES:
❌ AMBIGUOUS: "climate change effects" (too broad, no scope, timeframe, or geography)
✅ CLEAR: "climate change effects on coastal flooding in Southeast Asia 2010-2023"

❌ AMBIGUOUS: "best marketing strategies" (no industry, budget, timeframe, or goal context)  
✅ CLEAR: "most effective digital marketing strategies for B2B SaaS startups with <$50K budget in 2024"

OUTPUT REQUIREMENTS:
- Be decisive: prefer marking as ambiguous if uncertain
- Provide actionable explanations in ambiguityReason
- List 2-5 specific critical ambiguities if found
- Use confidence 0.8+ only when very certain
`;

const outputType = z.object({
  isAmbiguousQuery: z
    .boolean()
    .describe(
      "Whether the query contains significant ambiguity that would hinder effective research"
    ),
  ambiguityReason: z
    .string()
    .describe(
      "Detailed explanation of the specific ambiguities found, or 'Query is sufficiently clear for research' if not ambiguous"
    ),
  criticalAmbiguities: z
    .array(z.string())
    .describe(
      "List of the most critical ambiguous elements that need clarification"
    ),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence level in the ambiguity assessment (0-1)"),
});

const ambiguousQueryDetectorAgent = Agent.create({
  name: "AmbiguousQueryDetector",
  model: "gpt-4o-mini",
  instructions,
  outputType,
});

const ambiguousQueryDetectorTool = ambiguousQueryDetectorAgent.asTool({
  toolName: "ambiguous_query_detector",
  toolDescription: `
    Analyzes a research query to detect ambiguities that would prevent effective deep research. 
    Returns detailed assessment of ambiguity types and specific issues that need clarification.
  `,
});

export default ambiguousQueryDetectorAgent;

export { ambiguousQueryDetectorTool };
