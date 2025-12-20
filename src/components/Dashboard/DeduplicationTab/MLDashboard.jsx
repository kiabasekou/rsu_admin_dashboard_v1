/**
 * 🇬🇦 RSU GABON - ML DASHBOARD COMPONENT
 * Standards Top 1% - Production Ready
 * 
 * Fichier: src/components/Dashboard/DeduplicationTab/MLDashboard.jsx
 * 
 * BASÉ SUR LE MODÈLE BACKEND RÉEL:
 * - apps/deduplication/models/ml_model.py (MLModel)
 * - apps/deduplication/serializers/dedup_serializers.py (MLModelSerializer)
 * - apps/deduplication/views/dedup_views.py (MLModelViewSet)
 * 
 * CHAMPS MODÈLE (Source of Truth):
 * - id, model_id, model_name, model_version
 * - model_type, algorithm, model_status
 * - is_active (alias de is_production), description, purpose
 * - accuracy, precision, recall, f1_score, auc_roc
 * - performance_summary
 * - false_positive_rate, false_negative_rate
 * - predictions_made, correct_predictions, human_corrections
 * - training_started_at, training_completed_at
 * - deployed_at, needs_retraining
 * 
 * API ENDPOINTS:
 * - GET /api/v1/deduplication/ml-models/
 * - GET /api/v1/deduplication/ml-models/statistics/
 * - GET /api/v1/deduplication/ml-models/production_models/
 * - POST /api/v1/deduplication/ml-models/{id}/deploy/
 */

