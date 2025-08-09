export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  filename: string;
}

export interface SearchResult {
  document: SearchDocument;
  relevanceScore: number;
  keywordStats: KeywordStats;
  preview: string;
}

export interface KeywordStats {
  foundTerms: { [term: string]: number };
  missingTerms: string[];
}

export interface AutocompleteMatch {
  text: string;
  type: 'prefix' | 'partial';
  document: string;
}