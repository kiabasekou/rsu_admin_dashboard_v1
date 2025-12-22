/**
 * 🇬🇦 RSU Gabon - Eligibility Results Component
 * Standards Top 1% - Affichage Résultats Éligibilité
 * Fichier: rsu_admin_dashboard_v1/src/pages/Programs/EligibilityResults.jsx
 * 
 * STRUCTURE BACKEND (apps/services_app/models.py):
 * {
 *   person: {...},
 *   program_code: "AUF-2024",
 *   program_name: "Allocation Universelle Familiale",
 *   eligibility_status: "ELIGIBLE",
 *   eligibility_score: 85.50,
 *   matching_criteria: [...],
 *   missing_criteria: [...],
 *   priority_ranking: 1,
 *   recommendation_notes: "..."
 * }
 */

import React from 'react';

export default function EligibilityResults({ data }) {
  if (!data) return null;

  // Helper: Score color
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Vert
    if (score >= 50) return '#f59e0b'; // Orange
    return '#ef4444';                   // Rouge
  };

  // Helper: Status label
  const getStatusLabel = (status) => {
    const labels = {
      'ELIGIBLE': 'Éligible',
      'NOT_ELIGIBLE': 'Non Éligible',
      'PENDING': 'En Attente',
      'CONDITIONALLY_ELIGIBLE': 'Conditionnellement Éligible'
    };
    return labels[status] || status;
  };

  // Helper: Priority badge
  const getPriorityBadge = (priority) => {
    const badges = {
      1: { label: 'Priorité 1', color: '#dc2626' },
      2: { label: 'Priorité 2', color: '#ea580c' },
      3: { label: 'Priorité 3', color: '#f59e0b' },
      4: { label: 'Priorité 4', color: '#84cc16' },
      5: { label: 'Priorité 5', color: '#22c55e' }
    };
    return badges[priority] || { label: `Priorité ${priority}`, color: '#6b7280' };
  };

  const scoreColor = parseFloat(data.eligibility_score);
  const priorityBadge = getPriorityBadge(data.priority_ranking);

  return (
    <div className="eligibility-results">
      {/* Header avec Score */}
      <div className="results-header">
        <div className="score-card" style={{ borderColor: scoreColor }}>
          <div className="score-value" style={{ color: scoreColor }}>
            {parseFloat(data.eligibility_score).toFixed(1)}%  {/* ✅ Convertit en number */}
          </div>
          <div className="score-label">Score d'Éligibilité</div>
          
        </div>

        <div className="status-info">
          <span 
            className="status-badge" 
            style={{ backgroundColor: scoreColor }}
          >
            {getStatusLabel(data.eligibility_status)}
          </span>
          <span 
            className="priority-badge"
            style={{ backgroundColor: priorityBadge.color }}
          >
            {priorityBadge.label}
          </span>
        </div>
      </div>

      {/* Programme Info */}
      <div className="program-info">
        <h4>{data.program_name}</h4>
        <span className="program-code">{data.program_code}</span>
      </div>

      {/* Matching Criteria */}
      {data.matching_criteria && data.matching_criteria.length > 0 && (
        <div className="criteria-section success">
          <h5>✅ Critères Satisfaits</h5>
          <ul>
            {data.matching_criteria.map((criterion, i) => (
              <li key={i}>{criterion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Criteria */}
      {data.missing_criteria && data.missing_criteria.length > 0 && (
        <div className="criteria-section warning">
          <h5>❌ Critères Manquants</h5>
          <ul>
            {data.missing_criteria.map((criterion, i) => (
              <li key={i}>{criterion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation Notes */}
      {data.recommendation_notes && (
        <div className="recommendation-notes">
          <h5>📝 Recommandations</h5>
          <p>{data.recommendation_notes}</p>
        </div>
      )}

      {/* Person Info */}
      {data.person && (
        <div className="person-summary">
          <strong>Bénéficiaire:</strong> {data.person_name || data.person.full_name}
          {data.person_rsu_id && (
            <span className="rsu-id"> (ID: {data.person_rsu_id})</span>
          )}
        </div>
      )}

      {/* Assessment Date */}
      {data.assessment_date && (
        <div className="assessment-meta">
          <small>
            Évalué le: {new Date(data.assessment_date).toLocaleDateString('fr-GA')}
          </small>
        </div>
      )}
    </div>
  );
}