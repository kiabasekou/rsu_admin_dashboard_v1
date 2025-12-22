/**
 * 🇬🇦 RSU Gabon - Recommended Programs Component
 * Standards Top 1% - Programmes Recommandés pour Bénéficiaire
 * Fichier: rsu_admin_dashboard_v1/src/pages/Programs/RecommendedPrograms.jsx
 */

import React, { useState, useEffect } from 'react';
import servicesAPI from '../../services/api/servicesAPI';

export default function RecommendedPrograms({ personId, minScore = 60.0 }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (personId) {
      loadRecommendedPrograms();
    }
  }, [personId, minScore]);

  const loadRecommendedPrograms = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await servicesAPI.getRecommendedPrograms(personId, minScore);
      setPrograms(response || []);
    } catch (err) {
      console.error('Failed to load recommended programs:', err);
      setError(err.response?.data?.detail || 'Erreur chargement programmes');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="recommended-programs loading">
        <span className="spinner"></span>
        Chargement programmes recommandés...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span className="icon">⚠️</span>
        {error}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="recommended-programs empty">
        <p>Aucun programme recommandé (score minimum: {minScore})</p>
      </div>
    );
  }

  return (
    <div className="recommended-programs">
      <h4>Programmes Recommandés</h4>
      <p className="subtitle">Score minimum: {minScore}/100</p>

      <div className="programs-list">
        {programs.map((program, index) => (
          <div key={index} className="program-card">
            <div className="program-header">
              <h5>{program.program_name}</h5>
              <span className="program-code">{program.program_code}</span>
            </div>

            <div className="program-score">
              <div 
                className="score-bar" 
                style={{ 
                  width: `${program.eligibility_score}%`,
                  backgroundColor: getScoreColor(program.eligibility_score)
                }}
              ></div>
              <span className="score-value">
                {program.eligibility_score?.toFixed(1)}/100
              </span>
            </div>

            <div className="program-recommendation">
              <span 
                className="badge"
                style={{ backgroundColor: getScoreColor(program.eligibility_score) }}
              >
                {program.recommendation_level}
              </span>
            </div>

            {program.blocking_factors && program.blocking_factors.length > 0 && (
              <div className="blocking-factors">
                <small>⚠️ Facteurs bloquants:</small>
                <ul>
                  {program.blocking_factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}