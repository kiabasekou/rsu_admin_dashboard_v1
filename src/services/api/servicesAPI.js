/**
 * 🇬🇦 RSU GABON - Services API FINAL
 * Standards Top 1% - URLs corrigées (sans /api/v1/)
 * 
 * ✅ CORRECTION CRITIQUE:
 * - apiClient.js ajoute DÉJÀ /api/v1/ au début
 * - Ne PAS mettre /api/v1/ dans les URLs ici
 * 
 * Fichier: src/services/api/servicesAPI.js
 */

import apiClient from './apiClient';

const servicesAPI = {
  /**
   * ✅ CORRIGÉ: URL sans /api/v1/ (apiClient l'ajoute automatiquement)
   * URL finale: /api/v1/services/eligibility/recommended_programs/
   */
  getRecommendedPrograms: async (personId, minScore = 60.0) => {
    try {
      // ✅ PAS de /api/v1/ ici - apiClient l'ajoute !
      const url = `/services/eligibility/recommended_programs/?person_id=${personId}&min_score=${minScore}`;
      
      console.log('🎯 getRecommendedPrograms URL:', url);
      
      const response = await apiClient.get(url);
      // Juste après la ligne 26 de servicesAPI.js
      console.log('📊 Programmes reçus:', response);
      console.log('📊 Nombre:', response?.length || 0);
      return response;
    } catch (error) {
      console.error('❌ Erreur getRecommendedPrograms:', error);
      throw error;
    }
  },

  /**
   * Calculer la vulnérabilité d'une personne
   */
  calculateVulnerability: async (personId) => {
    try {
      console.log('🧮 POST /services/vulnerability-assessments/calculate/');
      console.log('   person_id:', personId);
      console.log('   assessed_by:', null);
      
      const response = await apiClient.post(
        '/services/vulnerability-assessments/calculate/',
        { person_id: personId }
      );
      
      console.log('✅ Vulnérabilité calculée:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Erreur calculateVulnerability:', error);
      throw error;
    }
  },

  /**
   * ✅ CORRIGÉ: Calculer l'éligibilité pour un programme
   */
  calculateEligibility: async (personId, programCode) => {
    try {
      console.log('🎯 POST /services/eligibility/calculate_eligibility/');
      console.log('   person_id:', personId);
      console.log('   program_code:', programCode);
      
      const response = await apiClient.post(
        '/services/eligibility/calculate_eligibility/',
        {
          person_id: personId,
          program_code: programCode
        }
      );
      
      console.log('✅ Éligibilité calculée:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur calculateEligibility:', error);
      throw error;
    }
  },

  /**
   * Calculer l'éligibilité pour tous les programmes
   */
  calculateAllEligibility: async (personId) => {
    try {
      console.log('🎯 POST /services/eligibility/calculate_all_eligibility/');
      console.log('   person_id:', personId);
      
      const response = await apiClient.post(
        '/services/eligibility/calculate_all_eligibility/',
        { person_id: personId }
      );
      
      console.log('✅ Tous programmes calculés:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur calculateAllEligibility:', error);
      throw error;
    }
  }
};

export default servicesAPI;