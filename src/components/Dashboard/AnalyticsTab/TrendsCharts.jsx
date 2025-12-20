/**
 * 🇬🇦 RSU GABON - TRENDS CHARTS COMPONENT
 * Standards Top 1% - Production Ready
 * 
 * Fichier: src/components/Dashboard/AnalyticsTab/TrendsCharts.jsx
 * 
 * BASÉ SUR LES ENDPOINTS BACKEND RÉELS:
 * - GET /api/v1/analytics/dashboard/ → monthly_enrollments
 * - GET /api/v1/analytics/dashboard/ → vulnerability_distribution
 * 
 * DONNÉES RETOURNÉES (Source of Truth):
 * 
 * monthly_enrollments: [
 *   { month: 'Jan', count: 45, year: 2025 },
 *   { month: 'Fev', count: 52, year: 2025 },
 *   ...
 * ]
 * 
 * vulnerability_distribution: [
 *   { level: 'Faible', range: '0-39', count: 34, color: '#10b981' },
 *   { level: 'Moyen', range: '40-59', count: 56, color: '#f59e0b' },
 *   { level: 'Élevé', range: '60+', count: 28, color: '#ef4444' }
 * ]
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Calendar, AlertTriangle, BarChart3,
  RefreshCw, Download, Activity, Users
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import apiClient from '../../../services/api/apiClient';


// ============================================================================
// CONFIGURATION DES COULEURS
// ============================================================================

const COLORS = {
  primary: '#3b82f6',      // blue-600
  success: '#10b981',      // green-600
  warning: '#f59e0b',      // orange-600
  danger: '#ef4444',       // red-600
  purple: '#8b5cf6',       // purple-600
  teal: '#14b8a6',         // teal-600
  gray: '#6b7280'          // gray-600
};

const VULNERABILITY_COLORS = {
  'Faible': '#10b981',     // vert
  'Moyen': '#f59e0b',      // orange
  'Élevé': '#ef4444'       // rouge
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function TrendsCharts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('all'); // all, enrollments, vulnerability

  useEffect(() => {
    loadTrendsData();
  }, []);

  // ==========================================================================
  // CHARGEMENT DES DONNÉES
  // ==========================================================================

  const loadTrendsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Endpoint réel du backend
      const response = await apiClient.get('/analytics/dashboard/');

      // Extraire les données de tendances
      const { monthly_enrollments, vulnerability_distribution, province_data } = response;

      setData({
        enrollments: monthly_enrollments || [],
        vulnerability: vulnerability_distribution || [],
        provinces: province_data || []
      });

      console.log('✅ Données tendances chargées:', {
        enrollments: monthly_enrollments?.length || 0,
        vulnerability: vulnerability_distribution?.length || 0,
        provinces: province_data?.length || 0
      });

    } catch (err) {
      console.error('❌ Erreur chargement tendances:', err);
      setError(err.response?.data?.detail || 'Erreur de chargement');
      
      // Données par défaut
      setData({
        enrollments: [],
        vulnerability: [],
        provinces: []
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // EXPORT DES GRAPHIQUES
  // ==========================================================================

  const handleExport = (chartType) => {
    console.log(`📊 Export graphique: ${chartType}`);
    // TODO: Implémenter export PNG/PDF
    alert(`Export ${chartType} - Fonctionnalité à venir`);
  };

  // ==========================================================================
  // GRAPHIQUE: INSCRIPTIONS MENSUELLES (LINE CHART)
  // ==========================================================================

  const renderEnrollmentsChart = () => {
    if (!data?.enrollments || data.enrollments.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Aucune donnée d'inscription disponible</p>
        </div>
      );
    }

    // Calculer tendance
    const counts = data.enrollments.map(d => d.count);
    const avgGrowth = counts.length > 1 
      ? ((counts[counts.length - 1] - counts[0]) / counts[0] * 100).toFixed(1)
      : 0;

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Inscriptions Mensuelles
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Évolution sur les 6 derniers mois
              {avgGrowth !== 0 && (
                <span className={`ml-2 font-semibold ${avgGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {avgGrowth > 0 ? '+' : ''}{avgGrowth}%
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => handleExport('enrollments')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.enrollments}>
            <defs>
              <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value} inscriptions`, 'Total']}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={COLORS.primary}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorEnrollments)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {counts.reduce((a, b) => a + b, 0)}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total inscriptions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {counts.length > 0 ? Math.max(...counts) : 0}
            </p>
            <p className="text-xs text-gray-600 mt-1">Pic mensuel</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {counts.length > 0 ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length) : 0}
            </p>
            <p className="text-xs text-gray-600 mt-1">Moyenne/mois</p>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // GRAPHIQUE: DISTRIBUTION VULNÉRABILITÉ (PIE + BAR)
  // ==========================================================================

  const renderVulnerabilityCharts = () => {
    if (!data?.vulnerability || data.vulnerability.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Aucune donnée de vulnérabilité disponible</p>
        </div>
      );
    }

    const totalAssessments = data.vulnerability.reduce((sum, d) => sum + d.count, 0);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE CHART */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Répartition Vulnérabilité
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {totalAssessments} évaluations totales
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.vulnerability}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ level, count }) => `${level}: ${count}`}
                labelLine={true}
              >
                {data.vulnerability.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS.gray} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} (${((value / totalAssessments) * 100).toFixed(1)}%)`,
                  props.payload.level
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Légende personnalisée */}
          <div className="mt-4 space-y-2">
            {data.vulnerability.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-700">
                    {item.level} ({item.range})
                  </span>
                </div>
                <span className="text-gray-600">
                  {item.count} ({((item.count / totalAssessments) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BAR CHART */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Volumes par Niveau
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Comparaison des catégories
              </p>
            </div>
            <button
              onClick={() => handleExport('vulnerability')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.vulnerability}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="level" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} personnes`, 'Total']}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.vulnerability.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS.gray} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Indicateur critique */}
          {data.vulnerability.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> {data.vulnerability[data.vulnerability.length - 1]?.count || 0} personnes 
                en vulnérabilité élevée nécessitent une attention prioritaire.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================================================
  // GRAPHIQUE: TOP PROVINCES (BAR HORIZONTAL)
  // ==========================================================================

  const renderProvincesChart = () => {
    if (!data?.provinces || data.provinces.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Aucune donnée provinciale disponible</p>
        </div>
      );
    }

    // Top 5 provinces
    const topProvinces = [...data.provinces]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Top 5 Provinces
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Distribution géographique des bénéficiaires
            </p>
          </div>
          <button
            onClick={() => handleExport('provinces')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProvinces} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis 
              type="category" 
              dataKey="province" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value} bénéficiaires`, 'Total']}
            />
            <Bar dataKey="count" fill={COLORS.teal} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ==========================================================================
  // RENDER LOADING
  // ==========================================================================

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadTrendsData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
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
            Graphiques de Tendances
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Analyse temporelle et distributions clés
          </p>
        </div>
        
        <button
          onClick={loadTrendsData}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Actualiser</span>
        </button>
      </div>

      {/* GRAPHIQUES */}
      <div className="space-y-6">
        {/* Inscriptions mensuelles */}
        {renderEnrollmentsChart()}

        {/* Distribution vulnérabilité (2 colonnes) */}
        {renderVulnerabilityCharts()}

        {/* Top provinces */}
        {renderProvincesChart()}
      </div>
    </div>
  );
}