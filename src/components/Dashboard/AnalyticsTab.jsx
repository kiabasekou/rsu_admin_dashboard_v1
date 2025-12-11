/**
 * 🇬🇦 RSU Gabon - Analytics Tab Avancé
 * Standards Top 1% - KPIs, Reports, Exports IA
 * Fichier: rsu_admin_dashboard_v1/src/components/Dashboard/AnalyticsTab.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, BarChart3, Download, FileText, RefreshCw,
  Calendar, Filter, Target, AlertTriangle, CheckCircle,
  Activity, DollarSign, Users, Home, Zap
} from 'lucide-react';
import { analyticsAPI } from '../../services/api/analyticsAPI';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AnalyticsTab() {
  const [activeView, setActiveView] = useState('kpis'); // 'kpis', 'reports', 'exports'
  const [kpiMetrics, setKpiMetrics] = useState([]);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [recentExports, setRecentExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [activeView]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      if (activeView === 'kpis') {
        const kpis = await analyticsAPI.getKPIMetrics();
        setKpiMetrics(Array.isArray(kpis) ? kpis : kpis.results || []);
      } else if (activeView === 'reports') {
        const templates = await analyticsAPI.getReportTemplates();
        setReportTemplates(Array.isArray(templates) ? templates : templates.results || []);
      } else if (activeView === 'exports') {
        const exports = await analyticsAPI.getDataExports({ limit: 20 });
        setRecentExports(Array.isArray(exports) ? exports : exports.results || []);
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const handleCalculateKPI = async (kpiId) => {
    try {
      await analyticsAPI.calculateKPI(kpiId);
      await loadAnalyticsData();
    } catch (error) {
      console.error('Erreur calcul KPI:', error);
    }
  };

  const handleGenerateReport = async (templateId) => {
    try {
      await analyticsAPI.generateReport(templateId);
      alert('Rapport généré avec succès !');
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      alert('Erreur lors de la génération du rapport');
    }
  };

  const handleDownloadExport = async (exportId) => {
    try {
      const blob = await analyticsAPI.downloadExport(exportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${exportId}.xlsx`;
      a.click();
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Analytics Avancés</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'kpis', label: 'KPI Metrics', icon: TrendingUp },
          { id: 'reports', label: 'Rapports', icon: FileText },
          { id: 'exports', label: 'Exports', icon: Download }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeView === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu selon vue active */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <>
          {activeView === 'kpis' && (
            <KPIMetricsView
              metrics={kpiMetrics}
              onCalculate={handleCalculateKPI}
              onSelect={setSelectedKPI}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              templates={reportTemplates}
              onGenerate={handleGenerateReport}
            />
          )}

          {activeView === 'exports' && (
            <ExportsView
              exports={recentExports}
              onDownload={handleDownloadExport}
            />
          )}
        </>
      )}

      {/* Modal détail KPI */}
      {selectedKPI && (
        <KPIDetailModal
          kpi={selectedKPI}
          onClose={() => setSelectedKPI(null)}
        />
      )}
    </div>
  );
}

// ==================== VUE KPI METRICS ====================

function KPIMetricsView({ metrics, onCalculate, onSelect }) {
  const getMetricIcon = (category) => {
    const icons = {
      'BENEFICIARIES': Users,
      'PROGRAMS': Target,
      'FINANCIAL': DollarSign,
      'HOUSEHOLDS': Home,
      'PERFORMANCE': Activity
    };
    return icons[category] || TrendingUp;
  };

  const getStatusColor = (status) => {
    const colors = {
      'NORMAL': 'bg-green-100 text-green-800',
      'WARNING': 'bg-yellow-100 text-yellow-800',
      'CRITICAL': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map(metric => {
        const Icon = getMetricIcon(metric.metric_category);
        const trend = metric.trend_percentage || 0;
        const isTrendingUp = trend > 0;

        return (
          <div
            key={metric.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelect(metric)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon className="text-blue-600" size={24} />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.alert_status)}`}>
                {metric.alert_status}
              </span>
            </div>

            {/* Valeur principale */}
            <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.metric_name}</h3>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {metric.current_value?.toLocaleString('fr-FR') || '0'}
            </p>

            {/* Trend */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`flex items-center gap-1 text-sm font-medium ${
                isTrendingUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {isTrendingUp ? '↑' : '↓'}
                {Math.abs(trend).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">vs période précédente</span>
            </div>

            {/* Target progress */}
            {metric.target_value && (
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Objectif</span>
                  <span>{metric.target_value.toLocaleString('fr-FR')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((metric.current_value / metric.target_value) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCalculate(metric.id);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Recalculer
              </button>
            </div>
          </div>
        );
      })}

      {/* Carte Créer KPI */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
        <div className="p-3 bg-white rounded-full mb-3">
          <Target className="text-gray-400" size={32} />
        </div>
        <p className="text-gray-600 font-medium">Créer nouveau KPI</p>
        <p className="text-sm text-gray-500">Définir indicateur personnalisé</p>
      </div>
    </div>
  );
}

// ==================== VUE RAPPORTS ====================

function ReportsView({ templates, onGenerate }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {templates.map(template => (
        <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <h3 className="font-semibold text-gray-800">{template.template_name}</h3>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {template.is_active ? 'Actif' : 'Inactif'}
            </span>
          </div>

          {/* Paramètres rapport */}
          <div className="mb-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">{template.report_type}</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-medium">{template.output_format}</span>
            </div>
            {template.schedule_frequency && (
              <div className="flex justify-between">
                <span>Fréquence:</span>
                <span className="font-medium">{template.schedule_frequency}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onGenerate(template.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Zap size={16} />
              Générer
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FileText size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== VUE EXPORTS ====================

function ExportsView({ exports, onDownload }) {
  const getStatusBadge = (status) => {
    const styles = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Export</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {exports.map(exp => (
            <tr key={exp.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Download size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-800">{exp.export_name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{exp.export_type}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(exp.export_status)}`}>
                  {exp.export_status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(exp.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4">
                {exp.export_status === 'COMPLETED' && (
                  <button
                    onClick={() => onDownload(exp.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                  >
                    <Download size={16} />
                    Télécharger
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== MODAL DÉTAIL KPI ====================

function KPIDetailModal({ kpi, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [kpi.id]);

  const loadHistory = async () => {
    try {
      const data = await analyticsAPI.getKPIHistory(kpi.id, '30d');
      setHistory(data || []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{kpi.metric_name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Graphique historique */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Évolution (30 derniers jours)</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <RefreshCw className="animate-spin text-blue-600" size={32} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Statistiques détaillées */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Valeur actuelle</p>
              <p className="text-2xl font-bold text-gray-800">
                {kpi.current_value?.toLocaleString('fr-FR')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Objectif</p>
              <p className="text-2xl font-bold text-gray-800">
                {kpi.target_value?.toLocaleString('fr-FR') || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}