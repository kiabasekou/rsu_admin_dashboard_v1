/**
 * 🇬🇦 RSU Gabon - Deduplication Tab
 * Standards Top 1% - Gestion Doublons & Anti-Fraude IA
 * Fichier: rsu_admin_dashboard_v1/src/components/Dashboard/DeduplicationTab.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, UserX, CheckCircle, X, RefreshCw,
  Eye, Trash2, Users, Zap, Shield, Brain, GitMerge,
  Activity, Search, Filter, ChevronRight
} from 'lucide-react';
import { deduplicationAPI } from '../../services/api/deduplicationAPI';

export default function DeduplicationTab() {
  const [activeView, setActiveView] = useState('detections'); // 'detections', 'scores', 'merges', 'ml'
  const [detections, setDetections] = useState([]);
  const [scores, setScores] = useState([]);
  const [merges, setMerges] = useState([]);
  const [mlModels, setMLModels] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    confidence_level: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadData();
    loadStatistics();
  }, [activeView, filters]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (activeView === 'detections') {
        const data = await deduplicationAPI.getDetections(filters);
        setDetections(Array.isArray(data) ? data : data.results || []);
      } else if (activeView === 'scores') {
        const data = await deduplicationAPI.getSimilarityScores(filters);
        setScores(Array.isArray(data) ? data : data.results || []);
      } else if (activeView === 'merges') {
        const data = await deduplicationAPI.getMergeCandidates(filters);
        setMerges(Array.isArray(data) ? data : data.results || []);
      } else if (activeView === 'ml') {
        const data = await deduplicationAPI.getMLModels();
        setMLModels(Array.isArray(data) ? data : data.results || []);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      if (activeView === 'detections') {
        const stats = await deduplicationAPI.getDetectionStatistics();
        setStatistics(stats);
      } else if (activeView === 'merges') {
        const stats = await deduplicationAPI.getMergeStatistics();
        setStatistics(stats);
      } else if (activeView === 'ml') {
        const stats = await deduplicationAPI.getMLStatistics();
        setStatistics(stats);
      }
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const handleBatchDetect = async () => {
    if (!window.confirm('Lancer la détection sur toute la base de données ?')) return;
    
    try {
      await deduplicationAPI.batchDetectAll({ threshold: 0.85 });
      alert('Détection batch lancée ! Les résultats seront disponibles dans quelques minutes.');
      await loadData();
    } catch (error) {
      console.error('Erreur batch detect:', error);
      alert('Erreur lors du lancement de la détection');
    }
  };

  const handleExecuteMerge = async (mergeId) => {
    if (!window.confirm('Confirmer la fusion de ces doublons ?')) return;

    try {
      await deduplicationAPI.executeMerge(mergeId);
      alert('Fusion effectuée avec succès !');
      await loadData();
    } catch (error) {
      console.error('Erreur fusion:', error);
      alert('Erreur lors de la fusion');
    }
  };

  const handleDeployModel = async (modelId) => {
    if (!window.confirm('Déployer ce modèle en production ?')) return;

    try {
      await deduplicationAPI.deployModel(modelId);
      alert('Modèle déployé en production !');
      await loadData();
    } catch (error) {
      console.error('Erreur déploiement:', error);
      alert('Erreur lors du déploiement');
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<AlertTriangle />}
          label="Doublons détectés"
          value={statistics?.total || 0}
          color="yellow"
        />
        <StatCard
          icon={<Users />}
          label="Haute confiance"
          value={statistics?.high_confidence || 0}
          color="red"
        />
        <StatCard
          icon={<CheckCircle />}
          label="Révisés"
          value={statistics?.reviewed || 0}
          color="green"
        />
        <StatCard
          icon={<Brain />}
          label="ML Accuracy"
          value={`${((statistics?.ml_accuracy || 0) * 100).toFixed(1)}%`}
          color="blue"
        />
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[
              { id: 'detections', label: 'Détections', icon: AlertTriangle },
              { id: 'scores', label: 'Scores', icon: Activity },
              { id: 'merges', label: 'Fusions', icon: GitMerge },
              { id: 'ml', label: 'ML Models', icon: Brain }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeView === 'detections' && (
            <button
              onClick={handleBatchDetect}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Zap size={18} />
              Détection Batch
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.confidence_level}
            onChange={(e) => setFilters({ ...filters, confidence_level: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les niveaux</option>
            <option value="HIGH">Haute confiance</option>
            <option value="MEDIUM">Confiance moyenne</option>
            <option value="LOW">Faible confiance</option>
          </select>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <>
            {activeView === 'detections' && (
              <DetectionsView
                detections={detections}
                onSelect={setSelectedItem}
              />
            )}

            {activeView === 'scores' && (
              <ScoresView
                scores={scores}
                onSelect={setSelectedItem}
              />
            )}

            {activeView === 'merges' && (
              <MergesView
                merges={merges}
                onExecute={handleExecuteMerge}
                onSelect={setSelectedItem}
              />
            )}

            {activeView === 'ml' && (
              <MLModelsView
                models={mlModels}
                onDeploy={handleDeployModel}
              />
            )}
          </>
        )}
      </div>

      {/* Modal détail */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          type={activeView}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

