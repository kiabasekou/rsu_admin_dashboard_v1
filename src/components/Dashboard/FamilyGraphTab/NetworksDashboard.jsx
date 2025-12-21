/**
 * 🇬🇦 RSU GABON - NETWORKS DASHBOARD
 * Standards Top 1% - Grille réseaux avec cartes stats
 * Fichier: src/components/Dashboard/FamilyGraphTab/NetworksDashboard.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Network, Users, Home, MapPin, AlertTriangle,
  RefreshCw, TrendingUp, Activity, Filter
} from 'lucide-react';
import { useFamilyGraph } from '../../../hooks/useFamilyGraph';

export default function NetworksDashboard() {
  // ========== HOOKS ==========
  const {
    networks,
    loading,
    error,
    loadNetworks
  } = useFamilyGraph();

  // ========== STATE ==========
  const [filters, setFilters] = useState({
    network_type: '',
    status: '',
    primary_province: ''
  });

  // ========== EFFECTS ==========
  useEffect(() => {
    loadNetworks(filters);
  }, [filters, loadNetworks]);

  // ========== HANDLERS ==========
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCalculateStats = async (networkId) => {
    try {
      // TODO: Implémenter calculate_stats
      console.log(`📊 Calcul stats réseau ${networkId}`);
      alert('Fonctionnalité en développement');
    } catch (err) {
      console.error('❌ Erreur calcul stats:', err);
    }
  };

  const handleDetectFraud = async (networkId) => {
    try {
      // TODO: Implémenter detect_fraud
      console.log(`🚨 Détection fraude réseau ${networkId}`);
      alert('Fonctionnalité en développement');
    } catch (err) {
      console.error('❌ Erreur détection fraude:', err);
    }
  };

  // ========== HELPERS ==========
  const getStatusBadge = (status) => {
    const config = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif' },
      INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactif' },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' }
    };
    
    const style = config[status] || config.ACTIVE;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getRiskBadge = (score) => {
    let config;
    if (score >= 75) {
      config = { bg: 'bg-red-100', text: 'text-red-800', label: 'Élevé' };
    } else if (score >= 50) {
      config = { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Moyen' };
    } else {
      config = { bg: 'bg-green-100', text: 'text-green-800', label: 'Faible' };
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        {config.label} ({score}%)
      </span>
    );
  };

  // ========== RENDER ==========
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Réseaux de Ménages</h2>
            <p className="text-sm text-gray-600 mt-1">
              {networks.length} réseau{networks.length > 1 ? 'x' : ''} identifié{networks.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            onClick={() => loadNetworks(filters)}
            disabled={loading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type réseau */}
          <select
            value={filters.network_type}
            onChange={(e) => handleFilterChange('network_type', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="NUCLEAR_FAMILY">Famille nucléaire</option>
            <option value="EXTENDED_FAMILY">Famille étendue</option>
            <option value="COMMUNITY">Communauté</option>
            <option value="GEOGRAPHIC">Géographique</option>
          </select>

          {/* Statut */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="INACTIVE">Inactif</option>
            <option value="PENDING">En attente</option>
          </select>

          {/* Province */}
          <select
            value={filters.primary_province}
            onChange={(e) => handleFilterChange('primary_province', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        </div>
      </div>

      {/* NETWORKS GRID */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <RefreshCw className="animate-spin text-blue-600 mr-3" size={32} />
          <p className="text-gray-600">Chargement des réseaux...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      ) : networks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Network className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun réseau trouvé</h3>
          <p className="text-gray-500">Aucun réseau ne correspond aux filtres sélectionnés</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {networks.map((network) => (
            <div
              key={network.id}
              className="bg-white rounded-lg shadow-md border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all p-6"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {network.network_name || 'Réseau sans nom'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ID: {network.network_id || 'N/A'}
                  </p>
                </div>
                <Network className="text-blue-600" size={24} />
              </div>

              {/* BADGES */}
              <div className="flex items-center gap-2 mb-4">
                {getStatusBadge(network.status)}
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {network.network_type || 'N/A'}
                </span>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Home className="text-blue-600 mx-auto mb-1" size={20} />
                  <p className="text-2xl font-bold text-blue-600">
                    {network.total_households || 0}
                  </p>
                  <p className="text-xs text-gray-600">Ménages</p>
                </div>

                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Users className="text-green-600 mx-auto mb-1" size={20} />
                  <p className="text-2xl font-bold text-green-600">
                    {network.total_members || 0}
                  </p>
                  <p className="text-xs text-gray-600">Membres</p>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{network.primary_province || 'Province inconnue'}</span>
              </div>

              {/* RISK SCORE */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Risque de fraude</span>
                  <span className="font-semibold">{network.fraud_risk_score || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (network.fraud_risk_score || 0) >= 75 ? 'bg-red-600' :
                      (network.fraud_risk_score || 0) >= 50 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${network.fraud_risk_score || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* FLAGS */}
              {network.flagged_for_review && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                  <div className="flex items-center gap-2 text-yellow-800 text-xs">
                    <AlertTriangle size={14} />
                    <span className="font-semibold">Signalé pour révision</span>
                  </div>
                </div>
              )}

              {network.has_high_fraud_risk && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                  <div className="flex items-center gap-2 text-red-800 text-xs">
                    <AlertTriangle size={14} />
                    <span className="font-semibold">Risque fraude élevé</span>
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleCalculateStats(network.id)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Activity size={14} />
                  Calculer stats
                </button>
                
                <button
                  onClick={() => handleDetectFraud(network.id)}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <AlertTriangle size={14} />
                  Détecter fraude
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}