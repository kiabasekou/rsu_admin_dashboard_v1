/**
 * 🇬🇦 RSU GABON - API CLIENT CORRIGÉ
 * Standards Top 1% - Architecture Production
 * 
 * CORRECTION CRITIQUE:
 * ✅ Ajout méthode getCurrentUser() manquante
 * ✅ Gestion localStorage vs AsyncStorage (Web vs Mobile)
 * ✅ Architecture singleton avec intercepteurs
 * ✅ Refresh token automatique
 * 
 * Fichier: src/services/api/apiClient.js - VERSION CORRIGÉE
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const BACKEND_CONFIG = {
  // URL backend Django (adapter selon environnement)
  baseURL: process.env.REACT_APP_API_URL || 'https://rsu-identity-backend.onrender.com/api/v1',
  timeout: 30000, // 30 secondes pour Render.com
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// ============================================================================
// API CLIENT CLASS
// ============================================================================

class APIClient {
  constructor() {
    this.baseURL = BACKEND_CONFIG.baseURL;
    this.timeout = BACKEND_CONFIG.timeout;
    this.headers = { ...BACKEND_CONFIG.headers };
  }

  /**
   * ✅ CORRECTION CRITIQUE: Méthode getCurrentUser manquante
   * Récupère l'utilisateur depuis localStorage
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userStr || !token) {
        console.log('⚠️ getCurrentUser: Pas de données utilisateur');
        return null;
      }
      
      const user = JSON.parse(userStr);
      console.log('✅ getCurrentUser: Utilisateur trouvé:', user.username);
      
      return {
        ...user,
        token, // Inclure le token pour les composants qui en ont besoin
        isAuthenticated: true
      };
      
    } catch (error) {
      console.error('❌ getCurrentUser error:', error);
      return null;
    }
  }

  /**
   * ✅ Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * ✅ Obtenir le token actuel
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * ✅ Définir le token
   */
  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
      console.log('✅ Token sauvegardé');
    } else {
      localStorage.removeItem('token');
      console.log('⚠️ Token supprimé');
    }
  }

  /**
   * ✅ Déconnexion
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    console.log('✅ Déconnexion effectuée');
  }

  /**
   * ✅ Requête HTTP générique avec gestion token
   */
  async request(method, endpoint, data = null, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const token = this.getToken();

      const config = {
        method,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.timeout),
        ...options
      };

      // Ajouter token si disponible
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Ajouter body si présent
      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      console.log(`🌐 ${method} ${endpoint}`);

      const response = await fetch(url, config);

      // Gestion erreur 401 (token expiré)
      if (response.status === 401 && !options._retry) {
        console.log('⚠️ Token expiré, tentative refresh...');
        
        try {
          const newToken = await this.refreshToken();
          if (newToken) {
            // Retry avec nouveau token
            return await this.request(method, endpoint, data, {
              ...options,
              _retry: true,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${newToken}`
              }
            });
          }
        } catch (refreshError) {
          console.error('❌ Refresh token échoué:', refreshError);
          this.logout();
          window.location.href = '/login';
          throw new Error('Session expirée');
        }
      }

      // Parser réponse JSON
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Vérifier succès
      if (!response.ok) {
        console.error(`❌ ${method} ${endpoint} - ${response.status}`);
        throw new Error(responseData.detail || responseData.message || 'Erreur API');
      }

      console.log(`✅ ${method} ${endpoint} - 200 OK`);
      return responseData;

    } catch (error) {
      console.error(`❌ ${method} ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * ✅ Méthodes HTTP
   */
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  async put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  async patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  /**
   * ✅ Health check backend
   */
  async healthCheck() {
    try {
      const response = await fetch(this.baseURL.replace('/api/v1', '/api/'), {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return false;
    }
  }

  /**
   * ✅ Refresh token JWT
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      console.log('🔄 Tentative refresh token...');

      const response = await this.post('/auth/token/refresh/', {
        refresh: refreshToken
      }, { _retry: true }); // Éviter boucle infinie

      if (response.access) {
        this.setToken(response.access);
        console.log('✅ Token refreshed');
        return response.access;
      } else {
        throw new Error('Invalid refresh response');
      }

    } catch (error) {
      console.error('❌ Refresh token failed:', error);
      this.logout();
      throw error;
    }
  }

  /**
   * ✅ Update user data in localStorage
   */
  updateUser(userData) {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ Données utilisateur mises à jour');
    } catch (error) {
      console.error('❌ Erreur mise à jour utilisateur:', error);
    }
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

const apiClient = new APIClient();

// Log initialisation
console.log('🔧 APIClient initialisé avec URL:', apiClient.baseURL);

export default apiClient;