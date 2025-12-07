// =============================================================================
// 🇬🇦 RSU GABON DASHBOARD - Configuration Environnement
// Standards Top 1% - Variables d'environnement avec fallback production
// =============================================================================

export const ENV = {
  // API URL avec fallback vers backend Render en production
  apiUrl: process.env.REACT_APP_API_URL || 'https://rsu-gabon-backend.onrender.com/api/v1',
  
  // Détection environnement
  isDevelopment: process.env.REACT_APP_ENV === 'development' || process.env.NODE_ENV === 'development',
  isProduction: process.env.REACT_APP_ENV === 'production' || process.env.NODE_ENV === 'production',
  
  // Debug mode
  debug: process.env.REACT_APP_DEBUG === 'true',
  
  // Logging
  logLevel: process.env.REACT_APP_LOG_LEVEL || 'error',
};

// Log configuration au démarrage (développement uniquement)
if (ENV.isDevelopment || ENV.debug) {
  console.log('🔧 RSU Gabon - Configuration Environnement:');
  console.log('  API URL:', ENV.apiUrl);
  console.log('  Environnement:', ENV.isDevelopment ? 'Développement' : 'Production');
  console.log('  Debug:', ENV.debug);
}

// Validation
if (!ENV.apiUrl) {
  console.error('❌ ERREUR CRITIQUE: API URL non définie !');
  console.error('   Vérifiez que REACT_APP_API_URL est configuré dans Render.');
}

export default ENV;