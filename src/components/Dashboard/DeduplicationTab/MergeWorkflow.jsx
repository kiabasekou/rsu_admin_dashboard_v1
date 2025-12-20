/**
 * 🇬🇦 RSU GABON - MERGE WORKFLOW COMPONENT
 * Standards Top 1% - Production Ready
 * 
 * Fichier: src/components/Dashboard/DeduplicationTab/MergeWorkflow.jsx
 * 
 * BASÉ SUR LE MODÈLE BACKEND RÉEL:
 * - apps/deduplication/models/merge_candidate.py (MergeCandidate)
 * - apps/deduplication/serializers/dedup_serializers.py (MergeCandidateSerializer)
 * - apps/deduplication/views/dedup_views.py (MergeCandidateViewSet)
 * 
 * CHAMPS MODÈLE (Source of Truth):
 * - id, merge_id, detection, similarity_score
 * - primary_person, secondary_person, primary_name, secondary_name
 * - merge_status, status_display
 * - merge_strategy, merge_confidence
 * - requires_approval, approval_level
 * - fields_to_merge, merge_plan, field_conflicts
 * - submitted_by, submitted_at, approved_by, approved_at
 * - merged_by, merged_at, merged_person
 * - can_rollback, rolled_back
 * 
 * API ENDPOINTS:
 * - GET /api/v1/deduplication/merges/
 * - POST /api/v1/deduplication/merges/{id}/approve/
 * - POST /api/v1/deduplication/merges/{id}/reject/
 * - POST /api/v1/deduplication/merges/{id}/execute/
 * - POST /api/v1/deduplication/merges/{id}/rollback/
 */

import React, { useState, useEffect } from 'react';
import {
  GitMerge, CheckCircle, XCircle, Clock, AlertTriangle,
  User, Users, RefreshCw, ChevronRight, Eye, Undo,
  FileText, Calendar, Shield, Database
} from 'lucide-react';
import apiClient from '../../../services/api/apiClient';


// ============================================================================
// CONFIGURATION
// ============================================================================

const MERGE_STATUS = {
  PENDING: { 
    label: 'En Attente', 
    color: 'bg-gray-100 text-gray-800 border-gray-300', 
    icon: Clock 
  },
  UNDER_REVIEW: { 
    label: 'En Révision', 
    color: 'bg-blue-100 text-blue-800 border-blue-300', 
    icon: Eye 
  },
  APPROVED: { 
    label: 'Approuvé', 
    color: 'bg-green-100 text-green-800 border-green-300', 
    icon: CheckCircle 
  },
  REJECTED: { 
    label: 'Rejeté', 
    color: 'bg-red-100 text-red-800 border-red-300', 
    icon: XCircle 
  },
  MERGED: { 
    label: 'Fusionné', 
    color: 'bg-purple-100 text-purple-800 border-purple-300', 
    icon: GitMerge 
  }
};

