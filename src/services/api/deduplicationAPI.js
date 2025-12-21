/**
 * 🇬🇦 RSU Gabon - Deduplication API Service
 * Standards Top 1% - APIs IA Anti-Fraude
 * Fichier: rsu_admin_dashboard_v1/src/services/api/deduplicationAPI.js
 */

import apiClient from './apiClient';

export const deduplicationAPI = {
  // ==================== DÉTECTION DE DOUBLONS ====================

  /**
   * Récupérer toutes les détections
   */
  getDetections: async (filters = {}) => {
    return await apiClient.get('/deduplication/detections/', { params: filters });
  },

  /**
   * Détail d'une détection
   */
  getDetectionDetail: async (detectionId) => {
    return await apiClient.get(`/deduplication/detections/${detectionId}/`);
  },

  /**
   * Lancer détection pour une personne
   */
  detectForPerson: async (personId, options = {}) => {
    return await apiClient.post('/deduplication/detections/detect_for_person/', {
      person_id: personId,
      detection_method: options.method || 'AUTOMATIC',
      threshold: options.threshold || 0.8
    });
  },

  /**
   * Détection batch sur toute la base
   */
  batchDetectAll: async (options = {}) => {
    return await apiClient.post('/deduplication/detections/batch_detect_all/', {
      detection_method: options.method || 'BATCH',
      threshold: options.threshold || 0.85,
      limit: options.limit || 100
    });
  },

  /**
   * Statistiques détections
   */
  getDetectionStatistics: async () => {
    return await apiClient.get('/deduplication/detections/statistics/');
  },

  /**
   * Statistiques globales deduplication
   */
  getStatistics: async () => {
    return await apiClient.get('/deduplication/detections/statistics/');
  },

  /**
   * Marquer comme faux positif
   */
  markFalsePositive: async (detectionId, notes = '') => {
    return await apiClient.patch(`/deduplication/detections/${detectionId}/`, {
      false_positive: true,
      detection_notes: notes
    });
  },

  // ==================== SCORES DE SIMILARITÉ ====================

  /**
   * Récupérer scores de similarité
   */
  getSimilarityScores: async (filters = {}) => {
    return await apiClient.get('/deduplication/scores/', { params: filters });
  },

  /**
   * Scores haute confiance (>90%)
   */
  getHighConfidenceScores: async () => {
    return await apiClient.get('/deduplication/scores/high_confidence/');
  },

  /**
   * Scores nécessitant révision manuelle
   */
  getScoresRequiringReview: async () => {
    return await apiClient.get('/deduplication/scores/requires_review/');
  },

  /**
   * Suspicion de fraude
   */
  getFraudSuspected: async () => {
    return await apiClient.get('/deduplication/scores/fraud_suspected/');
  },

  /**
   * Marquer score comme révisé
   */
  markScoreReviewed: async (scoreId, decision, notes = '') => {
    return await apiClient.post(`/deduplication/scores/${scoreId}/mark_reviewed/`, {
      decision,
      notes
    });
  },

  /**
   * Détail score de similarité
   */
  getScoreDetail: async (scoreId) => {
    return await apiClient.get(`/deduplication/scores/${scoreId}/`);
  },

  // ==================== FUSION DE DOUBLONS ====================

  /**
   * Récupérer candidats de fusion
   */
  getMergeCandidates: async (filters = {}) => {
    return await apiClient.get('/deduplication/merges/', { params: filters });
  },

  /**
   * Fusion en attente
   */
  getPendingMerges: async () => {
    return await apiClient.get('/deduplication/merges/pending/');
  },

  /**
   * Statistiques fusions
   */
  getMergeStatistics: async () => {
    return await apiClient.get('/deduplication/merges/statistics/');
  },

  /**
   * Créer candidat de fusion
   */
  createMergeCandidate: async (data) => {
    return await apiClient.post('/deduplication/merges/', data);
  },

  /**
   * Exécuter fusion
   */
  executeMerge: async (mergeId) => {
    return await apiClient.post(`/deduplication/merges/${mergeId}/execute_merge/`);
  },

  /**
   * Annuler fusion (rollback)
   */
  rollbackMerge: async (mergeId, reason = '') => {
    return await apiClient.post(`/deduplication/merges/${mergeId}/rollback/`, {
      reason
    });
  },

  /**
   * Détail candidat de fusion
   */
  getMergeDetail: async (mergeId) => {
    return await apiClient.get(`/deduplication/merges/${mergeId}/`);
  },

  /**
   * Approuver fusion
   */
  approveMerge: async (mergeId) => {
    return await apiClient.patch(`/deduplication/merges/${mergeId}/`, {
      merge_decision: 'APPROVED'
    });
  },

  /**
   * Rejeter fusion
   */
  rejectMerge: async (mergeId, reason = '') => {
    return await apiClient.patch(`/deduplication/merges/${mergeId}/`, {
      merge_decision: 'REJECTED',
      merge_notes: reason
    });
  },

  // ==================== MODÈLES ML ====================

  /**
   * Récupérer modèles ML
   */
  getMLModels: async () => {
    return await apiClient.get('/deduplication/ml-models/');
  },

  /**
   * Modèles en production
   */
  getProductionModels: async () => {
    return await apiClient.get('/deduplication/ml-models/production_models/');
  },

  /**
   * Statistiques modèles
   */
  getMLStatistics: async () => {
    return await apiClient.get('/deduplication/ml-models/statistics/');
  },

  /**
   * Comparer modèles
   */
  compareModels: async (modelIds) => {
    return await apiClient.post('/deduplication/ml-models/compare_models/', {
      model_ids: modelIds
    });
  },

  /**
   * Déployer modèle en production
   */
  deployModel: async (modelId) => {
    return await apiClient.post(`/deduplication/ml-models/${modelId}/deploy/`);
  },

  /**
   * Détail modèle ML
   */
  getModelDetail: async (modelId) => {
    return await apiClient.get(`/deduplication/ml-models/${modelId}/`);
  },

  /**
   * Entraîner nouveau modèle
   */
  trainModel: async (config) => {
    return await apiClient.post('/deduplication/ml-models/', config);
  },

  // ==================== RECHERCHE GLOBALE ====================

  /**
   * Rechercher duplicats potentiels (depuis identity)
   */
  searchDuplicates: async (personData) => {
    return await apiClient.post('/identity/persons/search_duplicates/', personData);
  },

  /**
   * Dashboard deduplication (vue d'ensemble)
   */
  getDashboard: async () => {
    return await apiClient.get('/deduplication/dashboard/');
  }
};

export default deduplicationAPI;