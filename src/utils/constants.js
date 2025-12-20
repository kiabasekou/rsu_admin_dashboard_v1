/**
 * 🇬🇦 RSU Gabon - Constants
 * Standards Top 1% - Constantes du système
 */

// 9 Provinces du Gabon
export const PROVINCES = [
  'ESTUAIRE',
  'HAUT-OGOOUE',
  'MOYEN-OGOOUE',
  'NGOUNIE',
  'NYANGA',
  'OGOOUE-IVINDO',
  'OGOOUE-LOLO',
  'OGOOUE-MARITIME',
  'WOLEU-NTEM'
];

// Statuts de vérification
export const VERIFICATION_STATUS = {
  PENDING: {
    value: 'PENDING',
    label: 'En attente',
    color: 'yellow',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
    borderClass: 'border-yellow-300'
  },
  VERIFIED: {
    value: 'VERIFIED',
    label: 'Vérifié',
    color: 'green',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
    borderClass: 'border-green-300'
  },
  REVIEW: {
    value: 'REVIEW',
    label: 'En révision',
    color: 'orange',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-800',
    borderClass: 'border-orange-300'
  },
  REJECTED: {
    value: 'REJECTED',
    label: 'Rejeté',
    color: 'red',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    borderClass: 'border-red-300'
  }
};

// Seuils de vulnérabilité
export const VULNERABILITY_THRESHOLDS = {
  LOW: {
    min: 0,
    max: 30,
    label: 'Faible',
    color: 'green',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800'
  },
  MODERATE: {
    min: 31,
    max: 60,
    label: 'Modéré',
    color: 'yellow',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800'
  },
  HIGH: {
    min: 61,
    max: 100,
    label: 'Élevé',
    color: 'red',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800'
  }
};

// Types de genre
export const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculin' },
  { value: 'F', label: 'Féminin' },
  { value: 'OTHER', label: 'Autre' }
];

// Types de logement
export const HOUSING_TYPES = [
  { value: 'OWNER', label: 'Propriétaire' },
  { value: 'TENANT', label: 'Locataire' },
  { value: 'FREE', label: 'Logé gratuitement' },
  { value: 'PRECARIOUS', label: 'Précaire' }
];

// Types de documents
export const ID_DOCUMENT_TYPES = [
  { value: 'CNI', label: 'Carte Nationale d\'Identité' },
  { value: 'PASSPORT', label: 'Passeport' },
  { value: 'BIRTH_CERTIFICATE', label: 'Acte de naissance' },
  { value: 'OTHER', label: 'Autre' }
];

// Statuts programme
export const PROGRAM_STATUS = {
  DRAFT: { value: 'DRAFT', label: 'Brouillon', color: 'gray' },
  ACTIVE: { value: 'ACTIVE', label: 'Actif', color: 'green' },
  PAUSED: { value: 'PAUSED', label: 'Suspendu', color: 'yellow' },
  CLOSED: { value: 'CLOSED', label: 'Clôturé', color: 'red' }
};

// Fréquences de paiement
export const PAYMENT_FREQUENCIES = [
  { value: 'ONE_TIME', label: 'Ponctuel' },
  { value: 'MONTHLY', label: 'Mensuel' },
  { value: 'QUARTERLY', label: 'Trimestriel' },
  { value: 'ANNUAL', label: 'Annuel' }
];

// Messages d'erreur API
export const ERROR_MESSAGES = {
  400: 'Données invalides. Vérifiez le formulaire.',
  401: 'Session expirée. Veuillez vous reconnecter.',
  403: 'Accès refusé.',
  404: 'Ressource introuvable.',
  500: 'Erreur serveur. Contactez l\'administrateur.',
  network: 'Erreur réseau. Vérifiez votre connexion.',
  unknown: 'Une erreur inattendue s\'est produite.'
};

// Helper: Obtenir le message d'erreur approprié
export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.unknown;
  
  // Erreur réseau
  if (error.message === 'Network Error' || !navigator.onLine) {
    return ERROR_MESSAGES.network;
  }
  
  // Erreur HTTP avec status
  if (error.response?.status) {
    return ERROR_MESSAGES[error.response.status] || ERROR_MESSAGES.unknown;
  }
  
  // Message d'erreur personnalisé du backend
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  // Message d'erreur générique
  return error.message || ERROR_MESSAGES.unknown;
};

// Helper: Obtenir classe de statut vérification
export const getVerificationStatusClass = (status) => {
  return VERIFICATION_STATUS[status] || VERIFICATION_STATUS.PENDING;
};

// Helper: Obtenir classe de vulnérabilité
export const getVulnerabilityClass = (score) => {
  if (score <= 30) return VULNERABILITY_THRESHOLDS.LOW;
  if (score <= 60) return VULNERABILITY_THRESHOLDS.MODERATE;
  return VULNERABILITY_THRESHOLDS.HIGH;
};