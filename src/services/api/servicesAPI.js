/**
 * 🇬🇦 RSU Gabon - Services API
 * Standards Top 1% - Moteurs Vulnérabilité, Éligibilité, Géotargeting
 * Fichier: rsu_admin_dashboard_v1/src/services/api/servicesAPI.js
 * 
 * SOURCE VÉRITÉ: apps/services_app/views/*.py
 */

import apiClient from './apiClient';

export const servicesAPI = {
  // ==================== VULNERABILITY ASSESSMENTS ====================
  
  /**
   * Liste évaluations vulnérabilité
   * GET /api/v1/services/vulnerability-assessments/
   */
  getVulnerabilityAssessments: async (filters = {}) => {
    return await apiClient.get('/services/vulnerability-assessments/', {
      params: filters
    });
  },

  /**
   * Calculer vulnérabilité pour une personne
   * POST /api/v1/services/vulnerability-assessments/calculate/
   */
  calculateVulnerability: async (personId, assessedBy = null) => {
    return await apiClient.post('/services/vulnerability-assessments/calculate/', {
      person_id: personId,
      assessed_by: assessedBy
    });
  },

  /**
   * Statistiques vulnérabilité globales
   * GET /api/v1/services/vulnerability-assessments/statistics/
   */
  getVulnerabilityStatistics: async () => {
    return await apiClient.get('/services/vulnerability-assessments/statistics/');
  },

  // ==================== PROGRAM ELIGIBILITY ====================
  
  /**
   * Calculer éligibilité personne/programme
   * POST /api/v1/services/program-eligibility/calculate_eligibility/
   */
  calculateEligibility: async (personId, programCode) => {
    return await apiClient.post('/services/program-eligibility/calculate_eligibility/', {
      person_id: personId,
      program_code: programCode
    });
  },

  /**
   * Programmes recommandés pour une personne
   * GET /api/v1/services/program-eligibility/recommended_programs/
   */
  getRecommendedPrograms: async (personId, minScore = 60.0) => {
    return await apiClient.get('/services/program-eligibility/recommended_programs/', {
      params: {
        person_id: personId,
        min_score: minScore
      }
    });
  },

  /**
   * Liste éligibilités
   * GET /api/v1/services/program-eligibility/
   */
  getEligibilityList: async (filters = {}) => {
    return await apiClient.get('/services/program-eligibility/', {
      params: filters
    });
  },

  // ==================== SOCIAL PROGRAMS ====================
  
  /**
   * Liste programmes sociaux
   * GET /api/v1/services/social-programs/
   */
  getSocialPrograms: async (filters = {}) => {
    return await apiClient.get('/services/social-programs/', {
      params: filters
    });
  },

  /**
   * Détail programme social
   * GET /api/v1/services/social-programs/{id}/
   */
  getSocialProgram: async (id) => {
    return await apiClient.get(`/services/social-programs/${id}/`);
  },

  /**
   * Modifier budget programme
   * POST /api/v1/services/social-programs/{id}/modify_budget/
   */
  modifyProgramBudget: async (id, data) => {
    return await apiClient.post(`/services/social-programs/${id}/modify_budget/`, data);
  },

  /**
   * Historique budget programme
   * GET /api/v1/services/social-programs/{id}/budget_history/
   */
  getProgramBudgetHistory: async (id) => {
    return await apiClient.get(`/services/social-programs/${id}/budget_history/`);
  }
};

export default servicesAPI;