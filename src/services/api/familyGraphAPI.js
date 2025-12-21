/**
 * 🇬🇦 RSU Gabon - Family Graph API Service
 * Standards Top 1% - APIs Graphe Familial & Réseaux
 * Fichier: rsu_admin_dashboard_v1/src/services/api/familyGraphAPI.js
 */

import apiClient from './apiClient';

export const familyGraphAPI = {
  // ==================== RELATIONSHIPS (RELATIONS FAMILIALES) ====================

  /**
   * Récupérer toutes les relations familiales
   */
  getRelationships: async (filters = {}) => {
    return await apiClient.get('/family-graph/relationships/', { params: filters });
  },

  /**
   * Récupérer relations pour une personne spécifique
   */
  getRelationshipsByPerson: async (personId) => {
    return await apiClient.get('/family-graph/relationships/person_relationships/', {
      params: { person_id: personId }
    });
  },

  /**
   * Créer nouvelle relation familiale
   */
  createRelationship: async (data) => {
    return await apiClient.post('/family-graph/relationships/', data);
  },

  /**
   * Détail d'une relation
   */
  getRelationshipDetail: async (relationshipId) => {
    return await apiClient.get(`/family-graph/relationships/${relationshipId}/`);
  },

  /**
   * Modifier une relation
   */
  updateRelationship: async (relationshipId, data) => {
    return await apiClient.patch(`/family-graph/relationships/${relationshipId}/`, data);
  },

  /**
   * Supprimer une relation
   */
  deleteRelationship: async (relationshipId) => {
    return await apiClient.delete(`/family-graph/relationships/${relationshipId}/`);
  },

  /**
   * Vérifier une relation (action custom)
   */
  verifyRelationship: async (relationshipId, data = {}) => {
    return await apiClient.post(`/family-graph/relationships/${relationshipId}/verify/`, data);
  },

  // ==================== HOUSEHOLD NETWORKS (RÉSEAUX DE MÉNAGES) ====================

  /**
   * Récupérer tous les réseaux
   */
  getNetworks: async (filters = {}) => {
    return await apiClient.get('/family-graph/networks/', { params: filters });
  },

  /**
   * Créer réseau depuis un ménage
   */
  createNetworkFromHousehold: async (data) => {
    return await apiClient.post('/family-graph/networks/', data);
  },

  /**
   * Détail d'un réseau
   */
  getNetworkDetail: async (networkId) => {
    return await apiClient.get(`/family-graph/networks/${networkId}/`);
  },

  /**
   * Modifier un réseau
   */
  updateNetwork: async (networkId, data) => {
    return await apiClient.patch(`/family-graph/networks/${networkId}/`, data);
  },

  /**
   * Supprimer un réseau
   */
  deleteNetwork: async (networkId) => {
    return await apiClient.delete(`/family-graph/networks/${networkId}/`);
  },

  // ==================== DEPENDENCY ANALYSIS (ANALYSES DE DÉPENDANCES) ====================

  /**
   * Récupérer toutes les analyses de dépendances
   */
  getDependencies: async (filters = {}) => {
    return await apiClient.get('/family-graph/dependencies/', { params: filters });
  },

  /**
   * Analyser dépendances d'un ménage
   */
  analyzeHousehold: async (householdId) => {
    return await apiClient.post('/family-graph/dependencies/', {
      household_id: householdId
    });
  },

  /**
   * Détail d'une analyse de dépendance
   */
  getDependencyDetail: async (dependencyId) => {
    return await apiClient.get(`/family-graph/dependencies/${dependencyId}/`);
  },

  /**
   * Modifier une analyse
   */
  updateDependency: async (dependencyId, data) => {
    return await apiClient.patch(`/family-graph/dependencies/${dependencyId}/`, data);
  },

  /**
   * Supprimer une analyse
   */
  deleteDependency: async (dependencyId) => {
    return await apiClient.delete(`/family-graph/dependencies/${dependencyId}/`);
  },

  // ==================== STATISTIQUES & DASHBOARD ====================

  /**
   * Statistiques globales Family Graph
   */
  getStatistics: async () => {
    return await apiClient.get('/family-graph/statistics/');
  },

  /**
   * Dashboard Family Graph (vue d'ensemble)
   */
  getDashboard: async () => {
    return await apiClient.get('/family-graph/dashboard/');
  }
};

export default familyGraphAPI;