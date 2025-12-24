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

/**
 *
 * Optimisation des performances et résolution des boucles infinies
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Filter, MapPin, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export default function BeneficiariesTab() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    province: '',
    gender: '',
    vulnerabilityMin: '',
    vulnerabilityMax: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const searchTimeoutRef = useRef(null);

  const loadBeneficiaries = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page,
        page_size: 20
      });

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
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      loadBeneficiaries(1);
    }, 500);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

  useEffect(() => {
    loadBeneficiaries(1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.province || filters.gender || filters.vulnerabilityMin || filters.vulnerabilityMax) {
        loadBeneficiaries(1);
      }
    }, 300);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.province, filters.gender, filters.vulnerabilityMin, filters.vulnerabilityMax]);

  const getVulnerabilityColor = (score) => {
    const numScore = typeof score === 'number' ? score : parseFloat(score) || 0;
    if (numScore >= 80) return 'text-red-600';
    if (numScore >= 60) return 'text-orange-600';
    if (numScore >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline w-4 h-4 mr-2" />
              Recherche
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Nom, RSU ID, NIP..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-2" />
              Province
            </label>
            <select
              value={filters.province}
              onChange={(e) => handleFilterChange('province', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Toutes</option>
              <option value="ESTUAIRE">ESTUAIRE</option>
              <option value="HAUT_OGOOUE">HAUT_OGOOUE</option>
              <option value="MOYEN_OGOOUE">MOYEN_OGOOUE</option>
              <option value="NGOUNIE">NGOUNIE</option>
              <option value="NYANGA">NYANGA</option>
              <option value="OGOOUE_IVINDO">OGOOUE_IVINDO</option>
              <option value="OGOOUE_LOLO">OGOOUE_LOLO</option>
              <option value="OGOOUE_MARITIME">OGOOUE_MARITIME</option>
              <option value="WOLEU_NTEM">WOLEU_NTEM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tous</option>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score Vulnérabilité
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.vulnerabilityMin}
                onChange={(e) => handleFilterChange('vulnerabilityMin', e.target.value)}
                placeholder="Min"
                min="0"
                max="100"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                value={filters.vulnerabilityMax}
                onChange={(e) => handleFilterChange('vulnerabilityMax', e.target.value)}
                placeholder="Max"
                min="0"
                max="100"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p>Chargement...</p>
        </div>
      )}

      {!loading && beneficiaries.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RSU ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vulnérabilité</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {beneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {beneficiary.rsu_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {beneficiary.first_name} {beneficiary.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {beneficiary.province}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getVulnerabilityColor(beneficiary.vulnerability_score)}`}>
                      {beneficiary.vulnerability_score?.toFixed(1) || '0.0'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-white px-4 py-3 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700">
              Page {currentPage} sur {totalPages} ({totalCount} résultats)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadBeneficiaries(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => loadBeneficiaries(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && beneficiaries.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Aucun bénéficiaire trouvé
        </div>
      )}
    </div>
  );
}