import Search from "./search.type";

export default interface Context {
  query: string;
  clarificationIterationCount: number;
  searches: Search[];
  searchResults: string[];
}