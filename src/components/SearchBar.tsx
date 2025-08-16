import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { AutocompleteMatch } from "../types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onAutocomplete: (input: string) => Promise<string>;
  className?: string;
  placeholder?: string;
  large?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onAutocomplete,
  className = "",
  placeholder = "Search local documents...",
  large = false,
}) => {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     let prefix = query.split(" ")[-1];
  //     if (prefix.length > 0) {
  //       let matches = onAutocomplete(prefix.toLowerCase());

  //     }
  //     if (query.length >= 2) {
  //       const matches = onAutocomplete(query);
  //       setSuggestion(matches);
  //       setShowSuggestion(matches.length > 0);
  //       setSelectedIndex(-1);
  //     } else {
  //       setSuggestion([]);
  //       setShowSuggestion(false);
  //     }
  //   }, 150);

  //   return () => clearTimeout(timeoutId);
  // }, [query, onAutocomplete]);

  useEffect(() => {
    setSuggestion("");
    if (query) handleAutoSuggest(query);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestion(false);
    }
  };

  const handleAutoSuggest = async (query: string) => {
    let prefix = query.split(" ").slice(-1)[0];
    let rem = query.slice(0, -prefix.length);

    const match = await onAutocomplete(prefix);

    if (match) {
      setSuggestion(rem + match);
      setShowSuggestion(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let q = query.trim();
      if (showSuggestion && suggestion) {
        q = suggestion.trim();
      }
      if (q.trim()) {
        setQuery(q.trim());
        setShowSuggestion(false);
        onSearch(q.trim());
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (showSuggestion && suggestion) {
        setQuery(suggestion);
        setShowSuggestion(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestion.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestion(false);
    }
  };

  const sizeClasses = large
    ? "h-14 text-lg px-6 pl-14"
    : "h-12 text-base px-4 pl-12";

  const iconSizeClasses = large ? "w-6 h-6 left-4" : "w-5 h-5 left-3.5";

  return (
    <div className={`relative max-w-2xl mx-auto w-full ${className}`}>
      <div
        data-suggest={showSuggestion ? suggestion : ""}
        className={`relative ${sizeClasses} bg-white border-2 border-slate-300 rounded-xl focus-within:border-indigo-500 focus:outline-none transition-colors shadow-sm flex items-center search`}
      >
        <Search
          className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 ${iconSizeClasses}`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setShowSuggestion(false)}
          onFocus={() => setShowSuggestion(true)}
          placeholder={placeholder}
          className={`w-full focus:outline-none z-[5] relative bg-transparent`}
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
    </div>
  );
};
