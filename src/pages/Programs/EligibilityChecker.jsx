/**
 * 🇬🇦 RSU Gabon - Eligibility Checker Component
 * Standards Top 1% - Vérification Éligibilité Programmes
 * Fichier: rsu_admin_dashboard_v1/src/pages/Programs/EligibilityChecker.jsx
 */

import React, { useState } from 'react';
import servicesAPI from '../../services/api/servicesAPI';
import EligibilityResults from './EligibilityResults';

export default function EligibilityChecker({ personId, programCode }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const checkEligibility = async () => {
    if (!personId || !programCode) {
      setError('Personne et programme requis');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await servicesAPI.calculateEligibility(personId, programCode);
      setResult(response);
    } catch (err) {
      console.error('Eligibility check failed:', err);
      setError(err.response?.data?.detail || 'Erreur lors du calcul d\'éligibilité');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eligibility-checker">
      <div className="checker-header">
        <h3>Vérification Éligibilité</h3>
        <button 
          onClick={checkEligibility} 
          disabled={loading || !personId || !programCode}
          className="btn-primary"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Calcul en cours...
            </>
          ) : (
            'Vérifier Éligibilité'
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="icon">⚠️</span>
          {error}
        </div>
      )}

      {result && <EligibilityResults data={result} />}

      {!result && !error && !loading && (
        <div className="placeholder">
          <p>Cliquez sur "Vérifier Éligibilité" pour calculer le score</p>
        </div>
      )}
    </div>
  );
}