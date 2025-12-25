/**
 * 🇬🇦 RSU Gabon - Services Tab UPDATED
 * Standards Top 1% - UX Améliorée avec Search Components
 * Fichier: rsu_admin_dashboard_v1/src/components/Dashboard/ServicesTab.jsx
 */

/**
 * 🇬🇦 RSU Gabon - Services Tab (CORRIGÉ - EXTRAIT)
 * Standards Top 1% - Error Handling Robuste
 * 
 * BUG CORRIGÉ: ❌ calculateVulnerability - 500 Internal Server Error
 * SOLUTION: Validation + Error handling contextuel + Toast notifications
 * 
 * Fichier: rsu_admin_dashboard_v1/src/components/Dashboard/ServicesTab.jsx
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import servicesAPI from '../../services/api/servicesAPI';

// ... (imports et autres méthodes)

export default function ServicesTab() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [vulnerabilityData, setVulnerabilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * ✅ CORRIGÉ: Calcul vulnérabilité avec validation défensive
   */
  const handleCalculateVulnerability = async () => {
    // 🛡️ VALIDATION: Bénéficiaire sélectionné
    if (!selectedPerson) {
      const errorMsg = 'Veuillez sélectionner un bénéficiaire';
      console.warn('⚠️', errorMsg);
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    // 🛡️ VALIDATION: ID valide
    if (!selectedPerson.id) {
      const errorMsg = 'Bénéficiaire sans ID valide';
      console.error('❌', errorMsg);
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setVulnerabilityData(null); // Reset état précédent

    try {
      console.log(`🧮 Calcul vulnérabilité pour ${selectedPerson.rsu_id || selectedPerson.id}...`);
      console.log('   Person ID:', selectedPerson.id);
      console.log('   Person Name:', selectedPerson.full_name);

      // ✅ APPEL API: Avec validation côté servicesAPI.js
      const data = await servicesAPI.calculateVulnerability(selectedPerson.id);

      console.log('✅ Vulnérabilité calculée avec succès:', data);
      console.log('   Score:', data?.vulnerability_score);
      console.log('   Niveau risque:', data?.risk_level);

      // ✅ STATE: Mise à jour
      setVulnerabilityData(data);

      // ✅ NOTIFICATION: Succès
      toast.success(
        `Vulnérabilité calculée: ${data?.vulnerability_score || 'N/A'}`,
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );

    } catch (error) {
      console.error('❌ Erreur calcul vulnérabilité:', error);
      console.error('   Error type:', error?.constructor?.name);
      console.error('   Error message:', error?.message);
      console.error('   HTTP status:', error?.response?.status);
      console.error('   Response data:', error?.response?.data);

      // ✅ MESSAGES D'ERREUR CONTEXTUELS
      let errorMessage = 'Erreur lors du calcul de vulnérabilité';
      let errorDetails = null;

      if (error.response) {
        // Erreur avec réponse HTTP
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            errorMessage = data?.error || 'Données invalides pour le calcul';
            errorDetails = data?.detail || 'Vérifiez les informations du bénéficiaire';
            break;

          case 404:
            errorMessage = 'Bénéficiaire introuvable';
            errorDetails = 'Le bénéficiaire n\'existe plus dans la base de données';
            break;

          case 500:
            errorMessage = 'Erreur serveur lors du calcul';
            errorDetails = data?.detail || 'Contactez l\'administrateur système';
            break;

          case 503:
            errorMessage = 'Service de vulnérabilité indisponible';
            errorDetails = 'Le service est temporairement hors ligne';
            break;

          default:
            errorMessage = `Erreur HTTP ${status}`;
            errorDetails = data?.error || error.message;
        }
      } else if (error.request) {
        // Erreur réseau (pas de réponse)
        errorMessage = 'Erreur de connexion au serveur';
        errorDetails = 'Vérifiez votre connexion internet';
      } else if (error.message) {
        // Erreur de validation côté client
        errorMessage = error.message;
      }

      console.error('📋 Error summary:', { errorMessage, errorDetails });

      // ✅ STATE: Mise à jour erreur
      setError(errorMessage);

      // ✅ NOTIFICATION: Erreur
      toast.error(
        <div>
          <strong>{errorMessage}</strong>
          {errorDetails && (
            <div className="text-sm mt-1 opacity-90">{errorDetails}</div>
          )}
        </div>,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );

    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ HELPER: Affichage erreur avec retry
   */
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              Erreur
            </h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              handleCalculateVulnerability();
            }}
            className="flex-shrink-0 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  };

  /**
   * ✅ RENDER: Bouton calcul vulnérabilité
   */
  return (
    <div className="space-y-6">
      {/* ... autres éléments UI ... */}

      {/* Affichage erreur */}
      {renderError()}

      {/* Bouton calcul */}
      <button
        onClick={handleCalculateVulnerability}
        disabled={!selectedPerson || loading}
        className={`
          px-6 py-3 rounded-lg flex items-center gap-2
          font-medium transition-all
          ${
            !selectedPerson || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }
        `}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Calcul en cours...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Calculer Vulnérabilité</span>
          </>
        )}
      </button>

      {/* Affichage résultat vulnérabilité */}
      {vulnerabilityData && !loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évaluation de Vulnérabilité
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Score de vulnérabilité</p>
              <p className="text-2xl font-bold text-blue-600">
                {vulnerabilityData.vulnerability_score || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Niveau de risque</p>
              <p className={`
                text-2xl font-bold
                ${vulnerabilityData.risk_level === 'CRITICAL' ? 'text-red-600' : ''}
                ${vulnerabilityData.risk_level === 'HIGH' ? 'text-orange-600' : ''}
                ${vulnerabilityData.risk_level === 'MEDIUM' ? 'text-yellow-600' : ''}
                ${vulnerabilityData.risk_level === 'LOW' ? 'text-green-600' : ''}
              `}>
                {vulnerabilityData.risk_level || 'N/A'}
              </p>
            </div>
          </div>

          {vulnerabilityData.requires_urgent_intervention && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-semibold text-red-800">
                ⚠️ Intervention urgente requise
              </p>
            </div>
          )}
        </div>
      )}

      {/* ... autres éléments UI ... */}
    </div>
  );
}

/**
 * 📚 DOCUMENTATION ERROR HANDLING
 * 
 * CODES HTTP GÉRÉS:
 * - 400: Données invalides (person_id manquant ou invalide)
 * - 404: Bénéficiaire introuvable
 * - 500: Erreur serveur (service indisponible, erreur interne)
 * - 503: Service temporairement indisponible
 * 
 * VALIDATIONS:
 * ✅ selectedPerson existe
 * ✅ selectedPerson.id existe et est valide
 * ✅ Gestion erreurs réseau (pas de réponse)
 * ✅ Gestion erreurs de validation client
 * 
 * NOTIFICATIONS:
 * ✅ Toast success avec score calculé
 * ✅ Toast error avec message contextuel
 * ✅ Affichage erreur inline avec bouton retry
 * 
 * LOGS:
 * ✅ Logs console détaillés pour debugging
 * ✅ Logs structurés avec préfixes (✅, ❌, ⚠️)
 */