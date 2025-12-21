/**
 * 🇬🇦 RSU GABON - RELATIONSHIPS TABLE
 * Standards Top 1% - Table paginée avec filtres
 * Fichier: src/components/Dashboard/FamilyGraphTab/RelationshipsTable.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle, AlertTriangle, X, Search,
  Filter, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useFamilyGraph } from '../../../hooks/useFamilyGraph';

export default function RelationshipsTable() {
  // ========== HOOKS ==========
  const {
    relationships,
    loading,
    error,
    loadRelationships,
    verifyRelationship
  } = useFamilyGraph();

  // ========== STATE ==========
  const [filters, setFilters] = useState({
    relationship_type: '',
    verification_status: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ========== EFFECTS ==========
  useEffect(() => {
    loadRelationships(filters);
  }, [filters, loadRelationships]);

  // ========== HANDLERS ==========
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleVerify = async (relationshipId) => {
    try {
      await verifyRelationship(relationshipId, {
        verification_method: 'MANUAL_REVIEW',
        verification_notes: 'Vérification manuelle depuis le dashboard'
      });
      console.log(`✅ Relation ${relationshipId} vérifiée`);
    } catch (err) {
      console.error('❌ Erreur vérification:', err);
    }
  };

  const handleFlagFraud = async (relationshipId) => {
    try {
      // TODO: Implémenter API flag_fraud si disponible
      console.log(`⚠️ Signalement fraude: ${relationshipId}`);
      alert('Fonctionnalité en développement');
    } catch (err) {
      console.error('❌ Erreur signalement:', err);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      relationship_type: '',
      verification_status: '',
      search: ''
    });
  };

  // ========== PAGINATION ==========
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = relationships.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(relationships.length / itemsPerPage);

  // ========== HELPERS ==========
  const getStrengthBadge = (strength) => {
    const config = {
      STRONG: { bg: 'bg-green-100', text: 'text-green-800', label: 'Fort' },
      MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Moyen' },
      WEAK: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Faible' }
    };
    
    const style = config[strength] || config.WEAK;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getVerificationBadge = (status) => {
    const config = {
      VERIFIED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Vérifié', icon: CheckCircle },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente', icon: AlertTriangle },
      UNVERIFIED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Non vérifié', icon: X }
    };
    
    const style = config[status] || config.UNVERIFIED;
    const Icon = style.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        <Icon size={12} />
        {style.label}
      </span>
    );
  };

  // ========== RENDER ==========
  return (
    <div className="bg-white rounded-lg shadow">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Relations Familiales</h2>
            <p className="text-sm text-gray-600 mt-1">
              {relationships.length} relation{relationships.length > 1 ? 's' : ''} trouvée{relationships.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            onClick={() => loadRelationships(filters)}
            disabled={loading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type de relation */}
          <select
            value={filters.relationship_type}
            onChange={(e) => handleFilterChange('relationship_type', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="PARENT">Parent</option>
            <option value="CHILD">Enfant</option>
            <option value="SIBLING">Frère/Sœur</option>
            <option value="SPOUSE">Conjoint</option>
            <option value="GRANDPARENT">Grand-parent</option>
            <option value="GRANDCHILD">Petit-enfant</option>
            <option value="UNCLE_AUNT">Oncle/Tante</option>
            <option value="NEPHEW_NIECE">Neveu/Nièce</option>
            <option value="COUSIN">Cousin</option>
            <option value="OTHER">Autre</option>
          </select>

          {/* Statut vérification */}
          <select
            value={filters.verification_status}
            onChange={(e) => handleFilterChange('verification_status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="VERIFIED">Vérifié</option>
            <option value="PENDING">En attente</option>
            <option value="UNVERIFIED">Non vérifié</option>
          </select>

          {/* Clear filters */}
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <X size={18} />
            Effacer
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personne A
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personne B
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Force lien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vérification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dépendance $
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <RefreshCw className="animate-spin text-blue-600 mx-auto mb-2" size={32} />
                  <p className="text-gray-600">Chargement...</p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <AlertTriangle className="text-red-600 mx-auto mb-2" size={32} />
                  <p className="text-red-600">{error}</p>
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Aucune relation trouvée
                </td>
              </tr>
            ) : (
              currentItems.map((rel) => (
                <tr key={rel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users size={18} className="text-blue-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rel.person_a?.first_name} {rel.person_a?.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {rel.person_a?.rsu_id || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-700">
                      {rel.relationship_type || 'N/A'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users size={18} className="text-green-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rel.person_b?.first_name} {rel.person_b?.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {rel.person_b?.rsu_id || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStrengthBadge(rel.strength_level)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getVerificationBadge(rel.verification_status)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rel.has_financial_dependency ? (
                      <span className="text-sm font-semibold text-orange-600">
                        {rel.financial_dependency_percentage || 0}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rel.verification_status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleVerify(rel.id)}
                          title="Vérifier"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      
                      {!rel.has_fraud_indicators && (
                        <button
                          onClick={() => handleFlagFraud(rel.id)}
                          title="Signaler fraude"
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <AlertTriangle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, relationships.length)} sur {relationships.length}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}