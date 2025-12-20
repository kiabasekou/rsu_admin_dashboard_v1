/**
 * 🇬🇦 RSU GABON - SIMILARITY SCORES COMPONENT
 * Standards Top 1% - Production Ready
 * 
 * Fichier: src/components/Dashboard/DeduplicationTab/SimilarityScores.jsx
 * 
 * BASÉ SUR LE MODÈLE BACKEND RÉEL:
 * - apps/deduplication/models/similarity_score.py (SimilarityScore)
 * - apps/deduplication/serializers/dedup_serializers.py (SimilarityScoreSerializer)
 * - apps/deduplication/views/dedup_views.py (SimilarityScoreViewSet)
 * 
 * CHAMPS MODÈLE (Source of Truth):
 * - id, detection, person_a, person_b, person_a_name, person_b_name
 * - overall_similarity_score, match_quality
 * - name_similarity, birth_date_similarity, phone_similarity
 * - address_similarity, geographic_similarity, nip_similarity, biometric_similarity
 * - algorithm_scores, phonetic_match, levenshtein_distance, fuzzy_ratio
 * - match_decision, match_confidence
 * - fraud_indicators, is_fraudulent
 * - manually_reviewed, review_decision, review_notes
 * 
 * API ENDPOINTS:
 * - GET /api/v1/deduplication/scores/
 * - POST /api/v1/deduplication/scores/{id}/mark_reviewed/
 */

import React, { useState, useEffect } from 'react';
import {
  Users, AlertTriangle, CheckCircle, Eye, XCircle,
  RefreshCw, Filter, ChevronDown, ChevronUp, Shield,
  User, Phone, MapPin, Calendar, Hash, Fingerprint
} from 'lucide-react';
import apiClient from '../../../services/api/apiClient';


// ============================================================================
// CONFIGURATION
// ============================================================================

const MATCH_DECISIONS = {
  DEFINITE_MATCH: { 
    label: 'Correspondance Certaine', 
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: AlertTriangle,
    priority: 5
  },
  PROBABLE_MATCH: { 
    label: 'Correspondance Probable', 
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: AlertTriangle,
    priority: 4
  },
  POSSIBLE_MATCH: { 
    label: 'Correspondance Possible', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Eye,
    priority: 3
  },
  UNLIKELY_MATCH: { 
    label: 'Correspondance Improbable', 
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: CheckCircle,
    priority: 2
  },
  NOT_MATCH: { 
    label: 'Pas de Correspondance', 
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: XCircle,
    priority: 1
  },
  UNDECIDED: { 
    label: 'Indécis', 
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: Eye,
    priority: 3
  }
};

