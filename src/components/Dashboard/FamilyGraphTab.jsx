/**
 * 🇬🇦 RSU GABON - FAMILY GRAPH TAB
 * Standards Top 1% - Réseau Familial & Dépendances
 * 
 * FEATURES:
 * ✅ Navigation 3 vues: Relations, Réseaux, Dépendances
 * ✅ Statistiques temps réel
 * ✅ Intégration API backend
 * 
 * Fichier: src/components/Dashboard/FamilyGraphTab.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Users, Network, TrendingDown, RefreshCw,
  AlertTriangle, CheckCircle
} from 'lucide-react';

// Import des composants réels
import RelationshipsTable from './FamilyGraphTab/RelationshipsTable';
import NetworksDashboard from './FamilyGraphTab/NetworksDashboard';
import DependenciesAnalysis from './FamilyGraphTab/DependenciesAnalysis';

// Import du Hook personnalisé
import { useFamilyGraph } from '../../hooks/useFamilyGraph';

export default function FamilyGraphTab() {
  const [activeView, setActiveView] = useState('relationships');
  
  const {
    statistics,
    loading,
    error,
    refreshAllData
  } = useFamilyGraph();

  // Chargement initial des statistiques
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Gestion de l'affichage des erreurs globales
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center">
        <AlertTriangle className="text-red-500 mb-2" size={40} />
        <h3 className="text-lg font-bold text-red-800">Erreur de chargement</h3>
        <p className="text-red-600 mb-4 text-center">
          {typeof error === 'string' ? error : (error.message || "Une erreur inattendue est survenue")}
        </p>
        <button 
          onClick={refreshAllData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
        >
          <RefreshCw size={18} /> Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER AVEC STATISTIQUES TEMPS RÉEL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Relations" 
          value={statistics?.relationships?.total || 0} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          label="Réseaux" 
          value={statistics?.networks?.total || 0} 
          icon={Network} 
          color="purple" 
        />
        <StatCard 
          label="Dépendances" 
          value={statistics?.dependencies?.total || 0} 
          icon={TrendingDown} 
          color="orange" 
        />
        <StatCard 
          label="Vérifiées" 
          value={statistics?.relationships?.verified || 0} 
          icon={CheckCircle} 
          color="green" 
          isGood
        />
      </div>

      {/* NAVIGATION PAR ONGLETS */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'relationships', label: 'Relations Familiales', icon: Users },
            { id: 'networks', label: 'Réseaux de Ménages', icon: Network },
            { id: 'dependencies', label: 'Dépendances', icon: TrendingDown }
          ].map(view => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeView === view.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {view.label}
              </button>
            );
          })}
        </div>

        {/* CONTENU DYNAMIQUE */}
        <div className="p-1 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-b-lg">
              <RefreshCw className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          {activeView === 'relationships' && <RelationshipsTable />}
          {activeView === 'networks' && <NetworksDashboard />}
          {activeView === 'dependencies' && <DependenciesAnalysis />}
        </div>
      </div>
    </div>
  );
}

/**
 * Sous-composant pour les cartes statistiques du Graphe
 */
const StatCard = ({ label, value, icon: Icon, color, isGood = false }) => {
  const colors = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    green: "text-green-600"
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${isGood ? 'text-green-700' : 'text-gray-900'}`}>
            {typeof value === 'number' ? value.toLocaleString() : '0'}
          </p>
        </div>
        <Icon className={colors[color]} size={32} />
      </div>
    </div>
  );
};