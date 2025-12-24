/**
 * 🇬🇦 RSU Gabon - Eligibility Results Component FIXED
 * Standards Top 1% - Aligné sur API Response Réelle
 */

// ========================================
// EligibilityResults.jsx - Affichage corrigé score éligibilité
// ========================================
import React from 'react';

export default function EligibilityResults({ data }) {
  // ✅ CORRECTION: Extraction sécurisée du score
  const score = data?.eligibility_score 
    ? (typeof data.eligibility_score === 'string' 
        ? parseFloat(data.eligibility_score) 
        : data.eligibility_score)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getRecommendationLabel = (level) => {
    const labels = {
      'HIGHLY_RECOMMENDED': 'Fortement Recommandé',
      'RECOMMENDED': 'Recommandé',
      'CONDITIONALLY_ELIGIBLE': 'Éligible sous conditions',
      'NOT_ELIGIBLE': 'Non Éligible'
    };
    return labels[level] || level;
  };

  return (
    <div className="eligibility-results bg-white rounded-lg shadow-md p-6">
      {/* Score Principal */}
      <div className="score-section mb-6">
        <h4 className="text-lg font-semibold mb-3">Score d'Éligibilité</h4>
        <div className="flex items-center gap-4">
          {/* ✅ Affichage score avec protection */}
          <div className="text-5xl font-bold" style={{ color: getScoreColor(score) }}>
            {score.toFixed(1)}
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${score}%`,
                  backgroundColor: getScoreColor(score)
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandation */}
      <div className="recommendation-section mb-6">
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Niveau:</span>
          <span
            className="px-4 py-2 rounded-lg font-semibold text-white"
            style={{ backgroundColor: getScoreColor(score) }}
          >
            {getRecommendationLabel(data.recommendation_level)}
          </span>
        </div>
      </div>

      {/* Facteurs Favorables */}
      {data.eligibility_factors && data.eligibility_factors.length > 0 && (
        <div className="factors-section mb-6">
          <h5 className="font-semibold text-green-700 mb-2">✅ Facteurs Favorables</h5>
          <ul className="space-y-1">
            {data.eligibility_factors.map((factor, i) => (
              <li key={i} className="text-sm text-gray-700">• {factor}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Facteurs Bloquants */}
      {data.blocking_factors && data.blocking_factors.length > 0 && (
        <div className="blocking-section">
          <h5 className="font-semibold text-red-700 mb-2">⚠️ Facteurs Bloquants</h5>
          <ul className="space-y-1">
            {data.blocking_factors.map((factor, i) => (
              <li key={i} className="text-sm text-gray-700">• {factor}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
