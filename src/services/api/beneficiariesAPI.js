/**
 * 🇬🇦 RSU Gabon - Beneficiaries API Service (CORRIGÉ)
 * Standards Top 1% - CRUD Complet
 * 
 * ✅ CORRECTION MAJEURE #1: Class → Objet Littéral Constant
 * ❌ AVANT: class BeneficiariesAPI { ... } + export default new BeneficiariesAPI()
 * ✅ APRÈS: const beneficiariesAPI = { ... } + export default beneficiariesAPI
 * 
 * PROBLÈME RÉSOLU:
 * - Les hooks importaient la CLASSE au lieu de l'INSTANCE
 * - Appeler beneficiariesAPI.getBeneficiaries() sur une classe retournait undefined
 * - Transformation en objet littéral = utilisable directement sans instanciation
 */

import apiClient from './apiClient';

/**
 * 🛡️ VALIDATION: Téléphone gabonais
 * Format: +241 XX XX XX XX (05/06/07)
 */
const isValidGabonPhone = (phone) => {
  const regex = /^\+241\s(05|06|07)\s\d{2}\s\d{2}\s\d{2}$/;
  return regex.test(phone);
};

/**
 * 🛡️ VALIDATION: GPS Gabon
 * Latitude: -4.0 à 2.3
 * Longitude: 8.7 à 14.5
 */
const isValidGabonGPS = (latitude, longitude) => {
  return (
    latitude >= -4.0 && latitude <= 2.3 &&
    longitude >= 8.7 && longitude <= 14.5
  );
};

/**
 * 🛡️ VALIDATION: Données bénéficiaire avant envoi
 */
