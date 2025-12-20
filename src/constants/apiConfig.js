// =============================================================================
// 🇬🇦 RSU GABON DASHBOARD - Configuration API
// Standards Top 1% - Endpoints et configuration avec fallback production
// =============================================================================

// Déterminer l'URL de base avec fallback intelligent
const getBaseURL = () => {
  // Priorité 1 : Variable d'environnement explicite
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Priorité 2 : Détection environnement
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return 'http://localhost:8000/api/v1';
  } else {
    // Production : Backend Render
    return 'https://rsu-gabon-backend.onrender.com/api/v1';
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  
  TIMEOUT: 30000,
  
  ENDPOINTS: {
    // Authentification
    LOGIN: '/auth/token/',
    REFRESH: '/auth/token/refresh/',
    LOGOUT: '/auth/logout/',
    
    // Identity
    PERSONS: '/identity/persons/',
    HOUSEHOLDS: '/identity/households/',
    VALIDATE_NIP: '/identity/validate-nip/',
    SEARCH_DUPLICATES: '/identity/persons/search_duplicates/',
    
    // Programs
    PROGRAMS: '/programs/social-programs/',
    BENEFICIARIES: '/programs/beneficiaries/',
    ELIGIBILITY: '/programs/eligibility-checks/',
    PAYMENTS: '/programs/payments/',
    
    // Services
    VULNERABILITY_ASSESSMENT: '/services/vulnerability-scores/',
    CALCULATE_SCORE: '/services/vulnerability-scores/calculate/',
    VULNERABILITY_STATS: '/services/vulnerability-scores/statistics/',
    
    // Analytics
    DASHBOARD: '/analytics/dashboard/',
    PROVINCE_STATS: '/analytics/province-stats/',
    PROGRAM_ANALYTICS: '/analytics/program-analytics/',
    
    // Core
    USERS: '/core/users/',
    AUDIT_LOGS: '/core/audit-logs/',
  },
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuration retry
  RETRY_CONFIG: {
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
      return !error.response || error.response.status >= 500;
    },
  },
};

// Log configuration au démarrage (développement uniquement)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:');
  console.log('  Base URL:', API_CONFIG.BASE_URL);
  console.log('  Timeout:', API_CONFIG.TIMEOUT + 'ms');
}

export default API_CONFIG;