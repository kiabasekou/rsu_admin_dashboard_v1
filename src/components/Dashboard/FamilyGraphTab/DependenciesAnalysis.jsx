/**
 * 🇬🇦 RSU GABON - DEPENDENCIES ANALYSIS
 * Standards Top 1% - Liste dépendances avec scoring
 * Fichier: src/components/Dashboard/FamilyGraphTab/DependenciesAnalysis.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingDown, AlertTriangle, Target, RefreshCw,
  ChevronRight, Filter, X
} from 'lucide-react';
import { useFamilyGraph } from '../../../hooks/useFamilyGraph';

export default function DependenciesAnalysis() {
  // ========== HOOKS ==========
  const {
    dependencies,
    loading,
    error,
    loadDependencies
  } = useFamilyGraph();

  // ========== STATE ==========
  const [filters, setFilters] = useState({
    dependency_type: '',
    severity_level: '',
    priority: ''
  });

  // ========== EFFECTS ==========
  useEffect(() => {
    loadDependencies(filters);
  }, [filters, loadDependencies]);

  // ========== HANDLERS ==========
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      dependency_type: '',
      severity_level: '',
      priority: ''
    });
  };

  // ========== HELPERS ==========
  const getSeverityBadge = (severity) => {
    const config = {
      CRITICAL: { bg: 'bg-red-100', text: 'text-red-800', label: 'Critique', icon: AlertTriangle },
      HIGH: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Élevée', icon: AlertTriangle },
      MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Moyenne', icon: Target },
      LOW: { bg: 'bg-green-100', text: 'text-green-800', label: 'Faible', icon: Target }
    };
    
    const style = config[severity] || config.LOW;
    const Icon = style.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
        <Icon size={12} />
        {style.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      URGENT: { bg: 'bg-red-600', text: 'text-white', label: 'URGENT' },
      HIGH: { bg: 'bg-orange-600', text: 'text-white', label: 'HAUTE' },
      MEDIUM: { bg: 'bg-yellow-600', text: 'text-white', label: 'MOYENNE' },
      LOW: { bg: 'bg-green-600', text: 'text-white', label: 'BASSE' }
    };
    
    const style = config[priority] || config.LOW;
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  // ========== RENDER ==========
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Analyses de Dépendances</h2>
            <p className="text-sm text-gray-600 mt-1">
              {dependencies.length} analyse{dependencies.length > 1 ? 's' : ''} enregistrée{dependencies.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            onClick={() => loadDependencies(filters)}
            disabled={loading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Type dépendance */}
          <select
            value={filters.dependency_type}
            onChange={(e) => handleFilterChange('dependency_type', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="FINANCIAL">Financière</option>
            <option value="MEDICAL">Médicale</option>
            <option value="HOUSING">Logement</option>
            <option value="FOOD_SECURITY">Sécurité alimentaire</option>
            <option value="EDUCATION">Éducation</option>
            <option value="EMPLOYMENT">Emploi</option>
            <option value="CHILDCARE">Garde d'enfants</option>
            <option value="DISABILITY">Handicap</option>
            <option value="ELDERLY_CARE">Soins personnes âgées</option>
          </select>

          {/* Sévérité */}
          <select
            value={filters.severity_level}
            onChange={(e) => handleFilterChange('severity_level', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les sévérités</option>
            <option value="CRITICAL">Critique</option>
            <option value="HIGH">Élevée</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Faible</option>
          </select>

          {/* Priorité */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les priorités</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>

          {/* Clear */}
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <X size={18} />
            Effacer
          </button>
        </div>
      </div>

      {/* DEPENDENCIES LIST */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <RefreshCw className="animate-spin text-blue-600 mr-3" size={32} />
          <p className="text-gray-600">Chargement des analyses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      ) : dependencies.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <TrendingDown className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune analyse trouvée</h3>
          <p className="text-gray-500">Aucune analyse ne correspond aux filtres sélectionnés</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dependencies.map((dep) => (
            <div
              key={dep.id}
              className="bg-white rounded-lg shadow-md border-l-4 border-orange-500 p-6 hover:shadow-lg transition-shadow"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {dep.dependency_type || 'Type inconnu'}
                    </h3>
                    {getSeverityBadge(dep.severity_level)}
                    {getPriorityBadge(dep.priority)}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Ménage: <span className="font-semibold">{dep.household?.household_id || 'N/A'}</span>
                  </p>
                  
                  {dep.dependent_person && (
                    <p className="text-sm text-gray-600">
                      Personne dépendante: <span className="font-semibold">
                        {dep.dependent_person.first_name} {dep.dependent_person.last_name}
                      </span>
                    </p>
                  )}
                </div>

                {/* SCORE */}
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(dep.dependency_score || 0)}`}>
                    {dep.dependency_score || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Score</div>
                </div>
              </div>

              {/* DESCRIPTION */}
              {dep.description && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{dep.description}</p>
                </div>
              )}

              {/* RECOMMENDED PROGRAMS */}
              {dep.recommended_programs && dep.recommended_programs.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Programmes recommandés:</h4>
                  <div className="flex flex-wrap gap-2">
                    {dep.recommended_programs.map((program, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION PLAN */}
              {dep.action_plan && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-800 mb-1">Plan d'action:</h4>
                  <p className="text-sm text-green-700">{dep.action_plan}</p>
                </div>
              )}

              {/* INTERVENTION STATUS */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Statut intervention:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    dep.intervention_status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    dep.intervention_status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {dep.intervention_status || 'PENDING'}
                  </span>
                </div>

                <button
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                >
                  Voir détails
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}