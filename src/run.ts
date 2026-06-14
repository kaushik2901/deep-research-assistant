import Context from "./types/context.type";
import QuestionAnswer from "./types/question-answer.type";
import Ambiguity from "./types/ambiguity.type";
import Search from "./types/search.type";
import Reference from "./types/reference.type";
import Section from "./types/section.type";
import TableOfContent, { TableOfContentSection } from "./types/table-of-content.type";

export interface RunDeps {
  ask: (prompt: string) => Promise<string>;
  buildQuery: (query: string) => Promise<string>;
  detectAmbiguity: (query: string) => Promise<Ambiguity>;
  askClarificationQuestions: (ambiguity: Ambiguity) => Promise<QuestionAnswer[]>;
  rebuildAmbiguousQuery: (query: string, reason: string, answers: QuestionAnswer[]) => string;
  planSearches: (query: string) => Promise<Search[]>;
  executeSearches: (searches: Search[]) => Promise<string[]>;
  generateTableOfContent: (searchResults: string[]) => Promise<TableOfContent>;
  generateSections: (
    tableOfContents: TableOfContentSection[],
    searchResults: string[]
  ) => Promise<Section[]>;
  generateReferences: (searchResults: string[]) => Promise<Reference[]>;
  generateReport: (
    documentOutline: TableOfContent,
    sections: Section[],
    references: Reference[]
  ) => Promise<void>;
  onQueryBuilt?: (query: string) => void;
  onAmbiguityClear?: () => void;
  onMaxIterationsReached?: () => void;
  onClarificationCompleted?: (iteration: number) => void;
  onSearchPlanCreated?: (searches: Search[]) => void;
  onSearchResults?: (results: string[]) => void;
  onReportGenerated?: (filename: string) => void;
}

const MAX_CLARIFICATION_ITERATION = 2;

export async function runResearch(deps: RunDeps): Promise<void> {
  const context: Context = {
    query: "",
    clarificationIterationCount: 0,
    searches: [],
    searchResults: [],
  };

  context.query = await deps.ask("Enter your research query");

  while (true) {
    context.query = await deps.buildQuery(context.query);

    const ambiguity = await deps.detectAmbiguity(context.query);

    if (!ambiguity.isAmbiguousQuery) {
      deps.onAmbiguityClear?.();
      break;
    }

    if (context.clarificationIterationCount >= MAX_CLARIFICATION_ITERATION) {
      deps.onMaxIterationsReached?.();
      break;
    }

    const answers: QuestionAnswer[] = await deps.askClarificationQuestions(ambiguity);

    context.query = deps.rebuildAmbiguousQuery(context.query, ambiguity.ambiguityReason, answers);

    context.clarificationIterationCount++;
    deps.onClarificationCompleted?.(context.clarificationIterationCount);
  }

  context.searches = await deps.planSearches(context.query);
  deps.onSearchPlanCreated?.(context.searches);

  context.searchResults = await deps.executeSearches(context.searches);
  deps.onSearchResults?.(context.searchResults);

  const documentOutline = await deps.generateTableOfContent(context.searchResults);

  const sections = await deps.generateSections(
    documentOutline.tableOfContents,
    context.searchResults
  );

  const references = await deps.generateReferences(context.searchResults);

  await deps.generateReport(documentOutline, sections, references);
}