// ==================== STAT CARD ====================

function StatCard({ icon, label, value, color }) {
  const colors = {
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

// ==================== VUE DÉTECTIONS ====================

function DetectionsView({ detections, onSelect }) {
  const getConfidenceBadge = (level) => {
    const styles = {
      HIGH: 'bg-red-100 text-red-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-green-100 text-green-800'
    };
    return styles[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-3">
      {detections.map(detection => (
        <div
          key={detection.id}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => onSelect(detection)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <AlertTriangle className="text-yellow-600" size={24} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-800">
                    {detection.primary_person_name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadge(detection.confidence_level)}`}>
                    {detection.confidence_level}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {detection.total_duplicates_found} doublons potentiels • 
                  {' '}{detection.overall_confidence_score.toFixed(1)}% confiance •
                  {' '}{detection.detection_method}
                </p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>

          {detection.requires_manual_review && (
            <div className="mt-2 flex items-center gap-2 text-sm text-orange-600">
              <Shield size={14} />
              <span>Révision manuelle requise</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== VUE SCORES ====================

function ScoresView({ scores, onSelect }) {
  return (
    <div className="space-y-3">
      {scores.map(score => (
        <div
          key={score.id}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => onSelect(score)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={20} />
              <div>
                <h4 className="font-medium text-gray-800">
                  {score.person_a_name} ↔ {score.person_b_name}
                </h4>
                <p className="text-sm text-gray-600">
                  Similarité: {(score.overall_similarity_score * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {(score.overall_similarity_score * 100).toFixed(0)}%
              </div>
              {score.is_fraudulent && (
                <span className="text-xs text-red-600 font-medium">⚠ Fraude suspectée</span>
              )}
            </div>
          </div>

          {/* Scores détaillés */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {score.name_similarity !== null && (
              <div className="text-xs">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium ml-1">{(score.name_similarity * 100).toFixed(0)}%</span>
              </div>
            )}
            {score.biometric_similarity !== null && (
              <div className="text-xs">
                <span className="text-gray-600">Bio:</span>
                <span className="font-medium ml-1">{(score.biometric_similarity * 100).toFixed(0)}%</span>
              </div>
            )}
            {score.address_similarity !== null && (
              <div className="text-xs">
                <span className="text-gray-600">Adresse:</span>
                <span className="font-medium ml-1">{(score.address_similarity * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== VUE FUSIONS ====================

function MergesView({ merges, onExecute, onSelect }) {
  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      MERGED: 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-3">
      {merges.map(merge => (
        <div
          key={merge.id}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1" onClick={() => onSelect(merge)}>
              <GitMerge className="text-purple-600" size={20} />
              <div>
                <h4 className="font-medium text-gray-800">
                  Fusion #{merge.id}
                </h4>
                <p className="text-sm text-gray-600">
                  Confiance: {(merge.merge_confidence_score * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(merge.merge_status)}`}>
                {merge.merge_status}
              </span>
              {merge.merge_status === 'APPROVED' && (
                <button
                  onClick={() => onExecute(merge.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Exécuter
                </button>
              )}
            </div>
          </div>

          {merge.data_conflicts_count > 0 && (
            <div className="text-sm text-orange-600 flex items-center gap-1">
              <AlertTriangle size={14} />
              {merge.data_conflicts_count} conflits détectés
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== VUE ML MODELS ====================

function MLModelsView({ models, onDeploy }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {models.map(model => (
        <div key={model.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Brain className="text-purple-600" size={24} />
              <div>
                <h4 className="font-semibold text-gray-800">{model.model_name}</h4>
                <p className="text-sm text-gray-600">{model.model_type}</p>
              </div>
            </div>
            {model.is_active && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Production
              </span>
            )}
          </div>

          {/* Métriques */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-white rounded">
              <p className="text-xs text-gray-600">Accuracy</p>
              <p className="text-lg font-bold text-gray-800">
                {(model.accuracy * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <p className="text-xs text-gray-600">Precision</p>
              <p className="text-lg font-bold text-gray-800">
                {(model.precision * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <p className="text-xs text-gray-600">Recall</p>
              <p className="text-lg font-bold text-gray-800">
                {(model.recall * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {!model.is_active && (
            <button
              onClick={() => onDeploy(model.id)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Déployer en production
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== MODAL DÉTAIL ====================

function DetailModal({ item, type, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Détails {type}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <pre className="bg-gray-50 rounded-lg p-4 text-xs overflow-auto">
            {JSON.stringify(item, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}