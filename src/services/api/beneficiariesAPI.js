/**
 * 🇬🇦 RSU Gabon - Beneficiaries API Service
 * Standards Top 1% - CRUD Complet
 */
import apiClient from './apiClient';

class BeneficiariesAPI {
  /**
   * Liste des bénéficiaires avec filtres et pagination
   */
  async getBeneficiaries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/identity/persons/${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Détail d'un bénéficiaire
   */
  async getBeneficiaryById(id) {
    return await apiClient.get(`/identity/persons/${id}/`);
  }

  /**
   * Créer un nouveau bénéficiaire
   */
  async createBeneficiary(data) {
    // Validation frontend avant envoi
    this.validateBeneficiary(data);
    
    return await apiClient.post('/identity/persons/', data);
  }

  /**
   * Modifier un bénéficiaire
   */
  async updateBeneficiary(id, data) {
    return await apiClient.patch(`/identity/persons/${id}/`, data);
  }

  /**
   * Supprimer un bénéficiaire
   */
  async deleteBeneficiary(id) {
    return await apiClient.delete(`/identity/persons/${id}/`);
  }

  /**
   * Vérifier un bénéficiaire
   */
  async verifyBeneficiary(id, notes = '') {
    return await apiClient.post(`/identity/persons/${id}/verify/`, {
      verification_notes: notes
    });
  }

  /**
   * Exporter les bénéficiaires
   */
  async exportBeneficiaries(format = 'csv', filters = {}) {
    const params = { ...filters, format };
    const queryString = new URLSearchParams(params).toString();
    
    // Téléchargement direct du fichier
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
  }

  /**
   * Recherche bénéficiaires par NIP ou RSU-ID
   */
  async searchByIdentifier(identifier) {
    return await apiClient.get(`/identity/persons/?search=${identifier}`);
  }

  /**
   * Statistiques bénéficiaires
   */
  async getStatistics() {
    return await apiClient.get('/identity/persons/statistics/');
  }

  /**
   * Validation données avant envoi
   */
  validateBeneficiary(data) {
    const errors = [];
    
    // Champs obligatoires
    if (!data.first_name) errors.push('Prénom requis');
    if (!data.last_name) errors.push('Nom requis');
    if (!data.birth_date) errors.push('Date de naissance requise');
    if (!data.gender) errors.push('Genre requis');
    
    // Validation téléphone Gabon
    if (data.phone_number && !this.isValidGabonPhone(data.phone_number)) {
      errors.push('Format téléphone invalide (+241 XX XX XX XX)');
    }
    
    // Validation GPS Gabon
    if (data.latitude && (data.latitude < -4.0 || data.latitude > 2.3)) {
      errors.push('Latitude hors du Gabon');
    }
    if (data.longitude && (data.longitude < 8.7 || data.longitude > 14.5)) {
      errors.push('Longitude hors du Gabon');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Validation téléphone gabonais
   */
  isValidGabonPhone(phone) {
    // Format: +241 XX XX XX XX
    const regex = /^\+241\s(05|06|07)\s\d{2}\s\d{2}\s\d{2}$/;
    return regex.test(phone);
  }
}

export default new BeneficiariesAPI();