/**
 * 🇬🇦 RSU Gabon - Analytics API Service
 * Standards Top 1% - APIs IA Analytics
 * Fichier: rsu_admin_dashboard_v1/src/services/api/analyticsAPI.js
 */

import apiClient from './apiClient';

export const analyticsAPI = {
  // ==================== DASHBOARD & KPIs ====================
  
  /**
   * Récupérer dashboard complet
   */
  getDashboard: async () => {
    return await apiClient.get('/analytics/dashboard/');
  },

  /**
   * Récupérer KPI Metrics
   */
  getKPIMetrics: async (filters = {}) => {
    return await apiClient.get('/analytics/kpi-metrics/', { params: filters });
  },

  /**
   * Créer nouvelle KPI
   */
  createKPI: async (data) => {
    return await apiClient.post('/analytics/kpi-metrics/', data);
  },

  /**
   * Calculer KPI en temps réel
   */
  calculateKPI: async (kpiId) => {
    return await apiClient.post(`/analytics/kpi-metrics/${kpiId}/calculate/`);
  },

  /**
   * Historique KPI
   */
  getKPIHistory: async (kpiId, period = '30d') => {
    return await apiClient.get(`/analytics/kpi-metrics/${kpiId}/history/`, {
      params: { period }
    });
  },

  // ==================== DASHBOARD CONFIGS ====================

  /**
   * Récupérer configurations dashboard
   */
  getDashboardConfigs: async () => {
    return await apiClient.get('/analytics/dashboard-configs/');
  },

  /**
   * Créer configuration dashboard personnalisée
   */
  createDashboardConfig: async (data) => {
    return await apiClient.post('/analytics/dashboard-configs/', data);
  },

  /**
   * Activer configuration
   */
  activateDashboardConfig: async (configId) => {
    return await apiClient.post(`/analytics/dashboard-configs/${configId}/activate/`);
  },

  /**
   * Dupliquer configuration
   */
  duplicateDashboardConfig: async (configId) => {
    return await apiClient.post(`/analytics/dashboard-configs/${configId}/duplicate/`);
  },

  // ==================== REPORTS ====================

  /**
   * Récupérer templates de rapports
   */
  getReportTemplates: async () => {
    return await apiClient.get('/analytics/report-templates/');
  },

  /**
   * Créer template de rapport
   */
  createReportTemplate: async (data) => {
    return await apiClient.post('/analytics/report-templates/', data);
  },

  /**
   * Générer rapport depuis template
   */
  generateReport: async (templateId, params = {}) => {
    return await apiClient.post(
      `/analytics/report-templates/${templateId}/generate/`,
      params
    );
  },

  /**
   * Télécharger rapport généré
   */
  downloadReport: async (templateId, format = 'PDF') => {
    return await apiClient.get(
      `/analytics/report-templates/${templateId}/download/`,
      {
        params: { format },
        responseType: 'blob'
      }
    );
  },

  /**
   * Programmer génération automatique
   */
  scheduleReport: async (templateId, schedule) => {
    return await apiClient.post(
      `/analytics/report-templates/${templateId}/schedule/`,
      schedule
    );
  },

  // ==================== DATA EXPORT ====================

  /**
   * Créer export de données
   */
  createDataExport: async (exportConfig) => {
    return await apiClient.post('/analytics/data-exports/', exportConfig);
  },

  /**
   * Récupérer exports disponibles
   */
  getDataExports: async (filters = {}) => {
    return await apiClient.get('/analytics/data-exports/', { params: filters });
  },

  /**
   * Télécharger export
   */
  downloadExport: async (exportId) => {
    return await apiClient.get(`/analytics/data-exports/${exportId}/download/`, {
      responseType: 'blob'
    });
  },

  /**
   * Statut export
   */
  getExportStatus: async (exportId) => {
    return await apiClient.get(`/analytics/data-exports/${exportId}/status/`);
  },

  // ==================== STATISTIQUES PROVINCIALES ====================

  /**
   * Statistiques par province
   */
  getProvinceStats: async () => {
    return await apiClient.get('/analytics/province-stats/');
  },

  /**
   * Détail province
   */
  getProvinceDetail: async (provinceCode) => {
    return await apiClient.get(`/analytics/province-stats/${provinceCode}/`);
  },

  // ==================== INSIGHTS & PRÉDICTIONS ====================

  /**
   * Insights démographiques
   */
  getDemographicInsights: async () => {
    return await apiClient.get('/services/analytics/demographic_insights/');
  },

  /**
   * Distribution géographique
   */
  getGeographicDistribution: async () => {
    return await apiClient.get('/services/analytics/geographic_distribution/');
  },

  /**
   * Statistiques vulnérabilité
   */
  getVulnerabilityStats: async () => {
    return await apiClient.get('/services/analytics/vulnerability_stats/');
  },

  /**
   * Tendances temporelles
   */
  getTrends: async (metric, period = '6m') => {
    return await apiClient.get('/analytics/trends/', {
      params: { metric, period }
    });
  },
  /**
   * Tendances dashboard
   */
  getDashboardTrends: async () => {
    return await apiClient.get('/analytics/dashboard/trends/');
  },

  /**
   * Prédictions IA
   */
  getPredictions: async (model, parameters) => {
    return await apiClient.post('/analytics/predictions/', {
      model,
      parameters
    });
  },

  // ==================== ALERTES ====================

  /**
   * Récupérer alertes actives
   */
  getAlerts: async () => {
    return await apiClient.get('/analytics/alerts/');
  },

  /**
   * Créer règle d'alerte
   */
  createAlert: async (alertConfig) => {
    return await apiClient.post('/analytics/alerts/', alertConfig);
  },

  /**
   * Marquer alerte comme lue
   */
  markAlertRead: async (alertId) => {
    return await apiClient.patch(`/analytics/alerts/${alertId}/`, {
      is_read: true
    });
  }
};

export default analyticsAPI;