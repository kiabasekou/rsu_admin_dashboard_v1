/**
 * 🇬🇦 RSU Gabon - Person Search Component FINAL
 * Standards Top 1% - Recherche Bénéficiaire avec Autocomplete
 * Fichier: rsu_admin_dashboard_v1/src/components/common/PersonSearch.jsx
 */
/**
 * 🇬🇦 RSU Gabon - Person Search Component (CORRIGÉ)
 * Standards Top 1% - Recherche Bénéficiaire avec Autocomplete
 * 
 * ✅ CORRECTION MAJEURE #2: Gestion Pagination DRF
 * ❌ AVANT: setResults(response.results || [])
 * ✅ APRÈS: const items = response?.results || (Array.isArray(response) ? response : [])
 * 
 * PROBLÈME RÉSOLU:
 * - API renvoie { count, results: [...] } mais le code tentait de mapper sur l'objet
 * - Erreur "map is not a function" car results.map() était appelé sur un objet
 * - Lecture défensive avec double fallback
 */

/**
 * 🇬🇦 RSU Gabon - Person Search Component CORRIGÉ
 * Standards Top 1% - Recherche qui FILTRE vraiment
 * 
 * ✅ CORRECTIONS:
 * - Logs console pour debug
 * - Vérification que search param est bien envoyé
 * - Gestion results.results vs results array
 * 
 * Fichier: src/components/common/PersonSearch.jsx
 */

import React, { useState, useEffect } from 'react';
import { Search, X, User } from 'lucide-react';
import apiClient from '../../services/api/apiClient';
import '../../styles/PersonSearch.css';

export default function PersonSearch({ onSelect, selectedPerson }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // ✅ Minimum 2 caractères pour chercher
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
    
    console.log('🔍 PersonSearch - Recherche lancée:', {
      query: query,
      queryLength: query.length
    });

    try {
      // ✅ CORRECTION: Envoyer le param "search" correctement
      const response = await apiClient.get('/identity/persons/', {
        params: {
          search: query,
          page_size: 10
        }
      });

      console.log('✅ PersonSearch - Réponse API:', {
        fullResponse: response,
        hasResults: !!response.results,
        isArray: Array.isArray(response),
        resultsCount: response.results ? response.results.length : (Array.isArray(response) ? response.length : 0)
      });

      // ✅ CORRECTION: Gérer les 2 formats de réponse possibles
      let persons = [];
      
      if (response.results && Array.isArray(response.results)) {
        // Format DRF pagination: { count, next, previous, results: [...] }
        persons = response.results;
        console.log('📊 Format pagination DRF détecté');
      } else if (Array.isArray(response)) {
        // Format array direct: [...]
        persons = response;
        console.log('📊 Format array direct détecté');
      } else {
        console.warn('⚠️ Format de réponse inattendu:', response);
        persons = [];
      }

      console.log(`📋 Résultats trouvés: ${persons.length} personnes`);
      persons.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.first_name} ${p.last_name} (${p.rsu_id || p.id})`);
      });

      setResults(persons);
      setShowResults(true);

    } catch (error) {
      console.error('❌ PersonSearch - Erreur:', error);
      console.error('   Message:', error.message);
      console.error('   Response:', error.response?.data);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (person) => {
    console.log('✅ Personne sélectionnée:', person);
    onSelect(person);
    setQuery('');
    setShowResults(false);
    setResults([]);
  };

  const handleClear = () => {
    console.log('🔄 Réinitialisation sélection');
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
                {selectedPerson.rsu_id || `ID: ${selectedPerson.id}`}
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