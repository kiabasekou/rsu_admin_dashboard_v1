/**
 * 🇬🇦 RSU Gabon - Eligibility Results Component FIXED
 * Standards Top 1% - Aligné sur API Response Réelle
 */

import React from 'react';

export default function EligibilityResults({ data }) {
  if (!data) return null;

  // ✅ CORRECTION 1: Utiliser les vrais noms de champs de l'API
  const score = parseFloat(data.eligibility_score) || 0;
  const priority = parseInt(data.processing_priority, 10) || 99;  // ✅ processing_priority, pas priority_ranking

  // 2. Helpers de style (Design System RSU)
  const getScoreColor = (val) => {
    if (val >= 80) return '#10b981'; // Success (Vert Emerald)
    if (val >= 50) return '#f59e0b'; // Warning (Orange)
    return '#ef4444';                // Danger (Rouge)
  };

  const getStatusLabel = (status) => {
    const labels = {
      'HIGHLY_RECOMMENDED': 'Fortement Recommandé',
      'RECOMMENDED': 'Recommandé',
      'CONDITIONALLY_ELIGIBLE': 'Éligible sous conditions',
      'NOT_ELIGIBLE': 'Non Éligible'
    };
    return labels[status] || status;
  };

  const getPriorityBadge = (prio) => {
    const badges = {
      1: { label: 'Priorité Critique (1)', color: '#7f1d1d' },
      2: { label: 'Haute Priorité (2)', color: '#9a3412' },
      3: { label: 'Priorité Normale (3)', color: '#92400e' },
      4: { label: 'Priorité Basse (4)', color: '#3f6212' },
      5: { label: 'Suivi Standard (5)', color: '#166534' }
    };
    return badges[prio] || { label: `Priorité ${prio}`, color: '#374151' };
  };

  const dynamicColor = getScoreColor(score);
  const priorityInfo = getPriorityBadge(priority);

  return (
    <div className="eligibility-results" style={{ borderLeft: `5px solid ${dynamicColor}`, padding: '20px', backgroundColor: '#fff', borderRadius: '8px', marginTop: '20px' }}>
      
      {/* Header avec Visualisation du Score */}
      <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="score-card" style={{ 
          border: `2px solid ${dynamicColor}`, 
          padding: '15px', 
          borderRadius: '12px',
          textAlign: 'center',
          backgroundColor: `${dynamicColor}08` // 8% d'opacité
        }}>
          <div className="score-value" style={{ color: dynamicColor, fontSize: '2rem', fontWeight: '800' }}>
            {score.toFixed(1)}%
          </div>
          <div className="score-label" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Score d'Éligibilité
          </div>
        </div>

        <div className="status-info" style={{ textAlign: 'right' }}>
          <div 
            className="status-badge" 
            style={{ 
              backgroundColor: dynamicColor, 
              color: 'white', 
              padding: '6px 16px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '8px'
            }}
          >
            {getStatusLabel(data.recommendation_level)}
          </div>
          <br />
          <span 
            className="priority-badge"
            style={{ 
              backgroundColor: priorityInfo.color, 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '4px', 
              fontSize: '0.75rem' 
            }}
          >
            {priorityInfo.label}
          </span>
        </div>
      </div>

      {/* Détails du Programme */}
      <div className="program-info" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#1f2937' }}>{data.program_name || 'Programme'}</h4>
        <code style={{ color: '#6b7280' }}>{data.program_code}</code>
      </div>

      {/* Section Critères (Grid pour plus de clarté) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Facteurs d'Éligibilité (Points Forts) */}
        {data.eligibility_factors?.length > 0 && (
          <div className="criteria-section success" style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px' }}>
            <h5 style={{ color: '#166534', marginTop: 0 }}>✅ Facteurs Favorables</h5>
            <ul style={{ fontSize: '0.9rem', color: '#166534', paddingLeft: '20px' }}>
              {data.eligibility_factors.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}

        {/* Facteurs Bloquants */}
        {data.blocking_factors?.length > 0 && (
          <div className="criteria-section warning" style={{ backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px' }}>
            <h5 style={{ color: '#991b1b', marginTop: 0 }}>⚠️ Facteurs Bloquants</h5>
            <ul style={{ fontSize: '0.9rem', color: '#991b1b', paddingLeft: '20px' }}>
              {data.blocking_factors.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Notes d'Évaluation */}
      {data.assessment_notes && (
        <div className="recommendation-notes" style={{ marginTop: '20px', fontStyle: 'italic', color: '#4b5563', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <strong>Notes d'Évaluation :</strong>
          <p>{data.assessment_notes}</p>
        </div>
      )}

      {/* Footer Meta */}
      <div className="assessment-meta" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.75rem' }}>
        <span>Bénéficiaire : {data.person_name || 'N/A'} ({data.person_rsu_id || 'N/A'})</span>
        <span>Évaluation du {data.assessment_date ? new Date(data.assessment_date).toLocaleDateString('fr-GA') : 'Date inconnue'}</span>
      </div>
    </div>
  );
}