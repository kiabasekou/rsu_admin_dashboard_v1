/**
 * 🇬🇦 RSU GABON - PROGRAMS API SERVICE COMPLET
 * Standards Top 1% - CORRECTION MÉTHODES MANQUANTES
 * 
 * CORRECTIONS APPLIQUÉES:
 * ✅ Ajout getEnrollments() manquante
 * ✅ Ajout getPayments() manquante
 * ✅ Ajout approveEnrollment() manquante
 * ✅ Ajout rejectEnrollment() manquante
 * ✅ Toutes les méthodes programmes complètes
 * 
 * Fichier: src/services/api/programsAPI.js - VERSION CORRIGÉE
 */

import apiClient from './apiClient';

// ============================================================================
// PROGRAMS API - COMPLET AVEC TOUTES LES MÉTHODES
// ============================================================================

export const programsAPI = {
  
  // ========== PROGRAMMES ==========
  
  /**
   * Liste programmes avec filtres
   */
  async getPrograms(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.ordering) params.append('ordering', filters.ordering);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);
    
    const queryString = params.toString();
    const url = `/programs/programs/${queryString ? `?${queryString}` : ''}`;
    
    return await apiClient.get(url);
  },

  /**
   * Détails programme par ID
   */
  async getProgramById(id) {
    return await apiClient.get(`/programs/programs/${id}/`);
  },

  /**
   * Statistiques programme
   */
  async getProgramStatistics(id) {
    return await apiClient.get(`/programs/programs/${id}/statistics/`);
  },

  /**
   * Créer nouveau programme
   */
  async createProgram(data) {
    return await apiClient.post('/programs/programs/', data);
  },

  /**
   * Modifier programme
   */
  async updateProgram(id, data) {
    return await apiClient.patch(`/programs/programs/${id}/`, data);
  },

  /**
   * Activer programme
   */
  async activateProgram(id) {
    return await apiClient.post(`/programs/programs/${id}/activate/`, {});
  },

  /**
   * Suspendre programme
   */
  async pauseProgram(id) {
    return await apiClient.post(`/programs/programs/${id}/pause/`, {});
  },

  /**
   * Clôturer programme
   */
  async closeProgram(id) {
    return await apiClient.post(`/programs/programs/${id}/close/`, {});
  },

  /**
   * Export données programme
   */
  async exportProgram(id, format = 'csv') {
    return await apiClient.get(`/programs/programs/${id}/export/?format=${format}`);
  },

  /**
   * Programmes actifs uniquement
   */
  async getActivePrograms() {
    return await apiClient.get('/programs/programs/active/');
  },

  // ========== INSCRIPTIONS (ENROLLMENTS) - ✅ AJOUTÉES ==========
  
  /**
   * ✅ CORRECTION CRITIQUE: Méthode getEnrollments manquante
   * Liste des inscriptions d'un programme
   */
  async getEnrollments(programId, filters = {}) {
    const params = new URLSearchParams();
    
    params.append('program', programId);
    
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);
    
    const queryString = params.toString();
    const url = `/programs/enrollments/?${queryString}`;
    
    console.log(`📥 Fetching enrollments for program ${programId}`);
    return await apiClient.get(url);
  },

  /**
   * Détails d'une inscription
   */
  async getEnrollmentById(id) {
    return await apiClient.get(`/programs/enrollments/${id}/`);
  },

  /**
   * ✅ CORRECTION CRITIQUE: Méthode approveEnrollment manquante
   * Approuver une inscription
   */
  async approveEnrollment(enrollmentId) {
    console.log(`✅ Approving enrollment ${enrollmentId}`);
    return await apiClient.post(`/programs/enrollments/${enrollmentId}/approve/`, {});
  },

  /**
   * ✅ CORRECTION CRITIQUE: Méthode rejectEnrollment manquante
   * Rejeter une inscription
   */
  async rejectEnrollment(enrollmentId, reason = '') {
    console.log(`❌ Rejecting enrollment ${enrollmentId}`);
    return await apiClient.post(`/programs/enrollments/${enrollmentId}/reject/`, {
      rejection_reason: reason
    });
  },

  /**
   * Suspendre une inscription
   */
  async suspendEnrollment(enrollmentId, reason = '') {
    return await apiClient.post(`/programs/enrollments/${enrollmentId}/suspend/`, {
      suspension_reason: reason
    });
  },

  /**
   * Créer inscription
   */
  async createEnrollment(data) {
    return await apiClient.post('/programs/enrollments/', data);
  },

  /**
   * Inscriptions en attente
   */
  async getPendingEnrollments() {
    return await apiClient.get('/programs/enrollments/pending/');
  },

  /**
   * Vérifier éligibilité
   */
  async checkEligibility(personId, programId) {
    return await apiClient.post('/programs/enrollments/check_eligibility/', {
      person_id: personId,
      program_id: programId
    });
  },

  /**
   * Export inscriptions
   */
  async exportEnrollments(programId, format = 'csv') {
    return await apiClient.get(`/programs/enrollments/export/?program=${programId}&format=${format}`);
  },

  // ========== PAIEMENTS (PAYMENTS) - ✅ AJOUTÉES ==========
  
  /**
   * ✅ CORRECTION CRITIQUE: Méthode getPayments manquante
   * Liste des paiements d'un programme
   */
  async getPayments(programId, filters = {}) {
    const params = new URLSearchParams();
    
    params.append('program', programId);
    
    if (filters.status) params.append('status', filters.status);
    if (filters.person) params.append('person', filters.person);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);
    
    const queryString = params.toString();
    const url = `/programs/payments/?${queryString}`;
    
    console.log(`💰 Fetching payments for program ${programId}`);
    return await apiClient.get(url);
  },

  /**
   * Détails d'un paiement
   */
  async getPaymentById(id) {
    return await apiClient.get(`/programs/payments/${id}/`);
  },

  /**
   * Créer paiement
   */
  async createPayment(data) {
    return await apiClient.post('/programs/payments/', data);
  },

  /**
   * Traiter paiement (marquer comme complété)
   */
  async processPayment(paymentId) {
    return await apiClient.post(`/programs/payments/${paymentId}/process/`, {});
  },

  /**
   * Annuler paiement
   */
  async cancelPayment(paymentId, reason = '') {
    return await apiClient.post(`/programs/payments/${paymentId}/cancel/`, {
      cancellation_reason: reason
    });
  },

  /**
   * Paiements en attente
   */
  async getPendingPayments() {
    return await apiClient.get('/programs/payments/pending/');
  },

  /**
   * Historique paiements bénéficiaire
   */
  async getPaymentHistory(personId, programId = null) {
    const params = new URLSearchParams();
    params.append('person', personId);
    if (programId) params.append('program', programId);
    
    return await apiClient.get(`/programs/payments/history/?${params.toString()}`);
  },

  /**
   * Export paiements
   */
  async exportPayments(programId, format = 'csv') {
    return await apiClient.get(`/programs/payments/export/?program=${programId}&format=${format}`);
  },

  /**
   * Générer paiements pour un programme (action en masse)
   */
  async generatePayments(programId) {
    return await apiClient.post(`/programs/programs/${programId}/generate-payments/`, {});
  },

  // ========== CATÉGORIES ==========
  
  /**
   * Liste catégories
   */
  async getCategories() {
    return await apiClient.get('/programs/categories/');
  },

  /**
   * Détails catégorie
   */
  async getCategoryById(id) {
    return await apiClient.get(`/programs/categories/${id}/`);
  },

  /**
   * Créer catégorie
   */
  async createCategory(data) {
    return await apiClient.post('/programs/categories/', data);
  },

  // ========== STATISTIQUES GLOBALES ==========
  
  /**
   * Statistiques globales programmes
   */
  async getProgramsStatistics() {
    return await apiClient.get('/programs/programs/statistics/');
  },

  /**
   * Dashboard programmes
   */
  async getProgramsDashboard() {
    return await apiClient.get('/programs/dashboard/');
  },

  // ========== RAPPORTS ==========
  
  /**
   * Rapport de performance programme
   */
  async getProgramPerformanceReport(programId, period = '30d') {
    return await apiClient.get(`/programs/programs/${programId}/performance/?period=${period}`);
  },

  /**
   * Rapport d'impact
   */
  async getImpactReport(programId) {
    return await apiClient.get(`/programs/programs/${programId}/impact/`);
  },

  // ========== VALIDATION ==========
  
  /**
   * Validation données programme avant création
   */
  validateProgram(data) {
    const errors = [];

    if (!data.code) errors.push('Code programme requis');
    if (!data.name) errors.push('Nom programme requis');
    if (!data.category) errors.push('Catégorie requise');
    if (!data.total_budget || data.total_budget <= 0) {
      errors.push('Budget total doit être > 0');
    }
    if (!data.benefit_amount || data.benefit_amount <= 0) {
      errors.push('Montant bénéfice doit être > 0');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  },

  /**
   * Validation inscription
   */
  validateEnrollment(data) {
    const errors = [];

    if (!data.program) errors.push('Programme requis');
    if (!data.person) errors.push('Bénéficiaire requis');

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  },

  /**
   * Validation paiement
   */
  validatePayment(data) {
    const errors = [];

    if (!data.program) errors.push('Programme requis');
    if (!data.person) errors.push('Bénéficiaire requis');
    if (!data.amount || data.amount <= 0) {
      errors.push('Montant doit être > 0');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  }
};

// Export par défaut
export default programsAPI;