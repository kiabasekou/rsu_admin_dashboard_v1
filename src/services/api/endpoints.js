/**
 * 🇬🇦 RSU Gabon - API Endpoints COMPLET
 * Standards Top 1% - Configuration centralisée avec Analytics & Deduplication
 * Fichier: rsu_admin_dashboard_v1/src/services/api/endpoints.js
 */

const ENDPOINTS = {
  // ==================== AUTHENTIFICATION ====================
  AUTH: {
    TOKEN: '/auth/token/',
    REFRESH: '/auth/token/refresh/',
    LOGOUT: '/auth/logout/',
  },

  // ==================== ANALYTICS (DASHBOARD & IA) ====================
  ANALYTICS: {
    // Dashboard
    DASHBOARD: '/analytics/dashboard/',
    PROVINCE_STATS: '/analytics/province-stats/',
    
    // KPI Metrics
    KPI_METRICS: '/analytics/kpi-metrics/',
    KPI_DETAIL: (id) => `/analytics/kpi-metrics/${id}/`,
    KPI_CALCULATE: (id) => `/analytics/kpi-metrics/${id}/calculate/`,
    KPI_HISTORY: (id) => `/analytics/kpi-metrics/${id}/history/`,
    
    // Dashboard Configs
    DASHBOARD_CONFIGS: '/analytics/dashboard-configs/',
    DASHBOARD_CONFIG_DETAIL: (id) => `/analytics/dashboard-configs/${id}/`,
    DASHBOARD_CONFIG_ACTIVATE: (id) => `/analytics/dashboard-configs/${id}/activate/`,
    DASHBOARD_CONFIG_DUPLICATE: (id) => `/analytics/dashboard-configs/${id}/duplicate/`,
    
    // Reports
    REPORT_TEMPLATES: '/analytics/report-templates/',
    REPORT_TEMPLATE_DETAIL: (id) => `/analytics/report-templates/${id}/`,
    REPORT_GENERATE: (id) => `/analytics/report-templates/${id}/generate/`,
    REPORT_DOWNLOAD: (id) => `/analytics/report-templates/${id}/download/`,
    REPORT_SCHEDULE: (id) => `/analytics/report-templates/${id}/schedule/`,
    
    // Data Exports
    DATA_EXPORTS: '/analytics/data-exports/',
    DATA_EXPORT_DETAIL: (id) => `/analytics/data-exports/${id}/`,
    DATA_EXPORT_DOWNLOAD: (id) => `/analytics/data-exports/${id}/download/`,
    DATA_EXPORT_STATUS: (id) => `/analytics/data-exports/${id}/status/`,
    
    // Services Analytics
    DEMOGRAPHIC_INSIGHTS: '/services/analytics/demographic_insights/',
    GEOGRAPHIC_DISTRIBUTION: '/services/analytics/geographic_distribution/',
    VULNERABILITY_STATS: '/services/analytics/vulnerability_stats/',
  },

  // ==================== DEDUPLICATION (IA ANTI-FRAUDE) ====================
  DEDUPLICATION: {
    // Détections
    DETECTIONS: '/deduplication/detections/',
    DETECTION_DETAIL: (id) => `/deduplication/detections/${id}/`,
    DETECT_FOR_PERSON: '/deduplication/detections/detect_for_person/',
    BATCH_DETECT_ALL: '/deduplication/detections/batch_detect_all/',
    DETECTION_STATISTICS: '/deduplication/detections/statistics/',
    
    // Similarity Scores
    SCORES: '/deduplication/scores/',
    SCORE_DETAIL: (id) => `/deduplication/scores/${id}/`,
    SCORES_HIGH_CONFIDENCE: '/deduplication/scores/high_confidence/',
    SCORES_REQUIRES_REVIEW: '/deduplication/scores/requires_review/',
    SCORES_FRAUD_SUSPECTED: '/deduplication/scores/fraud_suspected/',
    SCORE_MARK_REVIEWED: (id) => `/deduplication/scores/${id}/mark_reviewed/`,
    
    // Merge Candidates
    MERGES: '/deduplication/merges/',
    MERGE_DETAIL: (id) => `/deduplication/merges/${id}/`,
    MERGES_PENDING: '/deduplication/merges/pending/',
    MERGE_STATISTICS: '/deduplication/merges/statistics/',
    MERGE_EXECUTE: (id) => `/deduplication/merges/${id}/execute_merge/`,
    MERGE_ROLLBACK: (id) => `/deduplication/merges/${id}/rollback/`,
    
    // ML Models
    ML_MODELS: '/deduplication/ml-models/',
    ML_MODEL_DETAIL: (id) => `/deduplication/ml-models/${id}/`,
    ML_MODELS_PRODUCTION: '/deduplication/ml-models/production_models/',
    ML_STATISTICS: '/deduplication/ml-models/statistics/',
    ML_COMPARE_MODELS: '/deduplication/ml-models/compare_models/',
    ML_DEPLOY: (id) => `/deduplication/ml-models/${id}/deploy/`,
  },

  // ==================== IDENTITY (BÉNÉFICIAIRES) ====================
  IDENTITY: {
    // Personnes
    PERSONS: '/identity/persons/',
    PERSON_DETAIL: (id) => `/identity/persons/${id}/`,
    SEARCH: '/identity/persons/search/',
    CHECK_DUPLICATES: '/identity/persons/check-duplicates/',
    SEARCH_DUPLICATES: '/identity/persons/search_duplicates/',
    STATISTICS: '/identity/persons/statistics/',
    
    // Ménages
    HOUSEHOLDS: '/identity/households/',
    HOUSEHOLD_DETAIL: (id) => `/identity/households/${id}/`,
    HOUSEHOLD_STATS: '/identity/households/statistics/',
    
    // Données géographiques
    GEOGRAPHIC_DATA: '/identity/geographic-data/',
  },

  // ==================== PROGRAMS (PROGRAMMES SOCIAUX) ====================
  PROGRAMS: {
    // Catégories
    CATEGORIES: '/programs/categories/',
    CATEGORY_DETAIL: (id) => `/programs/categories/${id}/`,
    
    // Programmes
    PROGRAMS: '/programs/programs/',
    PROGRAM_DETAIL: (id) => `/programs/programs/${id}/`,
    PROGRAM_STATISTICS: (id) => `/programs/programs/${id}/statistics/`,
    ACTIVE_PROGRAMS: '/programs/programs/active/',
    ACTIVATE_PROGRAM: (id) => `/programs/programs/${id}/activate/`,
    PAUSE_PROGRAM: (id) => `/programs/programs/${id}/pause/`,
    CLOSE_PROGRAM: (id) => `/programs/programs/${id}/close/`,
    EXPORT_PROGRAM: (id, format) => `/programs/programs/${id}/export/?format=${format}`,
    
    // Inscriptions
    ENROLLMENTS: '/programs/enrollments/',
    ENROLLMENT_DETAIL: (id) => `/programs/enrollments/${id}/`,
    PENDING_ENROLLMENTS: '/programs/enrollments/pending/',
    CHECK_ELIGIBILITY: '/programs/enrollments/check_eligibility/',
    APPROVE_ENROLLMENT: (id) => `/programs/enrollments/${id}/approve/`,
    REJECT_ENROLLMENT: (id) => `/programs/enrollments/${id}/reject/`,
    SUSPEND_ENROLLMENT: (id) => `/programs/enrollments/${id}/suspend/`,
    EXPORT_ENROLLMENTS: (programId, format) => `/programs/enrollments/export/?program=${programId}&format=${format}`,
    
    // Paiements
    PAYMENTS: '/programs/payments/',
    PAYMENT_DETAIL: (id) => `/programs/payments/${id}/`,
    PENDING_PAYMENTS: '/programs/payments/pending/',
    PAYMENT_STATISTICS: '/programs/payments/statistics/',
    PROCESS_PAYMENT: (id) => `/programs/payments/${id}/process/`,
    MARK_FAILED: (id) => `/programs/payments/${id}/mark_failed/`,
    BATCH_PROCESS: '/programs/payments/batch_process/',
  },

  // ==================== SERVICES (VULNÉRABILITÉ & ÉLIGIBILITÉ) ====================
  SERVICES: {
    // Vulnerability Assessment
    VULNERABILITY_SCORES: '/services/vulnerability-scores/',
    VULNERABILITY_SCORE_DETAIL: (id) => `/services/vulnerability-scores/${id}/`,
    CALCULATE_SCORE: '/services/vulnerability-scores/calculate/',
    VULNERABILITY_STATISTICS: '/services/vulnerability-scores/statistics/',
    
    // Eligibility Checks
    ELIGIBILITY_CHECKS: '/services/eligibility-checks/',
    ELIGIBILITY_CHECK_DETAIL: (id) => `/services/eligibility-checks/${id}/`,
    CHECK_ELIGIBILITY: '/services/eligibility-checks/check/',
    BULK_CHECK: '/services/eligibility-checks/bulk_check/',
    
    // Analytics Services
    ANALYTICS_DASHBOARD: '/services/analytics/dashboard/',
    DEMOGRAPHIC_INSIGHTS: '/services/analytics/demographic_insights/',
    GEOGRAPHIC_DISTRIBUTION: '/services/analytics/geographic_distribution/',
    VULNERABILITY_STATS: '/services/analytics/vulnerability_stats/',
  },

  // ==================== SURVEYS ====================
  SURVEYS: {
    TEMPLATES: '/surveys/templates/',
    SESSIONS: '/surveys/sessions/',
    RESPONSES: '/surveys/responses/',
  },

  // ==================== FAMILY GRAPH ====================
  FAMILY_GRAPH: {
    RELATIONSHIPS: '/family-graph/relationships/',
    NETWORKS: '/family-graph/networks/',
  },

  // ==================== CORE ====================
  CORE: {
    USERS: '/core/users/',
    AUDIT_LOGS: '/core/audit-logs/',
  },
};

export default ENDPOINTS;