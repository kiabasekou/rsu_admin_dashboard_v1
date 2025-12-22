/**
 * 🇬🇦 RSU Gabon - Person Search Component FINAL
 * Standards Top 1% - Recherche Bénéficiaire avec Autocomplete
 * Fichier: rsu_admin_dashboard_v1/src/components/common/PersonSearch.jsx
 */

import React, { useState, useEffect } from 'react';
import { Search, X, User } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export default function PersonSearch({ onSelect, selectedPerson }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(() => {
      searchPersons();
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [query]);

  const searchPersons = async () => {
    setLoading(true);
    try {
      // ✅ apiClient retourne déjà .data automatiquement
      const response = await apiClient.get('/identity/persons/', {
        params: {
          search: query,
          page_size: 10
        }
      });
      // ✅ Pas de .data ici car apiClient l'a déjà fait
      setResults(response.results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (person) => {
    onSelect(person);
    setQuery('');
    setShowResults(false);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="person-search">
      {/* Selected Person Display */}
      {selectedPerson && (
        <div className="selected-person">
          <div className="person-info">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">
                {selectedPerson.first_name} {selectedPerson.last_name}
              </p>
              <p className="text-sm text-gray-500">
                ID: {selectedPerson.rsu_id || selectedPerson.id}
                {selectedPerson.province && ` • ${selectedPerson.province}`}
                {selectedPerson.vulnerability_score && 
                  ` • Score: ${selectedPerson.vulnerability_score}/100`
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="clear-btn"
            title="Changer de bénéficiaire"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      {!selectedPerson && (
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, prénom ou RSU ID..."
              className="search-input"
            />
            {loading && (
              <div className="spinner-small"></div>
            )}
          </div>

          {/* Results Dropdown */}
          {showResults && results.length > 0 && (
            <div className="results-dropdown">
              {results.map((person) => (
                <button
                  key={person.id}
                  onClick={() => handleSelect(person)}
                  className="result-item"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <div className="result-info">
                    <p className="result-name">
                      {person.first_name} {person.last_name}
                    </p>
                    <p className="result-meta">
                      {person.rsu_id || `ID: ${person.id}`}
                      {person.province && ` • ${person.province}`}
                      {person.vulnerability_score && 
                        ` • Score: ${person.vulnerability_score}/100`
                      }
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && query.length >= 2 && results.length === 0 && !loading && (
            <div className="no-results">
              Aucun bénéficiaire trouvé pour "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}