import React, { useState, useEffect } from 'react';
import {
  Brain, TrendingUp, CheckCircle, AlertTriangle, 
  RefreshCw, Zap, Target, Activity, Award,
  Calendar, Database, BarChart3, PlayCircle
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import apiClient from '../../../services/api/apiClient';


// ============================================================================
// CONFIGURATION
// ============================================================================

const MODEL_STATUS = {
  TRAINING: { label: 'Entraînement', color: 'bg-blue-100 text-blue-800', icon: Activity },
  TRAINED: { label: 'Entraîné', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  TESTING: { label: 'Test', color: 'bg-yellow-100 text-yellow-800', icon: Target },
  DEPLOYED: { label: 'Déployé', color: 'bg-purple-100 text-purple-800', icon: PlayCircle },
  ARCHIVED: { label: 'Archivé', color: 'bg-gray-100 text-gray-800', icon: Database }
};

const ALGORITHMS = {
  RANDOM_FOREST: { label: 'Random Forest', color: '#10b981' },
  GRADIENT_BOOSTING: { label: 'Gradient Boosting', color: '#3b82f6' },
  SVM: { label: 'SVM', color: '#8b5cf6' },
  NEURAL_NETWORK: { label: 'Neural Network', color: '#f59e0b' },
  LOGISTIC_REGRESSION: { label: 'Régression Logistique', color: '#ef4444' }
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function MLDashboard() {
  const [models, setModels] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================================================
  // CHARGEMENT DES DONNÉES
  // ==========================================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [modelsRes, statsRes] = await Promise.all([
        apiClient.get('/deduplication/ml-models/', {
          params: { ordering: '-f1_score' }
        }),
        apiClient.get('/deduplication/ml-models/statistics/')
      ]);

      const modelsData = modelsRes.results || modelsRes;
      setModels(Array.isArray(modelsData) ? modelsData : []);
      setStatistics(statsRes);
      
      console.log(`✅ ${models.length} modèles ML chargés`);

    } catch (err) {
      console.error('❌ Erreur chargement modèles ML:', err);
      setError(err.response?.data?.detail || 'Erreur de chargement');
      setModels([]);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // DÉPLOYER MODÈLE
  // ==========================================================================

  const handleDeploy = async (modelId) => {
    if (!window.confirm('Déployer ce modèle en production ?')) {
      return;
    }

    try {
      console.log(`🚀 Déploiement modèle ${modelId}...`);

      await apiClient.post(`/deduplication/ml-models/${modelId}/deploy/`);

      alert('Modèle déployé en production avec succès');
      await loadData();

    } catch (err) {
      console.error('❌ Erreur déploiement:', err);
      alert(err.response?.data?.error || 'Erreur lors du déploiement');
    }
  };

  // ==========================================================================
  // FORMATER DATE
  // ==========================================================================

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // ==========================================================================
  // RENDER METRIC CARD
  // ==========================================================================

const renderMetricCard = (label, value, Icon, color = 'blue') => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{label}</span>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {/* L'argument Icon est utilisé ici comme un composant React */}
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    );
  };

  // ==========================================================================
  // RENDER PERFORMANCE RADAR
  // ==========================================================================

  const renderPerformanceRadar = (model) => {
    const data = [
      { metric: 'Accuracy', value: (model.accuracy || 0) * 100 },
      { metric: 'Precision', value: (model.precision || 0) * 100 },
      { metric: 'Recall', value: (model.recall || 0) * 100 },
      { metric: 'F1-Score', value: (model.f1_score || 0) * 100 },
      { metric: 'AUC-ROC', value: (model.auc_roc || 0) * 100 }
    ];

    return (
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="metric" style={{ fontSize: '11px' }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  // ==========================================================================
  // RENDER LOADING
  // ==========================================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
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
          onClick={loadData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-600" />
            Machine Learning Dashboard
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {models.length} modèle{models.length > 1 ? 's' : ''} IA • {statistics?.production_models || 0} en production
          </p>
        </div>
        
        <button
          onClick={loadData}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Actualiser</span>
        </button>
      </div>

      {/* STATISTIQUES GLOBALES */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {renderMetricCard(
            'Modèles Totaux',
            statistics.total_models || 0,
            Database,
            'blue'
          )}
          {renderMetricCard(
            'En Production',
            statistics.production_models || 0,
            PlayCircle,
            'green'
          )}
          {renderMetricCard(
            'Accuracy Moyenne',
            `${((statistics.average_accuracy || 0) * 100).toFixed(1)}%`,
            Target,
            'purple'
          )}
          {renderMetricCard(
            'F1-Score Moyen',
            `${((statistics.average_f1_score || 0) * 100).toFixed(1)}%`,
            Award,
            'orange'
          )}
        </div>
      )}

      {/* GRAPHIQUES */}
      {statistics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribution par Algorithme */}
          {statistics.by_algorithm && Object.keys(statistics.by_algorithm).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Distribution par Algorithme
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(statistics.by_algorithm).map(([key, value]) => ({
                      name: ALGORITHMS[key]?.label || key,
                      value
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {Object.keys(statistics.by_algorithm).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Distribution par Statut */}
          {statistics.by_status && Object.keys(statistics.by_status).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Distribution par Statut
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(statistics.by_status).map(([key, value]) => ({
                    status: MODEL_STATUS[key]?.label || key,
                    count: value
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="status" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* LISTE DES MODÈLES */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Modèles Disponibles</h3>
        
        {models.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun modèle ML
            </h3>
            <p className="text-gray-500">
              Les modèles de Machine Learning apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {models.map(model => {
              const statusConfig = MODEL_STATUS[model.model_status] || MODEL_STATUS.TRAINING;
              const StatusIcon = statusConfig.icon;
              const algoConfig = ALGORITHMS[model.algorithm];

              return (
                <div
                  key={model.id}
                  className={`bg-white rounded-lg shadow-md border-l-4 p-6 hover:shadow-lg transition-shadow ${
                    model.is_active ? 'border-green-500' : 'border-gray-300'
                  }`}
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-gray-900">
                          {model.model_name}
                        </h4>
                        {model.is_active && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            PRODUCTION
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-mono">{model.model_id}</span>
                        <span>•</span>
                        <span>{algoConfig?.label || model.algorithm}</span>
                        <span>•</span>
                        <span>v{model.model_version}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  {model.description && (
                    <p className="text-sm text-gray-600 mb-4">{model.description}</p>
                  )}

                  {/* MÉTRIQUES PRINCIPALES */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {((model.accuracy || 0) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-600">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {((model.precision || 0) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-600">Précision</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {((model.recall || 0) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-600">Recall</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {((model.f1_score || 0) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-600">F1-Score</p>
                    </div>
                  </div>

                  {/* RADAR CHART */}
                  {renderPerformanceRadar(model)}

                  {/* STATS PRODUCTION */}
                  {model.predictions_made > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center text-xs">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {model.predictions_made.toLocaleString()}
                          </p>
                          <p className="text-gray-600">Prédictions</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {model.correct_predictions.toLocaleString()}
                          </p>
                          <p className="text-gray-600">Correctes</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {model.human_corrections.toLocaleString()}
                          </p>
                          <p className="text-gray-600">Corrections</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ALERTES */}
                  {model.needs_retraining && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-orange-700">
                        <strong>Réentraînement recommandé:</strong> Le modèle nécessite une mise à jour.
                      </p>
                    </div>
                  )}

                  {/* FOOTER */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {model.deployed_at ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Déployé: {formatDate(model.deployed_at)}
                        </div>
                      ) : model.training_completed_at ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Entraîné: {formatDate(model.training_completed_at)}
                        </div>
                      ) : null}
                    </div>

                    {/* ACTION DÉPLOYER */}
                    {!model.is_active && model.model_status === 'TRAINED' && model.f1_score >= 0.75 && (
                      <button
                        onClick={() => handleDeploy(model.id)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2 text-sm font-medium"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Déployer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}