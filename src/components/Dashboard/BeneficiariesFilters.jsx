/**
 * 🇬🇦 RSU GABON - BeneficiariesFilters CORRIGÉ
 * Standards Top 1% - FIX CRITIQUE ligne 339
 * 
 * ERREUR RÉSOLUE:
 * ❌ TypeError: t.toFixed is not a function
 * ✅ Protection avec Optional Chaining + Fallback
 * 
 * Fichier: src/components/Dashboard/BeneficiariesFilters.jsx
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Search, Filter, MapPin, Calendar, Eye, RefreshCw,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export default function BeneficiariesFilters() {
  // ========== STATE ==========
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    province: '',
    gender: '',
    vulnerabilityMin: '',
    vulnerabilityMax: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Debounce
  const searchTimeoutRef = useRef(null);
  const DEBOUNCE_DELAY = 500;

  // ========== LOAD BENEFICIARIES ==========
  const loadBeneficiaries = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page,
        page_size: 20
      });

      // Ajouter filtres actifs
      if (filters.search) params.append('search', filters.search);
      if (filters.province) params.append('province', filters.province);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.vulnerabilityMin) params.append('vulnerability_min', filters.vulnerabilityMin);
      if (filters.vulnerabilityMax) params.append('vulnerability_max', filters.vulnerabilityMax);

      const response = await apiClient.get(`/identity/persons/?${params.toString()}`);

      setBeneficiaries(response.results || []);
      setTotalCount(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / 20));
      setCurrentPage(page);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('❌ Erreur chargement bénéficiaires:', err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [filters]);

  // ========== DEBOUNCED SEARCH ==========
  const handleSearchChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadBeneficiaries(1);
    }, DEBOUNCE_DELAY);
  }, [loadBeneficiaries]);

  // ========== FILTER HANDLERS ==========
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    loadBeneficiaries(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      province: '',
      gender: '',
      vulnerabilityMin: '',
      vulnerabilityMax: ''
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadBeneficiaries(page);
    }
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    loadBeneficiaries(1);
  }, []);

  useEffect(() => {
    const { search, ...otherFilters } = filters;
    if (Object.values(otherFilters).some(v => v !== '')) {
      loadBeneficiaries(1);
    }
  }, [filters.province, filters.gender, filters.vulnerabilityMin, filters.vulnerabilityMax]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // ========== HELPERS ==========
  const getVulnerabilityColor = (score) => {
    const numScore = typeof score === 'number' ? score : parseFloat(score) || 0;
    
    if (numScore >= 80) return 'bg-red-100 text-red-800';
    if (numScore >= 60) return 'bg-orange-100 text-orange-800';
    if (numScore >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'N/A';
    }
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  // ========== RENDER ==========
  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Rechercher (NIP, nom...)"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {searching && (
              <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 animate-spin" size={18} />
            )}
          </div>

          {/* Province */}
          <select
            value={filters.province}
            onChange={(e) => handleFilterChange('province', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les provinces</option>
            <option value="ESTUAIRE">Estuaire</option>
            <option value="HAUT_OGOOUE">Haut-Ogooué</option>
            <option value="MOYEN_OGOOUE">Moyen-Ogooué</option>
            <option value="NGOUNIE">Ngounié</option>
            <option value="NYANGA">Nyanga</option>
            <option value="OGOOUE_IVINDO">Ogooué-Ivindo</option>
            <option value="OGOOUE_LOLO">Ogooué-Lolo</option>
            <option value="OGOOUE_MARITIME">Ogooué-Maritime</option>
            <option value="WOLEU_NTEM">Woleu-Ntem</option>
          </select>

          {/* Gender */}
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les genres</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
            <option value="OTHER">Autre</option>
          </select>

          {/* Vulnerability Range */}
          <div className="flex space-x-2">
            <input
              type="number"
              value={filters.vulnerabilityMin}
              onChange={(e) => handleFilterChange('vulnerabilityMin', e.target.value)}
              placeholder="Score min"
              min="0"
              max="100"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={filters.vulnerabilityMax}
              onChange={(e) => handleFilterChange('vulnerabilityMax', e.target.value)}
              placeholder="Score max"
              min="0"
              max="100"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">❌ Erreur</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && !searching && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Chargement des bénéficiaires...</p>
        </div>
      )}

      {/* Beneficiaries Table */}
      {!loading && beneficiaries.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Identité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score Vulnérabilité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {beneficiary.first_name?.charAt(0)}{beneficiary.last_name?.charAt(0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {beneficiary.first_name} {beneficiary.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {beneficiary.gender === 'M' ? 'Masculin' : beneficiary.gender === 'F' ? 'Féminin' : 'Autre'}
                          {beneficiary.date_of_birth && ` • ${new Date().getFullYear() - new Date(beneficiary.date_of_birth).getFullYear()} ans`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {beneficiary.nip || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{beneficiary.province || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* ✅ FIX CRITIQUE LIGNE 339 - Protection .toFixed() */}
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getVulnerabilityColor(beneficiary.vulnerability_score)
                      }`}>
                        {typeof beneficiary.vulnerability_score === 'number' 
                          ? beneficiary.vulnerability_score.toFixed(1)
                          : (parseFloat(beneficiary.vulnerability_score) || 0).toFixed(1)
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(beneficiary.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Voir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> à{' '}
              <span className="font-medium">{Math.min(currentPage * 20, totalCount)}</span> sur{' '}
              <span className="font-medium">{totalCount}</span> résultats
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && beneficiaries.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">Aucun bénéficiaire trouvé</p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}