const validateBeneficiary = (data) => {
  const errors = [];
  
  // Champs obligatoires
  if (!data.first_name) errors.push('Prénom requis');
  if (!data.last_name) errors.push('Nom requis');
  if (!data.birth_date) errors.push('Date de naissance requise');
  if (!data.gender) errors.push('Genre requis');
  
  // Validation téléphone Gabon
  if (data.phone_number && !isValidGabonPhone(data.phone_number)) {
    errors.push('Format téléphone invalide (+241 XX XX XX XX)');
  }
  
  // Validation GPS Gabon
  if (data.latitude && data.longitude) {
    if (!isValidGabonGPS(data.latitude, data.longitude)) {
      errors.push('Coordonnées GPS hors du Gabon');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};

// ==================== OBJET LITTÉRAL CONSTANT (SINGLETON) ====================

const beneficiariesAPI = {
  /**
   * Liste des bénéficiaires avec filtres et pagination
   * GET /api/v1/identity/persons/
   * 
   * @param {Object} params - Filtres (search, province, gender, page, page_size...)
   * @returns {Promise<Object>} { count, results: [...] }
   */
  getBeneficiaries: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/identity/persons/${queryString ? `?${queryString}` : ''}`;
      
      console.log(`📊 GET ${endpoint}`);
      const response = await apiClient.get(endpoint);
      
      console.log(`✅ Bénéficiaires chargés: ${response?.count || 0}`);
      return response; // apiClient retourne déjà { count, results }
      
    } catch (error) {
      console.error('❌ Erreur getBeneficiaries:', error);
      throw error;
    }
  },

  /**
   * Détail d'un bénéficiaire
   * GET /api/v1/identity/persons/:id/
   */
  getBeneficiaryById: async (id) => {
    if (!id) throw new Error('ID requis pour getBeneficiaryById');
    
    try {
      console.log(`📊 GET /identity/persons/${id}/`);
      return await apiClient.get(`/identity/persons/${id}/`);
    } catch (error) {
      console.error(`❌ Erreur getBeneficiaryById(${id}):`, error);
      throw error;
    }
  },

  /**
   * Créer un nouveau bénéficiaire
   * POST /api/v1/identity/persons/
   */
  createBeneficiary: async (data) => {
    // 🛡️ VALIDATION: Avant envoi
    validateBeneficiary(data);
    
    try {
      console.log('📊 POST /identity/persons/');
      const response = await apiClient.post('/identity/persons/', data);
      console.log('✅ Bénéficiaire créé:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Erreur createBeneficiary:', error);
      throw error;
    }
  },

  /**
   * Modifier un bénéficiaire
   * PATCH /api/v1/identity/persons/:id/
   */
  updateBeneficiary: async (id, data) => {
    if (!id) throw new Error('ID requis pour updateBeneficiary');
    
    try {
      console.log(`📊 PATCH /identity/persons/${id}/`);
      const response = await apiClient.patch(`/identity/persons/${id}/`, data);
      console.log('✅ Bénéficiaire modifié:', id);
      return response;
    } catch (error) {
      console.error(`❌ Erreur updateBeneficiary(${id}):`, error);
      throw error;
    }
  },

  /**
   * Supprimer un bénéficiaire
   * DELETE /api/v1/identity/persons/:id/
   */
  deleteBeneficiary: async (id) => {
    if (!id) throw new Error('ID requis pour deleteBeneficiary');
    
    try {
      console.log(`📊 DELETE /identity/persons/${id}/`);
      await apiClient.delete(`/identity/persons/${id}/`);
      console.log('✅ Bénéficiaire supprimé:', id);
    } catch (error) {
      console.error(`❌ Erreur deleteBeneficiary(${id}):`, error);
      throw error;
    }
  },

  /**
   * Vérifier un bénéficiaire
   * POST /api/v1/identity/persons/:id/verify/
   */
  verifyBeneficiary: async (id, notes = '') => {
    if (!id) throw new Error('ID requis pour verifyBeneficiary');
    
    try {
      console.log(`📊 POST /identity/persons/${id}/verify/`);
      const response = await apiClient.post(`/identity/persons/${id}/verify/`, {
        verification_notes: notes
      });
      console.log('✅ Bénéficiaire vérifié:', id);
      return response;
    } catch (error) {
      console.error(`❌ Erreur verifyBeneficiary(${id}):`, error);
      throw error;
    }
  },

  /**
   * Exporter les bénéficiaires (CSV/Excel)
   * GET /api/v1/identity/persons/export/?format=csv
   */
  exportBeneficiaries: async (format = 'csv', filters = {}) => {
    try {
      const params = { ...filters, format };
      const queryString = new URLSearchParams(params).toString();
      
      console.log(`📊 GET /identity/persons/export/?${queryString}`);
      
      // 🔒 Téléchargement direct avec authentification
      const response = await fetch(
        `${apiClient.baseURL}/identity/persons/export/?${queryString}`,
        {
          headers: {
            'Authorization': `Bearer ${apiClient.accessToken}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beneficiaires_${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Export téléchargé');
    } catch (error) {
      console.error('❌ Erreur exportBeneficiaries:', error);
      throw error;
    }
  },

  /**
   * Recherche bénéficiaires par NIP ou RSU-ID
   * GET /api/v1/identity/persons/?search=XXX
   */
  searchByIdentifier: async (identifier) => {
    if (!identifier) throw new Error('Identifiant requis pour searchByIdentifier');
    
    try {
      console.log(`📊 GET /identity/persons/?search=${identifier}`);
      return await apiClient.get(`/identity/persons/?search=${identifier}`);
    } catch (error) {
      console.error('❌ Erreur searchByIdentifier:', error);
      throw error;
    }
  },

  /**
   * Statistiques bénéficiaires
   * GET /api/v1/identity/persons/statistics/
   */
  getStatistics: async () => {
    try {
      console.log('📊 GET /identity/persons/statistics/');
      return await apiClient.get('/identity/persons/statistics/');
    } catch (error) {
      console.error('❌ Erreur getStatistics:', error);
      throw error;
    }
  }
};

// ✅ EXPORT: Objet constant directement utilisable
export default beneficiariesAPI;