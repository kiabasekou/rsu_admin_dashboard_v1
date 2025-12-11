/**
 * 🇬🇦 RSU Gabon - Dashboard Principal ENRICHI
 * Standards Top 1% - Intégration Analytics & Deduplication IA
 * Fichier: rsu_admin_dashboard_v1/src/pages/Dashboard.jsx
 */

import React, { useState, useCallback } from 'react';
import Header from '../components/Layout/Header';
import TabNavigation from '../components/Dashboard/TabNavigation';
import OverviewTab from '../components/Dashboard/OverviewTab';
import BeneficiariesTab from '../components/Dashboard/BeneficiariesTab';
import ProgramsTab from '../components/Dashboard/ProgramsTab';
import AnalyticsTab from '../components/Dashboard/AnalyticsTab'; // NOUVEAU
import DeduplicationTab from '../components/Dashboard/DeduplicationTab'; // NOUVEAU
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useDashboard, useBeneficiaries } from '../hooks/useDashboard';
import { usePrograms } from '../hooks/usePrograms';
import apiClient from '../services/api/apiClient';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser] = useState(() => apiClient.getCurrentUser() || {
    username: 'admin',
    user_type: 'ADMIN'
  });

  // ================================================================================
  // HOOKS DE DONNÉES
  // ================================================================================

  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refresh: refreshDashboard,
    lastUpdate
  } = useDashboard();

  const {
    beneficiaries,
    loading: beneficiariesLoading,
    error: beneficiariesError,
    pagination: beneficiariesPagination,
    refresh: refreshBeneficiaries,
  } = useBeneficiaries();

  const {
    programs,
    loading: programsLoading,
    error: programsError,
    refresh: refreshPrograms,
  } = usePrograms();

  // ================================================================================
  // HANDLERS
  // ================================================================================

  const handleSearch = useCallback((params) => {
    console.log(`🔍 Recherche dans l'onglet ${activeTab} avec:`, params);
  }, [activeTab]);

  const handleExport = useCallback(async () => {
    console.log('📥 Export des données...');
  }, []);

  const getCurrentRefresh = () => {
    switch (activeTab) {
      case 'overview':
        return refreshDashboard;
      case 'beneficiaries':
        return refreshBeneficiaries;
      case 'programs':
        return refreshPrograms;
      case 'analytics':
        return refreshDashboard; // Partage le hook dashboard
      case 'deduplication':
        return refreshDashboard;
      default:
        return () => console.log('No refresh action for this tab.');
    }
  };

  // ================================================================================
  // RENDER
  // ================================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        user={currentUser}
        onSearch={handleSearch}
        onExport={handleExport}
        activeTab={activeTab}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {lastUpdate && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-blue-600" size={20} />
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Données synchronisées</span>
                {' '}• Dernière mise à jour:{' '}
                {new Date(lastUpdate).toLocaleTimeString('fr-FR')}
              </p>
            </div>
            <button
              onClick={getCurrentRefresh()}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Actualiser maintenant
            </button>
          </div>
        )}

        {/* Error Banner */}
        {dashboardError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-sm text-red-800">
              <span className="font-semibold">Erreur de connexion:</span>
              {' '}{dashboardError}
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <OverviewTab
              data={dashboardData}
              loading={dashboardLoading}
              onRefresh={refreshDashboard}
            />
          )}

          {activeTab === 'beneficiaries' && (
            <BeneficiariesTab
              beneficiaries={beneficiaries}
              loading={beneficiariesLoading}
              pagination={beneficiariesPagination}
              onRefresh={refreshBeneficiaries}
            />
          )}

          {activeTab === 'programs' && (
            <ProgramsTab
              programs={programs}
              loading={programsLoading}
              onRefresh={refreshPrograms}
            />
          )}

          {/* ✨ NOUVEAUX ONGLETS IA */}
          {activeTab === 'analytics' && (
            <AnalyticsTab />
          )}

          {activeTab === 'deduplication' && (
            <DeduplicationTab />
          )}
        </div>
      </main>
    </div>
  );
}