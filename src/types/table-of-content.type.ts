export interface TableOfContentSection {
  id: string;
  title: string;
  summary: string;
  specialElements: string[];
}

export default interface TableOfContent {
  reportTitle: string;
  reportSummary: string;
  tableOfContents: TableOfContentSection[];
}
