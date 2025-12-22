/**
 * 🇬🇦 RSU Gabon - Program Selector Component FINAL
 * Standards Top 1% - Sélection Programme avec Infos
 * Fichier: rsu_admin_dashboard_v1/src/components/common/ProgramSelector.jsx
 */

import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, Users, Calendar } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export default function ProgramSelector({ onSelect, selectedProgram }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ apiClient retourne déjà .data automatiquement
      const response = await apiClient.get('/programs/programs/', {
        params: { status: 'ACTIVE' }
      });
      // ✅ Pas de .data ici car apiClient l'a déjà fait
      setPrograms(response.results || []);
    } catch (err) {
      console.error('Error loading programs:', err);
      setError('Erreur chargement programmes');
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (amount) => {
    return new Intl.NumberFormat('fr-GA', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="program-selector loading">
        <div className="spinner"></div>
        <p>Chargement des programmes...</p>
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

  return (
    <div className="program-selector">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sélectionner un Programme
      </label>

      <div className="programs-grid">
        {programs.map((program) => (
          <button
            key={program.id}
            onClick={() => onSelect(program)}
            className={`program-card ${
              selectedProgram?.id === program.id ? 'selected' : ''
            }`}
          >
            <div className="program-header">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="program-code">{program.code}</span>
            </div>

            <h4 className="program-name">{program.name}</h4>

            <div className="program-stats">
              <div className="stat-item">
                <DollarSign className="w-4 h-4" />
                <span>{formatBudget(program.benefit_amount || 0)}</span>
              </div>
              <div className="stat-item">
                <Users className="w-4 h-4" />
                <span>
                  {program.current_beneficiaries || 0}
                  {program.max_beneficiaries && ` / ${program.max_beneficiaries}`}
                </span>
              </div>
              <div className="stat-item">
                <Calendar className="w-4 h-4" />
                <span>{program.duration_months || 0} mois</span>
              </div>
            </div>

            {selectedProgram?.id === program.id && (
              <div className="selected-indicator">
                ✓ Sélectionné
              </div>
            )}
          </button>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun programme actif disponible
        </div>
      )}
    </div>
  );
}