/**
 * 🇬🇦 RSU Gabon - API Client CORRIGÉ
 * Standards Top 1% - Client HTTP avec JWT
 * Fichier: rsu_admin_dashboard/src/services/api/apiClient.js
 * 
 * ✅ CORRECTION: URL dynamique basée sur environnement
 */

class APIClient {
  constructor() {
    // ✅ CORRECTION DÉFINITIVE: URL dynamique selon environnement
    this.baseURL = this.getBaseURL();
    
    // Log pour debugging
    console.log('🔧 APIClient initialisé avec URL:', this.baseURL);
  }

  /**
   * Déterminer l'URL de base selon l'environnement
   */
  getBaseURL() {
    // Priorité 1: Variable d'environnement explicite
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    
    // Priorité 2: Détection automatique environnement
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // Développement local
      return 'http://localhost:8000/api/v1';
    } else {
      // Production Render
      return 'https://rsu-identity-backend.onrender.com/api/v1';
    }
  }

  /**
   * Récupérer user actuel depuis localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Requête HTTP générique
   */
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const url = `${this.baseURL}${endpoint}`;
    console.log(`🌐 ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        
        // Gestion erreur 401 (non autorisé)
        if (response.status === 401) {
          console.warn('⚠️ Token expiré, déconnexion...');
          this.logout();
          return;
        }
        
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Erreur requête:', error.message);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Déconnexion
   */
  logout() {
    console.log('🚪 Déconnexion...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  /**
   * Vérifier si utilisateur est authentifié
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
}

// Export instance singleton
const apiClient = new APIClient();
export default apiClient;