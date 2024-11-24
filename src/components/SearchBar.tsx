import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="group relative flex items-center transition-all duration-300">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full rounded-xl bg-white/20 px-6 py-3 pl-12 text-lg text-white placeholder-white/70 backdrop-blur-md outline-none ring-2 ring-white/20 transition-all duration-300 focus:ring-white/50 group-hover:bg-white/30"
        />
        <Search className="absolute left-4 h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110" />
        <button
          type="submit"
          className="absolute right-3 rounded-lg bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  );
}