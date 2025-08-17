import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { DocumentView } from './components/DocumentView';
import { AnimatedText } from './components/AnimatedText';
import { SearchEngine } from './utils/searchEngine';
import { documents } from './data/documents';
import { SearchResult, AutocompleteMatch } from './types';

type AppState = 'landing' | 'results' | 'document';

const searchEngine = new SearchEngine(documents);

const animatedPhrases = [
  "Search through MetaSeek's documents search engine instantly.",
  "Smart autocomplete for faster results.",
  "Highlight and navigate through your matches."
];

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentDocument, setCurrentDocument] = useState<string>('');
  const [searchTerms, setSearchTerms] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    const results = searchEngine.search(query);
    setSearchResults(results);
    setCurrentQuery(query);
    setSearchTerms(query.toLowerCase().split(/\s+/).filter(term => term.length > 0));
    setState('results');
  };

  const handleAutocomplete = (input: string): AutocompleteMatch[] => {
    return searchEngine.getAutocomplete(input);
  };

  const handleViewDocument = (documentId: string, query: string) => {
    setCurrentDocument(documentId);
    setCurrentQuery(query);
    setSearchTerms(query.toLowerCase().split(/\s+/).filter(term => term.length > 0));
    setState('document');
  };

  const handleBackToLanding = () => {
    setState('landing');
    setCurrentQuery('');
    setSearchResults([]);
    setCurrentDocument('');
    setSearchTerms([]);
  };

  const handleBackToResults = () => {
    setState('results');
  };

  if (state === 'results') {
    return (
      <SearchResults
        results={searchResults}
        query={currentQuery}
        onBack={handleBackToLanding}
        onViewDocument={handleViewDocument}
      />
    );
  }

  if (state === 'document') {
    const document = searchEngine.getDocument(currentDocument);
    if (!document) {
      return <div>Document not found</div>;
    }

    return (
      <DocumentView
        document={document}
        searchTerms={searchTerms}
        onBack={handleBackToResults}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="flex flex-col justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto w-full text-center">
          {/* Logo/Title */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-slate-800 mb-4">
              Local Search
            </h1>
            <p className="text-xl text-slate-600">
              Discover information in your local documents
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            onAutocomplete={handleAutocomplete}
            className="mb-12"
            large={true}
          />

          {/* Animated Features */}
          <div className="mb-16">
            <AnimatedText phrases={animatedPhrases} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{documents.length}</div>
              <div className="text-slate-600">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-slate-600">Offline</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0ms</div>
              <div className="text-slate-600">Load Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;