const APPROVAL_LEVELS = {
  NONE: 'Aucune',
  OPERATOR: 'Opérateur',
  SUPERVISOR: 'Superviseur',
  ADMIN: 'Administrateur'
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function MergeWorkflow() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    merge_status: '',
    requires_approval: '',
    ordering: '-merge_confidence'
  });

  useEffect(() => {
    loadCandidates();
  }, [filters]);

  // ==========================================================================
  // CHARGEMENT DES CANDIDATS
  // ==========================================================================

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/deduplication/merges/', {
        params: filters
      });

      const data = response.results || response;
      setCandidates(Array.isArray(data) ? data : []);
      
      console.log(`✅ ${candidates.length} candidats fusion chargés`);

    } catch (err) {
      console.error('❌ Erreur chargement candidats:', err);
      setError(err.response?.data?.detail || 'Erreur de chargement');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // APPROUVER FUSION
  // ==========================================================================

  const handleApprove = async (candidateId, notes = '') => {
    try {
      console.log(`✅ Approbation fusion ${candidateId}...`);

      await apiClient.post(`/deduplication/merges/${candidateId}/approve/`, {
        notes
      });

      alert('Fusion approuvée avec succès');
      await loadCandidates();

    } catch (err) {
      console.error('❌ Erreur approbation:', err);
      alert(err.response?.data?.error || 'Erreur lors de l\'approbation');
    }
  };

  // ==========================================================================
  // REJETER FUSION
  // ==========================================================================

  const handleReject = async (candidateId) => {
    const reason = prompt('Raison du rejet:');
    
    if (!reason || reason.trim() === '') {
      alert('Une raison est requise pour rejeter la fusion');
      return;
    }

    try {
      console.log(`❌ Rejet fusion ${candidateId}...`);

      await apiClient.post(`/deduplication/merges/${candidateId}/reject/`, {
        reason
      });

      alert('Fusion rejetée avec succès');
      await loadCandidates();

    } catch (err) {
      console.error('❌ Erreur rejet:', err);
      alert(err.response?.data?.error || 'Erreur lors du rejet');
    }
  };

  // ==========================================================================
  // EXÉCUTER FUSION
  // ==========================================================================

  const handleExecute = async (candidateId) => {
    if (!window.confirm('⚠️ ATTENTION: Cette opération est irréversible. Confirmer la fusion ?')) {
      return;
    }

    try {
      console.log(`🔄 Exécution fusion ${candidateId}...`);

      const response = await apiClient.post(
        `/deduplication/merges/${candidateId}/execute/`
      );

      alert(`✅ Fusion exécutée avec succès\nPersonne résultante: ${response.merged_person_id}`);
      await loadCandidates();

    } catch (err) {
      console.error('❌ Erreur exécution:', err);
      alert(err.response?.data?.error || 'Erreur lors de l\'exécution');
    }
  };

  // ==========================================================================
  // ANNULER FUSION (ROLLBACK)
  // ==========================================================================

  const handleRollback = async (candidateId) => {
    if (!window.confirm('⚠️ Confirmer l\'annulation de la fusion ?')) {
      return;
    }

    try {
      console.log(`↩️ Rollback fusion ${candidateId}...`);

      await apiClient.post(`/deduplication/merges/${candidateId}/rollback/`);

      alert('Fusion annulée avec succès');
      await loadCandidates();

    } catch (err) {
      console.error('❌ Erreur rollback:', err);
      alert(err.response?.data?.error || 'Erreur lors de l\'annulation');
    }
  };

  // ==========================================================================
  // AFFICHER DÉTAILS
  // ==========================================================================

  const handleShowDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetailsModal(true);
  };

  // ==========================================================================
  // FORMATER DATE
  // ==========================================================================

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ==========================================================================
  // RENDER CONFIDENCE BADGE
  // ==========================================================================

  const renderConfidenceBadge = (confidence) => {
    let colorClass = 'bg-gray-100 text-gray-800';
    
    if (confidence >= 90) {
      colorClass = 'bg-green-100 text-green-800';
    } else if (confidence >= 75) {
      colorClass = 'bg-blue-100 text-blue-800';
    } else if (confidence >= 60) {
      colorClass = 'bg-yellow-100 text-yellow-800';
    } else {
      colorClass = 'bg-orange-100 text-orange-800';
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {confidence.toFixed(1)}% confiance
      </span>
    );
  };

  // ==========================================================================
  // RENDER LOADING
  // ==========================================================================

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-32 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==========================================================================
  // RENDER ERROR
  // ==========================================================================

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadCandidates}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // ==========================================================================
  // RENDER MAIN
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GitMerge className="w-7 h-7 text-purple-600" />
            Workflow de Fusion
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {candidates.length} candidat{candidates.length > 1 ? 's' : ''} de fusion
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filtres */}
          <select
            value={filters.merge_status}
            onChange={(e) => setFilters({ ...filters, merge_status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En Attente</option>
            <option value="UNDER_REVIEW">En Révision</option>
            <option value="APPROVED">Approuvé</option>
            <option value="REJECTED">Rejeté</option>
            <option value="MERGED">Fusionné</option>
          </select>

          <select
            value={filters.requires_approval}
            onChange={(e) => setFilters({ ...filters, requires_approval: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Approbation: Tous</option>
            <option value="true">Approbation requise</option>
            <option value="false">Pas d'approbation</option>
          </select>

          {/* Refresh */}
          <button
            onClick={loadCandidates}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Actualiser</span>
          </button>
        </div>
      </div>

      {/* LISTE DES CANDIDATS */}
      {candidates.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <GitMerge className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun candidat de fusion
          </h3>
          <p className="text-gray-500">
            Les doublons détectés apparaîtront ici pour fusion.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map(candidate => {
            const statusConfig = MERGE_STATUS[candidate.merge_status] || MERGE_STATUS.PENDING;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={candidate.id}
                className="bg-white rounded-lg shadow-md border-l-4 border-purple-500 p-6 hover:shadow-lg transition-shadow"
              >
                {/* HEADER */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">
                        {candidate.merge_id}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      {renderConfidenceBadge(candidate.merge_confidence)}
                    </div>
                    
                    {/* Personnes concernées */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          {candidate.primary_name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-900">
                          {candidate.secondary_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions rapides */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShowDetails(candidate)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Détails
                    </button>
                  </div>
                </div>

                {/* INFOS */}
                <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Stratégie</p>
                    <p className="text-sm font-medium text-gray-900">
                      {candidate.merge_strategy || 'Automatique'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Approbation</p>
                    <p className="text-sm font-medium text-gray-900">
                      {candidate.requires_approval ? (
                        <span className="text-orange-600 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {APPROVAL_LEVELS[candidate.approval_level] || 'Requise'}
                        </span>
                      ) : (
                        <span className="text-green-600">Non requise</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conflits</p>
                    <p className="text-sm font-medium text-gray-900">
                      {candidate.field_conflicts && Object.keys(candidate.field_conflicts).length > 0 ? (
                        <span className="text-red-600">
                          {Object.keys(candidate.field_conflicts).length} champ(s)
                        </span>
                      ) : (
                        <span className="text-green-600">Aucun</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rollback</p>
                    <p className="text-sm font-medium text-gray-900">
                      {candidate.can_rollback ? (
                        <span className="text-green-600">Possible</span>
                      ) : (
                        <span className="text-gray-400">Non</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-end gap-2">
                  {candidate.merge_status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(candidate.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approuver
                      </button>
                      <button
                        onClick={() => handleReject(candidate.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2 text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </button>
                    </>
                  )}

                  {candidate.merge_status === 'APPROVED' && (
                    <button
                      onClick={() => handleExecute(candidate.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2 text-sm font-medium"
                    >
                      <GitMerge className="w-4 h-4" />
                      Exécuter Fusion
                    </button>
                  )}

                  {candidate.merge_status === 'MERGED' && candidate.can_rollback && !candidate.rolled_back && (
                    <button
                      onClick={() => handleRollback(candidate.id)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center gap-2 text-sm font-medium"
                    >
                      <Undo className="w-4 h-4" />
                      Annuler Fusion
                    </button>
                  )}

                  {candidate.merge_status === 'REJECTED' && (
                    <div className="text-sm text-red-600">
                      Raison: {candidate.rejection_reason || 'Non spécifiée'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DÉTAILS (Simplifié) */}
      {showDetailsModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Détails de Fusion - {selectedCandidate.merge_id}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Plan de fusion */}
              {selectedCandidate.merge_plan && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">Plan de Fusion</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-xs text-gray-700 overflow-x-auto">
                      {JSON.stringify(selectedCandidate.merge_plan, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Historique</h4>
                <div className="space-y-2 text-sm">
                  {selectedCandidate.submitted_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Soumis: {formatDate(selectedCandidate.submitted_at)}</span>
                    </div>
                  )}
                  {selectedCandidate.approved_at && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Approuvé: {formatDate(selectedCandidate.approved_at)}</span>
                    </div>
                  )}
                  {selectedCandidate.merged_at && (
                    <div className="flex items-center gap-2">
                      <GitMerge className="w-4 h-4 text-purple-600" />
                      <span>Fusionné: {formatDate(selectedCandidate.merged_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}