/**
 * 🇬🇦 RSU GABON - REPORT EXPORTS COMPONENT
 * Standards Top 1% - Production Ready
 * 
 * Fichier: src/components/Dashboard/AnalyticsTab/ReportExports.jsx
 * 
 * BASÉ SUR LE MODÈLE BACKEND RÉEL:
 * - apps/analytics/models/data_export.py (DataExport)
 * - apps/analytics/serializers/analytics_serializers.py (DataExportSerializer)
 * - apps/analytics/views.py (DataExportViewSet)
 * 
 * CHAMPS MODÈLE (Source of Truth):
 * - id, export_id, name, description
 * - export_type, export_type_display
 * - export_format, export_format_display
 * - requested_by, requested_by_name, requested_at
 * - status, status_display
 * - started_at, completed_at, processing_time
 * - file_path, file_size, rows_exported
 * - download_count, last_downloaded
 * - download_url, expires_at, is_expired_flag
 * - compress_output, anonymize_data
 * 
 * API ENDPOINTS:
 * - GET /api/v1/analytics/data-exports/
 * - POST /api/v1/analytics/data-exports/
 * - GET /api/v1/analytics/data-exports/{id}/download/
 */

import React, { useState, useEffect } from 'react';

import {
  Download, FileText, Clock, CheckCircle, XCircle,
  AlertTriangle, Plus, RefreshCw, Filter, Calendar,
  File, FileSpreadsheet, FileJson, FileCode, FileType // Remplacé FilePdf par FileType
} from 'lucide-react';
import apiClient from '../../../services/api/apiClient';


// ============================================================================
// CONFIGURATION
// ============================================================================

const EXPORT_TYPES = [
  { value: 'BENEFICIARIES', label: 'Bénéficiaires', icon: FileText },
  { value: 'HOUSEHOLDS', label: 'Ménages', icon: FileText },
  { value: 'PROGRAMS', label: 'Programmes', icon: FileText },
  { value: 'ENROLLMENTS', label: 'Inscriptions', icon: FileText },
  { value: 'PAYMENTS', label: 'Paiements', icon: FileText },
  { value: 'VULNERABILITY', label: 'Vulnérabilité', icon: FileText },
  { value: 'ANALYTICS', label: 'Analytics', icon: FileText }
];

const EXPORT_FORMATS = [
  { value: 'EXCEL', label: 'Excel (.xlsx)', icon: FileSpreadsheet, color: 'green' },
  { value: 'CSV', label: 'CSV', icon: File, color: 'blue' },
  { value: 'PDF', label: 'PDF', icon: FileText, color: 'red' }, // Utilise FileText ou FileType
  { value: 'JSON', label: 'JSON', icon: FileJson, color: 'purple' },
  { value: 'XML', label: 'XML', icon: FileCode, color: 'orange' }
];

