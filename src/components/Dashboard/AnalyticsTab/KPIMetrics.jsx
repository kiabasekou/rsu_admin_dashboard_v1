/**
 * 🇬🇦 RSU GABON - KPI METRICS COMPONENT
 * Standards Top 1% - Production Ready
 * 
 * Fichier: src/components/Dashboard/AnalyticsTab/KPIMetrics.jsx
 * 
 * BASÉ SUR LE MODÈLE BACKEND RÉEL:
 * - apps/analytics/models/kpi_metric.py
 * - apps/analytics/serializers/analytics_serializers.py
 * - apps/analytics/views.py (KPIMetricViewSet)
 * 
 * CHAMPS MODÈLE (Source of Truth):
 * - id, kpi_id, name, description
 * - kpi_type, kpi_type_display
 * - category, category_display
 * - current_value, previous_value, target_value
 * - formatted_value (méthode serializer)
 * - measurement_unit, display_format
 * - trend, trend_display, percentage_change
 * - is_on_target, performance_score
 * - alert_triggered, alert_message
 * - is_active, is_visible_dashboard, display_order
 * 
 * API ENDPOINT: GET /api/v1/analytics/kpi-metrics/
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle,
  Users, DollarSign, CheckCircle, Activity,
  RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import apiClient from '../../../services/api/apiClient';


// ============================================================================
// CONFIGURATION DES ICÔNES PAR CATÉGORIE
// ============================================================================

const CATEGORY_ICONS = {
  BENEFICIARIES: Users,
  FINANCIAL: DollarSign,
  PROGRAMS: CheckCircle,
  PERFORMANCE: Activity,
  default: Activity
};

const CATEGORY_COLORS = {
  BENEFICIARIES: 'blue',
  FINANCIAL: 'green',
  PROGRAMS: 'purple',
  PERFORMANCE: 'orange'
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function KPIMetrics() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    loadKPIs();
  }, [showInactive]);

  // ==========================================================================
  // CHARGEMENT DES KPIs
  // ==========================================================================

  const loadKPIs = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Endpoint réel du backend
      const response = await apiClient.get('/analytics/kpi-metrics/', {
        params: {
          is_active: showInactive ? undefined : true,
          is_visible_dashboard: true,
          ordering: 'display_order,name'
        }
      });

      // Gérer pagination Django ou liste directe
      //const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      const data = response.data?.results || response.data || [];
      
      
      if (Array.isArray(data)) {
        setKpis(data);
        console.log(`✅ ${data.length} KPIs chargés`);
      } else {
        setKpis([]);
        console.warn('⚠️ Format de réponse inattendu:', response.data);
      }

    } catch (err) {
      console.error('❌ Erreur chargement KPIs:', err);
      setError(err.response?.data?.detail || 'Erreur de chargement');
      setKpis([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // RECALCUL D'UN KPI
  // ==========================================================================

  const handleRecalculate = async (kpiId) => {
    try {
      console.log(`🔄 Recalcul KPI ${kpiId}...`);
      
      await apiClient.post(`/analytics/kpi-metrics/${kpiId}/calculate/`);
      
      // Recharger les KPIs
      await loadKPIs();
      
      console.log(`✅ KPI ${kpiId} recalculé`);
    } catch (err) {
      console.error(`❌ Erreur recalcul KPI ${kpiId}:`, err);
    }
  };

  // ==========================================================================
  // FONCTION DE RENDU DU TREND
  // ==========================================================================

  const renderTrend = (kpi) => {
    const { trend, percentage_change } = kpi;
    
    // trend: 'UP', 'DOWN', 'STABLE'
    const trendConfig = {
      UP: {
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        label: '↑'
      },
      DOWN: {
        icon: TrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        label: '↓'
      },
      STABLE: {
        icon: Minus,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        label: '→'
      }
    };

    const config = trendConfig[trend] || trendConfig.STABLE;
    const Icon = config.icon;
    const change = percentage_change || 0;

    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded ${config.bgColor}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-xs font-semibold ${config.color}`}>
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>
    );
  };

  // ==========================================================================
  // COULEUR DE LA CARTE SELON PERFORMANCE
  // ==========================================================================

  const getCardColor = (kpi) => {
    const { is_on_target, alert_triggered, performance_score } = kpi;

    if (alert_triggered) {
      return {
        border: 'border-red-300',
        bg: 'bg-red-50',
        badge: 'bg-red-100 text-red-800'
      };
    }

    if (is_on_target) {
      return {
        border: 'border-green-300',
        bg: 'bg-green-50',
        badge: 'bg-green-100 text-green-800'
      };
    }

    // Score de performance (0-100)
    if (performance_score >= 80) {
      return {
        border: 'border-green-300',
        bg: 'bg-white',
        badge: 'bg-green-100 text-green-800'
      };
    } else if (performance_score >= 60) {
      return {
        border: 'border-yellow-300',
        bg: 'bg-white',
        badge: 'bg-yellow-100 text-yellow-800'
      };
    } else {
      return {
        border: 'border-orange-300',
        bg: 'bg-white',
        badge: 'bg-orange-100 text-orange-800'
      };
    }
  };

  // ==========================================================================
  // SPARKLINE (GRAPHIQUE MINIATURE)
  // ==========================================================================

  const renderSparkline = (kpi) => {
    // Générer données historiques simulées
    // (À remplacer par vraies données de GET /analytics/kpi-metrics/{id}/history/)
    const generateHistoricalData = () => {
      const current = parseFloat(kpi.current_value) || 0;
      const previous = parseFloat(kpi.previous_value) || 0;
      
      return [
        { value: previous * 0.85 },
        { value: previous * 0.92 },
        { value: previous },
        { value: (previous + current) / 2 },
        { value: current }
      ];
    };

    const data = generateHistoricalData();
    const categoryColor = CATEGORY_COLORS[kpi.category] || 'blue';

    const strokeColors = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      orange: '#f59e0b'
    };

    return (
      <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColors[categoryColor]}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ==========================================================================
  // ICÔNE SELON CATÉGORIE
  // ==========================================================================

  const renderCategoryIcon = (category) => {
    const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
    const color = CATEGORY_COLORS[category] || 'blue';
    
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };

    return (
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    );
  };

  // ==========================================================================
  // RENDER LOADING
  // ==========================================================================

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==========================================================================
  // RENDER ERROR
  // ==========================================================================

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">
            Erreur de chargement
          </h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadKPIs}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // ==========================================================================
  // RENDER EMPTY STATE
  // ==========================================================================

  if (kpis.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucun KPI disponible
        </h3>
        <p className="text-gray-500 mb-6">
          Les indicateurs de performance seront affichés ici une fois configurés.
        </p>
        <button
          onClick={loadKPIs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>
    );
  }

  // ==========================================================================
  // RENDER MAIN
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Indicateurs de Performance (KPIs)
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {kpis.length} indicateur{kpis.length > 1 ? 's' : ''} actif{kpis.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Toggle KPIs inactifs */}
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`px-3 py-2 rounded-lg transition-colors inline-flex items-center gap-2 text-sm ${
              showInactive
                ? 'bg-gray-200 text-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showInactive ? 'Masquer inactifs' : 'Voir inactifs'}
          </button>

          {/* Refresh */}
          <button
            onClick={loadKPIs}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Actualiser</span>
          </button>
        </div>
      </div>

      {/* GRID DES KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map(kpi => {
          const cardColors = getCardColor(kpi);

          return (
            <div
              key={kpi.id}
              className={`bg-white rounded-lg shadow-md border-2 ${cardColors.border} ${cardColors.bg} p-6 transition-all hover:shadow-lg`}
            >
              {/* HEADER CARTE */}
              <div className="flex items-start justify-between mb-4">
                {/* Icône catégorie */}
                {renderCategoryIcon(kpi.category)}

                {/* Trend */}
                {renderTrend(kpi)}
              </div>

              {/* CONTENU */}
              <div className="space-y-3">
                {/* Nom KPI */}
                <h3 className="text-sm font-medium text-gray-600 line-clamp-1">
                  {kpi.name}
                </h3>

                {/* Valeur principale */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {kpi.formatted_value || kpi.current_value}
                  </span>
                  <span className="text-sm text-gray-500">
                    {kpi.measurement_unit}
                  </span>
                </div>

                {/* Sparkline */}
                <div className="flex items-center justify-between">
                  {renderSparkline(kpi)}
                  
                  {/* Badge performance */}
                  {kpi.performance_score !== null && (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${cardColors.badge}`}>
                      {kpi.performance_score}%
                    </span>
                  )}
                </div>

                {/* Description / Message alerte */}
                {kpi.alert_triggered && kpi.alert_message ? (
                  <div className="flex items-start gap-2 p-2 bg-red-100 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">{kpi.alert_message}</p>
                  </div>
                ) : kpi.description ? (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {kpi.description}
                  </p>
                ) : null}

                {/* Footer: Cible & Recalcul */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  {/* Cible */}
                  {kpi.target_value && (
                    <div className="text-xs text-gray-500">
                      Cible: <span className="font-semibold">{kpi.target_value}</span>
                    </div>
                  )}

                  {/* Bouton recalcul */}
                  <button
                    onClick={() => handleRecalculate(kpi.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                    title="Recalculer le KPI"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Calculer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}