
/**
 * 🇬🇦 RSU Gabon - Recommended Programs Component (CORRIGÉ)
 * Standards Top 1% - Validation défensive + Error Handling
 * 
 * BUG CORRIGÉ: ❌ GET /services/eligibility/recommended_programs/ - 400 Bad Request
 * CAUSE: personId manquant dans query params
 * SOLUTION: Validation + Guard clause
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, AlertCircle, Loader2 } from 'lucide-react';
import { servicesAPI } from '../../services/api/servicesAPI';

export default function RecommendedPrograms({ personId, minScore = 60.0 }) {
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * ✅ CORRECTION: Chargement avec validation défensive
   */
  useEffect(() => {
    // 🛡️ GUARD: Ne pas charger si personId manquant
    if (!personId) {
      console.log('ℹ️ RecommendedPrograms: En attente de sélection bénéficiaire');
      setRecommendedPrograms([]);
      setError(null);
      return;
    }

    loadRecommendedPrograms();
  }, [personId, minScore]); // ✅ Dépendances explicites

  /**
   * ✅ FONCTION: Chargement programmes avec error handling robuste
   */
  const loadRecommendedPrograms = async () => {
    // 🛡️ DOUBLE VALIDATION: Sécurité supplémentaire
    if (!personId) {
      console.warn('⚠️ loadRecommendedPrograms: personId manquant');
      setError('Aucun bénéficiaire sélectionné');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`📊 Chargement programmes recommandés pour person ${personId}...`);
      console.log(`   Min score: ${minScore}`);

      // ✅ APPEL API avec validation côté servicesAPI.js
      const data = await servicesAPI.getRecommendedPrograms(personId, minScore);

      console.log('✅ Programmes recommandés reçus:', data);
      console.log(`   Nombre de programmes: ${data?.length || 0}`);

      // ✅ DEFENSIVE: Toujours gérer cas data null/undefined
      setRecommendedPrograms(data || []);

      if (!data || data.length === 0) {
        console.log('ℹ️ Aucun programme recommandé pour ce bénéficiaire');
      }

    } catch (error) {
      console.error('❌ Erreur chargement programmes recommandés:', error);

      // ✅ MESSAGES D'ERREUR CONTEXTUELS
      let errorMessage = 'Erreur lors du chargement des programmes';

      if (error.response?.status === 400) {
        errorMessage = 'Paramètres invalides - Vérifiez la sélection du bénéficiaire';
      } else if (error.response?.status === 404) {
        errorMessage = 'Bénéficiaire introuvable';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur serveur - Contactez l\'administrateur';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setRecommendedPrograms([]);

    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ HELPER: Badge couleur selon niveau de recommandation
   */
  const getRecommendationBadge = (level) => {
    const badges = {
      'HIGHLY_RECOMMENDED': {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '⭐',
        label: 'Hautement recommandé'
      },
      'RECOMMENDED': {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: '👍',
        label: 'Recommandé'
      },
      'ELIGIBLE': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '✓',
        label: 'Éligible'
      },
      'NOT_ELIGIBLE': {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: '✗',
        label: 'Non éligible'
      }
    };

    return badges[level] || badges['ELIGIBLE'];
  };

  /**
   * ✅ UI: État chargement
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-gray-600">Chargement des programmes recommandés...</span>
      </div>
    );
  }

  /**
   * ✅ UI: État erreur
   */
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Erreur</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={loadRecommendedPrograms}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ✅ UI: Aucun bénéficiaire sélectionné
   */
  if (!personId) {
    return (
      <div className="text-center py-12 text-gray-500">
        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Sélectionnez un bénéficiaire</p>
        <p className="text-sm">pour voir les programmes recommandés</p>
      </div>
    );
  }

  /**
   * ✅ UI: Aucun programme recommandé
   */
  if (recommendedPrograms.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">
              Aucun programme recommandé
            </h3>
            <p className="text-yellow-700 text-sm">
              Ce bénéficiaire ne correspond aux critères d'aucun programme actif
              (score minimum: {minScore}).
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ✅ UI: Liste des programmes recommandés
   */
  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Programmes Recommandés
        </h3>
        <span className="text-sm text-gray-600">
          {recommendedPrograms.length} programme{recommendedPrograms.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Liste des programmes */}
      <div className="grid gap-4">
        {recommendedPrograms.map((program, index) => {
          const badge = getRecommendationBadge(program.recommendation_level);

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {program.program_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Code: <span className="font-mono">{program.program_code}</span>
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                  {badge.icon} {badge.label}
                </span>
              </div>

              {/* Score d'éligibilité */}
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  Score d'éligibilité:
                </span>
                <span className="font-semibold text-blue-600">
                  {program.eligibility_score?.toFixed(1) || 'N/A'}%
                </span>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(program.eligibility_score || 0, 100)}%` }}
                />
              </div>

              {/* Facteurs bloquants (si présents) */}
              {program.blocking_factors && program.blocking_factors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs font-semibold text-red-800 mb-1">
                    ⚠️ Facteurs bloquants:
                  </p>
                  <ul className="text-xs text-red-700 space-y-1">
                    {program.blocking_factors.map((factor, idx) => (
                      <li key={idx}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info API */}
      <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
        <p className="text-xs text-blue-800">
          <strong>📡 Endpoint:</strong> GET /api/v1/services/eligibility/recommended_programs/
          <br />
          <strong>Paramètres:</strong> person_id={personId?.slice(0, 8)}..., min_score={minScore}
        </p>
      </div>
    </div>
  );
}