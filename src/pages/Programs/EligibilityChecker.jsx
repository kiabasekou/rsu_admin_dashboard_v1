/**
 * 🇬🇦 RSU Gabon - Eligibility Checker Component
 * Standards Top 1% - Vérification Éligibilité Programmes
 * Fichier: rsu_admin_dashboard_v1/src/pages/Programs/EligibilityChecker.jsx
 */


// ========================================
// EligibilityChecker.jsx - Appel API corrigé
// ========================================
import React, { useState } from 'react';
import servicesAPI from '../../services/api/servicesAPI';
import EligibilityResults from './EligibilityResults';

export default function EligibilityChecker({ personId, programCode }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // ✅ CORRECTION: Appel API avec gestion erreur complète
  const checkEligibility = async () => {
    if (!personId || !programCode) {
      setError('Personne et programme requis');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // ✅ Endpoint correct
      const response = await servicesAPI.calculateEligibility(personId, programCode);
      console.log('✅ Eligibility response:', response);
      setResult(response);
    } catch (err) {
      console.error('❌ Eligibility error:', err);
      setError(err.response?.data?.detail || err.message || 'Erreur calcul éligibilité');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eligibility-checker space-y-4">
      <button
        onClick={checkEligibility}
        disabled={loading || !personId || !programCode}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Calcul en cours...' : 'Vérifier Éligibilité'}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">❌ Erreur</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {result && <EligibilityResults data={result} />}

      {!result && !error && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>Cliquez sur "Vérifier Éligibilité" pour calculer le score</p>
        </div>
      )}
    </div>
  );
}
