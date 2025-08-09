import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { AutocompleteMatch } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onAutocomplete: (input: string) => AutocompleteMatch[];
  className?: string;
  placeholder?: string;
  large?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onAutocomplete,
  className = '',
  placeholder = 'Search local documents...',
  large = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteMatch[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        const matches = onAutocomplete(query);
        setSuggestions(matches);
        setShowSuggestions(matches.length > 0);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, onAutocomplete]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        setQuery(suggestions[selectedIndex].text);
        setShowSuggestions(false);
        onSearch(suggestions[selectedIndex].text);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteMatch) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  const sizeClasses = large 
    ? 'h-14 text-lg px-6 pl-14' 
    : 'h-12 text-base px-4 pl-12';

  const iconSizeClasses = large 
    ? 'w-6 h-6 left-4' 
    : 'w-5 h-5 left-3.5';

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 ${iconSizeClasses}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full ${sizeClasses} border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white shadow-sm`}
        />
        {query && (
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            Search
          </button>
        )}
      </div>

      {showSuggestions && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.text}-${index}`}
              ref={el => suggestionRefs.current[index] = el}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0 ${
                selectedIndex === index 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{suggestion.text}</span>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    suggestion.type === 'prefix' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {suggestion.type === 'prefix' ? 'Prefix' : 'Partial'}
                  </span>
                  <span className="text-xs">{suggestion.document}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};