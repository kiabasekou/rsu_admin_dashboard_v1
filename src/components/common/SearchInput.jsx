/**
 * 🇬🇦 RSU Gabon - Search Input with Debounce
 * Standards Top 1% - Performance Optimisée
 */
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchInput({
  placeholder = 'Rechercher...',
  onSearch,
  debounceDelay = 500,
  className = '',
}) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceDelay);

  // Déclencher recherche quand debouncedQuery change
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all
        "
      />

      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Effacer"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}