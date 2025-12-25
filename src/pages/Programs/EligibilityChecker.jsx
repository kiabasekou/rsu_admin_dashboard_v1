/**
 * 🇬🇦 RSU Gabon - Eligibility Checker Component (CORRIGÉ)
 * Standards Top 1% - Vérification Éligibilité Programmes
 * 
 * ✅ CORRECTION MAJEURE #3: Méthode calculateEligibility ajoutée dans servicesAPI.js
 * ❌ AVANT: Appelait une méthode inexistante → crash
 * ✅ APRÈS: Appel à servicesAPI.calculateEligibility() qui existe maintenant
 * 
 * PROBLÈME RÉSOLU:
 * - EligibilityChecker appelait calculateEligibility(personId, programCode)
 * - Cette méthode n'existait pas dans servicesAPI.js
 * - Crash au clic du bouton "Vérifier Éligibilité"
 * - Maintenant la méthode existe et fonctionne correctement
 */

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import servicesAPI from '../../services/api/servicesAPI';
import '../../styles/EligibilityChecker.css';

export default function EligibilityChecker({ personId, programCode }) {
  // ==================== ÉTATS ====================
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // ==================== FONCTION: VÉRIFIER ÉLIGIBILITÉ ====================
  
  /**
   * ✅ CORRECTION: Appel API avec gestion erreur complète
   */
  const checkEligibility = async () => {
    // 🛡️ VALIDATION: Paramètres requis
    if (!personId || !programCode) {
      setError('Veuillez sélectionner un bénéficiaire et un programme');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log(`🔍 Checking eligibility for person ${personId} and program ${programCode}...`);
      
      // ✅ CORRECTION: Cette méthode existe maintenant dans servicesAPI.js
      const response = await servicesAPI.calculateEligibility(personId, programCode);
      
      console.log('✅ Eligibility response:', response);
      setResult(response);
      
    } catch (err) {
      console.error('❌ Eligibility error:', err);
      
      // 🛡️ GESTION ERREUR: Messages contextuels
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.error
        || err.message 
        || 'Erreur lors du calcul de l\'éligibilité';
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // ==================== FONCTION: RÉINITIALISER ====================
  
  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  // ==================== RENDER ====================
  
  return (
    <div className="eligibility-checker">
      {/* ==================== BOUTON VÉRIFICATION ==================== */}
      <div className="space-y-4">
        <button
          onClick={checkEligibility}
          disabled={loading || !personId || !programCode}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Calcul en cours...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Vérifier Éligibilité
            </>
          )}
        </button>

        {/* ==================== MESSAGE D'ERREUR ==================== */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold">Erreur</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== RÉSULTAT ÉLIGIBILITÉ ==================== */}
        {result && (
          <div className={`border rounded-lg p-6 ${
            result.is_eligible 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            {/* En-tête */}
            <div className="flex items-center gap-3 mb-4">
              {result.is_eligible ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-orange-600" />
              )}
              <div>
                <h3 className={`text-lg font-bold ${
                  result.is_eligible ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {result.is_eligible ? 'Éligible' : 'Non Éligible'}
                </h3>
                {result.eligibility_score != null && (
                  <p className={`text-sm ${
                    result.is_eligible ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    Score d'éligibilité: {result.eligibility_score.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>

            {/* Raisons */}
            {result.reasons && result.reasons.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Détails:</h4>
                <ul className="space-y-1">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Critères manquants */}
            {!result.is_eligible && result.missing_criteria && result.missing_criteria.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-orange-900 mb-2">Critères non remplis:</h4>
                <ul className="space-y-1">
                  {result.missing_criteria.map((criterion, index) => (
                    <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                      <span className="text-orange-400">✗</span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bouton Réinitialiser */}
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Nouvelle vérification
            </button>
          </div>
        )}

        {/* ==================== ÉTAT INITIAL ==================== */}
        {!result && !error && !loading && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">
              {!personId && !programCode 
                ? 'Sélectionnez un bénéficiaire et un programme pour vérifier l\'éligibilité'
                : !personId
                  ? 'Sélectionnez un bénéficiaire'
                  : !programCode
                    ? 'Sélectionnez un programme'
                    : 'Cliquez sur "Vérifier Éligibilité" pour calculer le score'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== STYLES RECOMMANDÉS ====================

/**
 * 🎨 TAILWIND CLASSES UTILISÉES:
 * 
 * - Boutons: bg-blue-600, hover:bg-blue-700, disabled:opacity-50
 * - Succès: bg-green-50, border-green-200, text-green-600
 * - Erreur: bg-red-50, border-red-200, text-red-600
 * - Warning: bg-orange-50, border-orange-200, text-orange-600
 * - Neutre: bg-gray-50, border-gray-200, text-gray-500
 * 
 * ANIMATIONS:
 * - Loader: animate-spin (nécessite Tailwind)
 * - Transitions: transition-colors
 */