const MATCH_QUALITY = {
  EXCELLENT: { label: 'Excellent', color: 'text-red-600' },
  VERY_GOOD: { label: 'Très Bon', color: 'text-orange-600' },
  GOOD: { label: 'Bon', color: 'text-yellow-600' },
  FAIR: { label: 'Moyen', color: 'text-blue-600' },
  POOR: { label: 'Faible', color: 'text-green-600' }
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function SimilarityScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedScores, setExpandedScores] = useState(new Set());
  const [filters, setFilters] = useState({
    match_decision: '',
    is_fraudulent: '',
    manually_reviewed: '',
    ordering: '-overall_similarity_score'
  });

  useEffect(() => {
    loadScores();
  }, [filters]);

  // ==========================================================================
  // CHARGEMENT DES SCORES
  // ==========================================================================

  const loadScores = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/deduplication/scores/', {
        params: filters
      });

      const data = response.results || response;
      setScores(Array.isArray(data) ? data : []);
      
      console.log(`✅ ${scores.length} scores de similarité chargés`);

    } catch (err) {
      console.error('❌ Erreur chargement scores:', err);
      setError(err.response?.data?.detail || 'Erreur de chargement');
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // MARQUER COMME RÉVISÉ
  // ==========================================================================

  const handleMarkReviewed = async (scoreId, decision, notes = '') => {
    try {
      console.log(`✅ Révision score ${scoreId}...`);

      await apiClient.post(`/deduplication/scores/${scoreId}/mark_reviewed/`, {
        decision,
        notes
      });

      alert('Score marqué comme révisé');
      await loadScores();

    } catch (err) {
      console.error('❌ Erreur révision:', err);
      alert(err.response?.data?.error || 'Erreur lors de la révision');
    }
  };

  // ==========================================================================
  // TOGGLE EXPANSION
  // ==========================================================================

  const toggleExpanded = (scoreId) => {
    const newExpanded = new Set(expandedScores);
    if (newExpanded.has(scoreId)) {
      newExpanded.delete(scoreId);
    } else {
      newExpanded.add(scoreId);
    }
    setExpandedScores(newExpanded);
  };

  // ==========================================================================
  // RENDER SCORE BAR
  // ==========================================================================

const renderScoreBar = (score, label, Icon) => {
    const percentage = score || 0;
    let colorClass = 'bg-green-500';
    
    if (percentage >= 90) {
      colorClass = 'bg-red-500';
    } else if (percentage >= 75) {
      colorClass = 'bg-orange-500';
    } else if (percentage >= 50) {
      colorClass = 'bg-yellow-500';
    } else if (percentage >= 25) {
      colorClass = 'bg-blue-500';
    }

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            {/* L'argument Icon est utilisé ici comme un composant React */}
            <Icon className="w-3 h-3" />
            <span>{label}</span>
          </div>
          <span className="font-semibold text-gray-900">
            {typeof percentage === 'number' ? percentage.toFixed(0) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${colorClass} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER OVERALL SCORE BADGE
  // ==========================================================================

  const renderOverallScoreBadge = (score) => {
    let colorClass = 'bg-green-100 text-green-800';
    let icon = '✅';
    
    if (score >= 95) {
      colorClass = 'bg-red-100 text-red-800';
      icon = '🔥';
    } else if (score >= 80) {
      colorClass = 'bg-orange-100 text-orange-800';
      icon = '⚠️';
    } else if (score >= 60) {
      colorClass = 'bg-yellow-100 text-yellow-800';
      icon = '👀';
    } else if (score >= 40) {
      colorClass = 'bg-blue-100 text-blue-800';
      icon = 'ℹ️';
    }

    return (
      <div className={`px-3 py-1 rounded-full ${colorClass} font-bold text-lg`}>
        {icon} {score.toFixed(1)}%
      </div>
    );
  };

  // ==========================================================================
  // RENDER LOADING
  // ==========================================================================

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-24 h-10 bg-gray-200 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadScores}
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
            <Users className="w-7 h-7 text-blue-600" />
            Scores de Similarité
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {scores.length} comparaison{scores.length > 1 ? 's' : ''} détectée{scores.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filtres */}
          <select
            value={filters.match_decision}
            onChange={(e) => setFilters({ ...filters, match_decision: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les décisions</option>
            <option value="DEFINITE_MATCH">Correspondance Certaine</option>
            <option value="PROBABLE_MATCH">Correspondance Probable</option>
            <option value="POSSIBLE_MATCH">Correspondance Possible</option>
            <option value="UNLIKELY_MATCH">Improbable</option>
            <option value="NOT_MATCH">Pas de Correspondance</option>
          </select>

          <select
            value={filters.is_fraudulent}
            onChange={(e) => setFilters({ ...filters, is_fraudulent: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Fraude: Tous</option>
            <option value="true">Fraude suspectée</option>
            <option value="false">Pas de fraude</option>
          </select>

          <select
            value={filters.manually_reviewed}
            onChange={(e) => setFilters({ ...filters, manually_reviewed: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Révision: Tous</option>
            <option value="true">Révisés</option>
            <option value="false">Non révisés</option>
          </select>

          {/* Refresh */}
          <button
            onClick={loadScores}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Actualiser</span>
          </button>
        </div>
      </div>

      {/* LISTE DES SCORES */}
      {scores.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun score de similarité
          </h3>
          <p className="text-gray-500">
            Les comparaisons de doublons apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map(score => {
            const isExpanded = expandedScores.has(score.id);
            const matchConfig = MATCH_DECISIONS[score.match_decision] || MATCH_DECISIONS.UNDECIDED;
            const MatchIcon = matchConfig.icon;
            const qualityConfig = MATCH_QUALITY[score.match_quality] || MATCH_QUALITY.POOR;

            return (
              <div
                key={score.id}
                className={`bg-white rounded-lg shadow-md border-l-4 ${
                  score.is_fraudulent ? 'border-red-500' : 'border-blue-500'
                } p-6 hover:shadow-lg transition-shadow`}
              >
                {/* HEADER */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Personnes comparées */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {score.person_a_name}
                        </span>
                      </div>
                      <span className="text-gray-400">↔</span>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-900">
                          {score.person_b_name}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${matchConfig.color}`}>
                        <MatchIcon className="w-3 h-3" />
                        {matchConfig.label}
                      </span>
                      
                      <span className={`text-xs font-semibold ${qualityConfig.color}`}>
                        Qualité: {qualityConfig.label}
                      </span>

                      {score.is_fraudulent && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                          <Shield className="w-3 h-3" />
                          Fraude Suspectée
                        </span>
                      )}

                      {score.manually_reviewed && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                          <CheckCircle className="w-3 h-3" />
                          Révisé
                        </span>
                      )}

                      {score.phonetic_match && (
                        <span className="text-xs text-purple-600 font-semibold">
                          🔊 Match Phonétique
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score global */}
                  <div className="ml-4">
                    {renderOverallScoreBadge(score.overall_similarity_score)}
                  </div>
                </div>

                {/* SCORES PAR CHAMP (Aperçu) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {renderScoreBar(score.name_similarity, 'Nom', User)}
                  {renderScoreBar(score.birth_date_similarity, 'Date Naiss.', Calendar)}
                  {renderScoreBar(score.phone_similarity, 'Téléphone', Phone)}
                </div>

                {/* INDICATEURS FRAUDE */}
                {score.fraud_indicators && score.fraud_indicators.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-800 mb-1">
                          Indicateurs de Fraude:
                        </p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {score.fraud_indicators.map((indicator, idx) => (
                            <li key={idx}>• {indicator}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* DÉTAILS EXPANDABLES */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Scores détaillés */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Scores Détaillés
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {renderScoreBar(score.address_similarity, 'Adresse', MapPin)}
                        {renderScoreBar(score.geographic_similarity, 'Géographie', MapPin)}
                        {renderScoreBar(score.nip_similarity, 'NIP', Hash)}
                        {score.biometric_similarity !== null && renderScoreBar(
                          score.biometric_similarity, 
                          'Biométrie', 
                          Fingerprint
                        )}
                      </div>
                    </div>

                    {/* Algorithmes */}
                    {score.algorithm_scores && Object.keys(score.algorithm_scores).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Algorithmes Utilisés
                        </h4>
                        <div className="bg-gray-50 rounded p-3 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            {score.levenshtein_distance !== null && (
                              <div>
                                <span className="text-gray-600">Levenshtein:</span>{' '}
                                <span className="font-semibold">{score.levenshtein_distance}</span>
                              </div>
                            )}
                            {score.fuzzy_ratio !== null && (
                              <div>
                                <span className="text-gray-600">Fuzzy Ratio:</span>{' '}
                                <span className="font-semibold">{score.fuzzy_ratio.toFixed(1)}%</span>
                              </div>
                            )}
                            {score.match_confidence !== null && (
                              <div>
                                <span className="text-gray-600">Confiance:</span>{' '}
                                <span className="font-semibold">
                                  {(score.match_confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes révision */}
                    {score.review_notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Notes de Révision
                        </h4>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">
                          {score.review_notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toggleExpanded(score.id)}
                    className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Moins de détails
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Plus de détails
                      </>
                    )}
                  </button>

                  {!score.manually_reviewed && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkReviewed(score.id, 'DEFINITE_MATCH', 'Confirmé comme doublon')}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Marquer Doublon
                      </button>
                      <button
                        onClick={() => handleMarkReviewed(score.id, 'NOT_MATCH', 'Confirmé distinct')}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Marquer Distinct
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}