const STATUS_CONFIG = {
  PENDING: {
    label: 'En Attente',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: Clock
  },
  PROCESSING: {
    label: 'En Cours',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: RefreshCw
  },
  COMPLETED: {
    label: 'Terminé',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle
  },
  FAILED: {
    label: 'Échoué',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle
  },
  EXPIRED: {
    label: 'Expiré',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: AlertTriangle
  }
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function ReportExports() {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewExportModal, setShowNewExportModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    export_type: '',
    ordering: '-requested_at'
  });

  useEffect(() => {
    loadExports();
  }, [filters]);

  // ==========================================================================
  // CHARGEMENT DES EXPORTS
  // ==========================================================================

  const loadExports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/analytics/data-exports/', {
        params: filters
      });

      const data = response.results || response;
      setExports(Array.isArray(data) ? data : []);
      
      console.log(`✅ ${exports.length} exports chargés`);

    } catch (err) {
      console.error('❌ Erreur chargement exports:', err);
      setError(err.response?.data?.detail || 'Erreur de chargement');
      setExports([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // TÉLÉCHARGER UN EXPORT
  // ==========================================================================

  const handleDownload = async (exportItem) => {
    try {
      console.log(`📥 Téléchargement export ${exportItem.name}...`);

      // Option 1: Si download_url fourni par le backend
      if (exportItem.download_url) {
        window.open(exportItem.download_url, '_blank');
        return;
      }

      // Option 2: Appeler endpoint download
      const response = await apiClient.get(
        `/analytics/data-exports/${exportItem.id}/download/`,
        { responseType: 'blob' }
      );

      // Créer lien de téléchargement
      const blob = new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportItem.name}.${exportItem.export_format.toLowerCase()}`;
      link.click();
      window.URL.revokeObjectURL(url);

      // Recharger pour mettre à jour download_count
      await loadExports();

      console.log('✅ Téléchargement réussi');

    } catch (err) {
      console.error('❌ Erreur téléchargement:', err);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    }
  };

  // ==========================================================================
  // FORMATER TAILLE FICHIER
  // ==========================================================================

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // ==========================================================================
  // FORMATER DURÉE
  // ==========================================================================

  const formatDuration = (seconds) => {
    if (!seconds) return '-';
    
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  // ==========================================================================
  // FORMATER DATE
  // ==========================================================================

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ==========================================================================
  // ICÔNE SELON FORMAT
  // ==========================================================================

  const getFormatIcon = (format) => {
    const config = EXPORT_FORMATS.find(f => f.value === format);
    if (!config) return File;
    
    const Icon = config.icon;
    const colorClasses = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };

    return <Icon className={`w-5 h-5 ${colorClasses[config.color]}`} />;
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
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded"></div>
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
          onClick={loadExports}
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
          <h2 className="text-2xl font-bold text-gray-900">
            Exports de Données
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {exports.length} export{exports.length > 1 ? 's' : ''} disponible{exports.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filtres */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En Attente</option>
            <option value="PROCESSING">En Cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="FAILED">Échoué</option>
          </select>

          <select
            value={filters.export_type}
            onChange={(e) => setFilters({ ...filters, export_type: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les types</option>
            {EXPORT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={loadExports}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Actualiser</span>
          </button>

          {/* Nouvel export */}
          <button
            onClick={() => setShowNewExportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Nouvel Export</span>
          </button>
        </div>
      </div>

      {/* LISTE DES EXPORTS */}
      {exports.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun export disponible
          </h3>
          <p className="text-gray-500 mb-6">
            Créez votre premier export pour commencer.
          </p>
          <button
            onClick={() => setShowNewExportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer un export
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Export
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Détails
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exports.map(exp => {
                const statusConfig = STATUS_CONFIG[exp.status] || STATUS_CONFIG.PENDING;
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                    {/* NOM + FORMAT */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFormatIcon(exp.export_format)}
                        <div>
                          <div className="font-medium text-gray-900">{exp.name}</div>
                          <div className="text-xs text-gray-500">{exp.export_format_display}</div>
                        </div>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {exp.export_type_display}
                      </span>
                    </td>

                    {/* STATUT */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </td>

                    {/* DÉTAILS */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 space-y-1">
                        {exp.rows_exported > 0 && (
                          <div>{exp.rows_exported.toLocaleString()} lignes</div>
                        )}
                        {exp.file_size > 0 && (
                          <div>{formatFileSize(exp.file_size)}</div>
                        )}
                        {exp.processing_time > 0 && (
                          <div>{formatDuration(exp.processing_time)}</div>
                        )}
                        {exp.download_count > 0 && (
                          <div>{exp.download_count} téléchargement{exp.download_count > 1 ? 's' : ''}</div>
                        )}
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">
                        <div>{formatDate(exp.requested_at)}</div>
                        {exp.expires_at && !exp.is_expired_flag && (
                          <div className="text-yellow-600 mt-1">
                            Expire: {formatDate(exp.expires_at)}
                          </div>
                        )}
                        {exp.is_expired_flag && (
                          <div className="text-red-600 mt-1">Expiré</div>
                        )}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      {exp.status === 'COMPLETED' && !exp.is_expired_flag ? (
                        <button
                          onClick={() => handleDownload(exp)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Télécharger
                        </button>
                      ) : exp.status === 'PROCESSING' ? (
                        <div className="text-sm text-gray-500 italic">Traitement...</div>
                      ) : exp.status === 'FAILED' ? (
                        <div className="text-sm text-red-600">Échoué</div>
                      ) : (
                        <div className="text-sm text-gray-500">-</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL NOUVEL EXPORT (À implémenter) */}
      {showNewExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Nouvel Export</h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en développement. Utilisez l'API backend pour créer des exports.
            </p>
            <button
              onClick={() => setShowNewExportModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}