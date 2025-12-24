
/**
 * 🇬🇦 RSU Gabon - Services API (CORRIGÉ)
 * Standards Top 1% - Validation défensive + Error Handling
 * 
 * BUGS CORRIGÉS:
 * ✅ Bug #1: Validation person_id manquant dans getRecommendedPrograms
 * ✅ Bug #2: Error handling robuste pour calculateVulnerability
 * 
 * SOURCE VÉRITÉ: apps/services_app/urls.py
 * - router.register(r'eligibility', SocialProgramEligibilityViewSet)
 * - router.register(r'vulnerability-assessments', VulnerabilityAssessmentViewSet)
 */

import apiClient from './apiClient';

export const servicesAPI = {
  // ==================== VULNERABILITY ASSESSMENTS ====================

  /**
   * Liste évaluations vulnérabilité
   * GET /api/v1/services/vulnerability-assessments/
   */
  getVulnerabilityAssessments: async (filters = {}) => {
    try {
      console.log('📊 GET /services/vulnerability-assessments/', filters);
      return await apiClient.get('/services/vulnerability-assessments/', {
        params: filters
      });
    } catch (error) {
      console.error('❌ Erreur getVulnerabilityAssessments:', error);
      throw error;
    }
  },

  /**
   * ✅ CORRIGÉ: Calculer vulnérabilité pour une personne
   * POST /api/v1/services/vulnerability-assessments/calculate/
   * 
   * BUG CORRIGÉ: Gestion erreurs 500 avec messages contextuels
   */
  calculateVulnerability: async (personId, assessedBy = null) => {
    // 🛡️ VALIDATION: person_id obligatoire
    if (!personId) {
      const errorMsg = 'person_id est requis pour calculateVulnerability';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      console.log(`🧮 POST /services/vulnerability-assessments/calculate/`);
      console.log(`   person_id: ${personId}`);
      console.log(`   assessed_by: ${assessedBy || 'null'}`);

      const response = await apiClient.post('/services/vulnerability-assessments/calculate/', {
        person_id: personId,
        assessed_by: assessedBy
      });

      console.log('✅ Vulnérabilité calculée:', response);
      return response;

    } catch (error) {
      console.error('❌ Erreur calculateVulnerability:', error);

      // ✅ ENRICHISSEMENT: Messages d'erreur contextuels
      if (error.response?.status === 404) {
        throw new Error('Bénéficiaire introuvable');
      } else if (error.response?.status === 400) {
        throw new Error('Données invalides pour le calcul de vulnérabilité');
      } else if (error.response?.status === 500) {
        throw new Error('Erreur serveur lors du calcul - Contactez l\'administrateur');
      }

      throw error;
    }
  },

  /**
   * Statistiques vulnérabilité globales
   * GET /api/v1/services/vulnerability-assessments/statistics/
   */
  getVulnerabilityStatistics: async () => {
    try {
      console.log('📊 GET /services/vulnerability-assessments/statistics/');
      return await apiClient.get('/services/vulnerability-assessments/statistics/');
    } catch (error) {
      console.error('❌ Erreur getVulnerabilityStatistics:', error);
      throw error;
    }
  },

  // ==================== PROGRAM ELIGIBILITY ====================

  /**
   * Calculer éligibilité personne/programme
   * POST /api/v1/services/eligibility/calculate_eligibility/
   */
  calculateEligibility: async (personId, programCode) => {
    // 🛡️ VALIDATION: Paramètres obligatoires
    if (!personId) {
      throw new Error('person_id est requis pour calculateEligibility');
    }
    if (!programCode) {
      throw new Error('program_code est requis pour calculateEligibility');
    }

    try {
      console.log(`📊 POST /services/eligibility/calculate_eligibility/`);
      console.log(`   person_id: ${personId}`);
      console.log(`   program_code: ${programCode}`);

      const response = await apiClient.post('/services/eligibility/calculate_eligibility/', {
        person_id: personId,
        program_code: programCode
      });

      console.log('✅ Éligibilité calculée:', response);
      return response;

    } catch (error) {
      console.error('❌ Erreur calculateEligibility:', error);
      throw error;
    }
  },

  /**
   * ✅ CORRIGÉ: Programmes recommandés pour une personne
   * GET /api/v1/services/eligibility/recommended_programs/
   * 
   * BUG CORRIGÉ: Validation person_id + Error handling robuste
   */
  getRecommendedPrograms: async (personId, minScore = 60.0) => {
    // 🛡️ VALIDATION: person_id obligatoire
    if (!personId) {
      const errorMsg = 'person_id est requis pour getRecommendedPrograms';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // 🛡️ VALIDATION: minScore doit être un nombre
    const validMinScore = typeof minScore === 'number' ? minScore : 60.0;

    try {
      console.log(`📊 GET /services/eligibility/recommended_programs/`);
      console.log(`   person_id: ${personId}`);
      console.log(`   min_score: ${validMinScore}`);

      const response = await apiClient.get('/services/eligibility/recommended_programs/', {
        params: {
          person_id: personId,  // ✅ OBLIGATOIRE
          min_score: validMinScore
        }
      });

      console.log('✅ Programmes recommandés reçus:', response);
      console.log(`   Nombre: ${response?.length || 0}`);

      return response;

    } catch (error) {
      console.error('❌ Erreur getRecommendedPrograms:', error);

      // ✅ ENRICHISSEMENT: Messages d'erreur contextuels
      if (error.response?.status === 400) {
        throw new Error('Paramètres invalides - Vérifiez person_id');
      } else if (error.response?.status === 404) {
        throw new Error('Bénéficiaire introuvable');
      } else if (error.response?.status === 500) {
        throw new Error('Erreur serveur - Contactez l\'administrateur');
      }

      throw error;
    }
  },

  /**
   * Calculer éligibilité pour tous les programmes
   * POST /api/v1/services/eligibility/calculate_all_eligibility/
   */
  calculateAllEligibility: async (personId) => {
    // 🛡️ VALIDATION: person_id obligatoire
    if (!personId) {
      throw new Error('person_id est requis pour calculateAllEligibility');
    }

    try {
      console.log(`📊 POST /services/eligibility/calculate_all_eligibility/`);
      console.log(`   person_id: ${personId}`);

      const response = await apiClient.post('/services/eligibility/calculate_all_eligibility/', {
        person_id: personId
      });

      console.log('✅ Éligibilité calculée (tous programmes):', response);
      return response;

    } catch (error) {
      console.error('❌ Erreur calculateAllEligibility:', error);
      throw error;
    }
  },

  /**
   * Liste éligibilités
   * GET /api/v1/services/eligibility/
   */
  getEligibilities: async (filters = {}) => {
    try {
      console.log('📊 GET /services/eligibility/', filters);
      return await apiClient.get('/services/eligibility/', {
        params: filters
      });
    } catch (error) {
      console.error('❌ Erreur getEligibilities:', error);
      throw error;
    }
  },

  /**
   * Détail éligibilité
   * GET /api/v1/services/eligibility/:id/
   */
  getEligibility: async (id) => {
    // 🛡️ VALIDATION: id obligatoire
    if (!id) {
      throw new Error('id est requis pour getEligibility');
    }

    try {
      console.log(`📊 GET /services/eligibility/${id}/`);
      return await apiClient.get(`/services/eligibility/${id}/`);
    } catch (error) {
      console.error('❌ Erreur getEligibility:', error);
      throw error;
    }
  },

  // ==================== SOCIAL PROGRAMS ====================

  /**
   * Liste programmes sociaux
   * GET /api/v1/services/social-programs/
   */
  getSocialPrograms: async (filters = {}) => {
    try {
      console.log('📊 GET /services/social-programs/', filters);
      return await apiClient.get('/services/social-programs/', {
        params: filters
      });
    } catch (error) {
      console.error('❌ Erreur getSocialPrograms:', error);
      throw error;
    }
  },

  /**
   * Détail programme social
   * GET /api/v1/services/social-programs/:id/
   */
  getSocialProgram: async (id) => {
    // 🛡️ VALIDATION: id obligatoire
    if (!id) {
      throw new Error('id est requis pour getSocialProgram');
    }

    try {
      console.log(`📊 GET /services/social-programs/${id}/`);
      return await apiClient.get(`/services/social-programs/${id}/`);
    } catch (error) {
      console.error('❌ Erreur getSocialProgram:', error);
      throw error;
    }
  },
};

// ==================== HELPER: Validation UUID ====================

/**
 * Valide qu'une chaîne est un UUID valide
 */
const isValidUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Export par défaut
export default servicesAPI;

/**
 * 📚 DOCUMENTATION ENDPOINTS
 * 
 * BASE URL: /api/v1/services/
 * 
 * VULNERABILITY ASSESSMENTS:
 * - GET    /vulnerability-assessments/           Liste évaluations
 * - POST   /vulnerability-assessments/calculate/ Calculer score
 * - GET    /vulnerability-assessments/statistics/ Stats globales
 * 
 * ELIGIBILITY:
 * - GET    /eligibility/                          Liste éligibilités
 * - GET    /eligibility/:id/                      Détail éligibilité
 * - POST   /eligibility/calculate_eligibility/    Calculer pour 1 programme
 * - POST   /eligibility/calculate_all_eligibility/ Calculer tous programmes
 * - GET    /eligibility/recommended_programs/     Programmes recommandés
 * 
 * SOCIAL PROGRAMS:
 * - GET    /social-programs/                      Liste programmes
 * - GET    /social-programs/:id/                  Détail programme
 */

