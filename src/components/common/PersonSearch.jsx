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

import React, { useState, useEffect } from 'react';
import { Search, X, User } from 'lucide-react';
import apiClient from '../../services/api/apiClient';
import '../../styles/PersonSearch.css';

export default function PersonSearch({ onSelect, selectedPerson }) {
  // ==================== ÉTATS ====================
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // ==================== EFFET: RECHERCHE AVEC DEBOUNCE ====================
  
  useEffect(() => {
    // 🛡️ GUARD: Recherche minimum 2 caractères
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // ⏱️ DEBOUNCE: Attendre 300ms avant de rechercher
    const timer = setTimeout(() => {
      searchPersons();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // ==================== FONCTION: RECHERCHE ====================
  
  /**
   * ✅ CORRECTION: Lecture défensive de la réponse paginée
   */
  const searchPersons = async () => {
    setLoading(true);
    
    try {
      console.log(`🔍 Searching persons: "${query}"`);
      
      // 📡 API CALL: apiClient retourne déjà response.data
      const response = await apiClient.get('/identity/persons/', {
        params: {
          search: query,
          page_size: 10
        }
      });

      // 🛡️ DEFENSIVE READING: Gérer les 2 formats possibles
      // Format 1 (DRF): { count: X, results: [...] }
      // Format 2 (Direct): [...]
      const items = response?.results || (Array.isArray(response) ? response : []);

      console.log(`✅ Found ${items.length} results`);
      
      setResults(items);
      setShowResults(true);
      
    } catch (error) {
      console.error('❌ Search error:', error);
      
      // 🛡️ FALLBACK: Tableau vide en cas d'erreur
      setResults([]);
      
      // ⚠️ OPTIONNEL: Afficher un message d'erreur à l'utilisateur
      // Vous pouvez ajouter un toast ici si nécessaire
      
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLERS ====================
  
  /**
   * Sélectionner une personne
   */
  const handleSelect = (person) => {
    console.log('✅ Person selected:', person.id);
    onSelect(person);
    setQuery('');
    setShowResults(false);
  };

  /**
   * Effacer la sélection
   */
  const handleClear = () => {
    console.log('🔄 Clearing selection');
    onSelect(null);
    setQuery('');
    setResults([]);
  };

  // ==================== RENDER ====================
  
  return (
    <div className="person-search">
      {/* ==================== PERSONNE SÉLECTIONNÉE ==================== */}
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
                {/* ✅ PROTECTION: Optional chaining + fallback pour score */}
                {selectedPerson.vulnerability_score != null && 
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

      {/* ==================== CHAMP DE RECHERCHE ==================== */}
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

          {/* ==================== RÉSULTATS DROPDOWN ==================== */}
          {/* ✅ PROTECTION: Vérifier que results est un tableau avant map */}
          {showResults && Array.isArray(results) && results.length > 0 && (
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
                      {/* ✅ PROTECTION: Optional chaining + null check */}
                      {person.vulnerability_score != null && 
                        ` • Score: ${person.vulnerability_score}/100`
                      }
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ==================== AUCUN RÉSULTAT ==================== */}
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

// ==================== STYLES (À AJOUTER DANS LE CSS) ====================

/**
 * 🎨 STYLES RECOMMANDÉS:
 * 
 * .person-search {
 *   position: relative;
 *   width: 100%;
 * }
 * 
 * .selected-person {
 *   display: flex;
 *   align-items: center;
 *   justify-content: space-between;
 *   padding: 12px 16px;
 *   background: #f3f4f6;
 *   border-radius: 8px;
 * }
 * 
 * .person-info {
 *   display: flex;
 *   align-items: center;
 *   gap: 12px;
 * }
 * 
 * .clear-btn {
 *   padding: 6px;
 *   border-radius: 4px;
 *   transition: background 0.2s;
 * }
 * 
 * .clear-btn:hover {
 *   background: #e5e7eb;
 * }
 * 
 * .search-container {
 *   position: relative;
 * }
 * 
 * .search-input-wrapper {
 *   position: relative;
 *   display: flex;
 *   align-items: center;
 * }
 * 
 * .search-icon {
 *   position: absolute;
 *   left: 12px;
 *   width: 20px;
 *   height: 20px;
 *   color: #9ca3af;
 * }
 * 
 * .search-input {
 *   width: 100%;
 *   padding: 10px 40px 10px 44px;
 *   border: 1px solid #d1d5db;
 *   border-radius: 8px;
 *   font-size: 14px;
 * }
 * 
 * .search-input:focus {
 *   outline: none;
 *   border-color: #3b82f6;
 *   box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
 * }
 * 
 * .spinner-small {
 *   position: absolute;
 *   right: 12px;
 *   width: 16px;
 *   height: 16px;
 *   border: 2px solid #e5e7eb;
 *   border-top-color: #3b82f6;
 *   border-radius: 50%;
 *   animation: spin 0.6s linear infinite;
 * }
 * 
 * @keyframes spin {
 *   to { transform: rotate(360deg); }
 * }
 * 
 * .results-dropdown {
 *   position: absolute;
 *   top: calc(100% + 4px);
 *   left: 0;
 *   right: 0;
 *   max-height: 300px;
 *   overflow-y: auto;
 *   background: white;
 *   border: 1px solid #d1d5db;
 *   border-radius: 8px;
 *   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
 *   z-index: 50;
 * }
 * 
 * .result-item {
 *   width: 100%;
 *   display: flex;
 *   align-items: center;
 *   gap: 12px;
 *   padding: 12px 16px;
 *   text-align: left;
 *   border-bottom: 1px solid #f3f4f6;
 *   transition: background 0.15s;
 * }
 * 
 * .result-item:hover {
 *   background: #f9fafb;
 * }
 * 
 * .result-item:last-child {
 *   border-bottom: none;
 * }
 * 
 * .result-info {
 *   flex: 1;
 * }
 * 
 * .result-name {
 *   font-weight: 500;
 *   color: #111827;
 * }
 * 
 * .result-meta {
 *   font-size: 12px;
 *   color: #6b7280;
 *   margin-top: 2px;
 * }
 * 
 * .no-results {
 *   position: absolute;
 *   top: calc(100% + 4px);
 *   left: 0;
 *   right: 0;
 *   padding: 16px;
 *   background: white;
 *   border: 1px solid #d1d5db;
 *   border-radius: 8px;
 *   text-align: center;
 *   color: #6b7280;
 *   font-size: 14px;
 * }
 */