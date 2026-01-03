/**
 * 🇬🇦 RSU GABON - DASHBOARD CORRIGÉ
 * Standards Top 1% - Fix statistiques + programmes
 * 
 * ✅ CORRECTIONS:
 * - OverviewTab reçoit maintenant dashboardData (pas data)
 * - Programmes recommandés chargés indépendamment
 * - Props correctes passées à tous les composants
 * 
 * Fichier: src/pages/Dashboard.jsx - VERSION CORRIGÉE
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, RefreshCw, LogOut, AlertCircle, User
} from 'lucide-react';

// Hooks
import { useDashboard } from '../hooks/useDashboard';
import { usePrograms } from '../hooks/usePrograms';

// Components
import OverviewTab from '../components/Dashboard/OverviewTab';
import BeneficiariesTab from '../components/Dashboard/BeneficiariesTab';
import ProgramsTab from '../components/Dashboard/ProgramsTab';
import AnalyticsTab from '../components/Dashboard/AnalyticsTab';
import DeduplicationTab from '../components/Dashboard/DeduplicationTab';
import TabNavigation from '../components/Dashboard/TabNavigation';
import FamilyGraphTab from '../components/Dashboard/FamilyGraphTab';
import ServicesTab from '../components/Dashboard/ServicesTab';

// Services
import apiClient from '../services/api/apiClient';


export default function Dashboard() {
  const navigate = useNavigate();
  
  // ========== STATE ==========
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('rsu_last_active_tab') || 'overview';
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ========== HOOKS ==========
  
  // ✅ CORRECTION: Déstructurer correctement les données du hook
  const { 
    dashboardData,        // ← Contient overview, province_data, etc.
    beneficiaries,        // ← Liste bénéficiaires récents
    loading: dashboardLoading, 
    error: dashboardError,
    loadDashboard 
  } = useDashboard();

  const {
    programs,
    loading: programsLoading
  } = usePrograms({
    status: '',
    search: '',
    ordering: '-created_at'
  });

  // ========== EFFECTS ==========

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    localStorage.setItem('rsu_last_active_tab', activeTab);
  }, [activeTab]);

  // ✅ DEBUG: Afficher les données reçues
  useEffect(() => {
    if (dashboardData) {
      console.log('📊 Dashboard - Données reçues:', dashboardData);
      console.log('📊 Dashboard - Overview:', dashboardData.overview);
      console.log('📊 Dashboard - Bénéficiaires:', beneficiaries);
    }
  }, [dashboardData, beneficiaries]);

  // ========== HANDLERS ==========

  const loadCurrentUser = async () => {
    try {
      setUserLoading(true);
      const user = await apiClient.getCurrentUser();
      console.log('✅ Utilisateur chargé:', user);
      setCurrentUser(user);
      setUserError(null);
    } catch (error) {
      console.error('❌ Erreur chargement utilisateur:', error);
      setUserError('Impossible de charger les informations utilisateur');
      setCurrentUser({ username: 'admin', email: 'admin' });
    } finally {
      setUserLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadDashboard();
      console.log('✅ Dashboard rafraîchi');
    } catch (error) {
      console.error('❌ Erreur refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rsu_last_active_tab');
    apiClient.logout();
    navigate('/login');
  };

  const handleTabChange = (newTab) => {
    console.log(`📊 Navigation: ${activeTab} → ${newTab}`);
    setActiveTab(newTab);
  };

  // ========== RENDER HELPERS ==========

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'overview':
          // ✅ CORRECTION: Passer dashboardData directement (pas data)
          return (
            <OverviewTab 
              data={dashboardData}
              loading={dashboardLoading}
              error={dashboardError}
            />
          );
        
        case 'beneficiaries':
          return <BeneficiariesTab />;
        
        case 'programs':
          return <ProgramsTab />;
        
        case 'services':
          return <ServicesTab />;
        
        case 'analytics':
          return <AnalyticsTab />;
        
        case 'deduplication':
          return <DeduplicationTab />;

        case 'family-graph':
          return <FamilyGraphTab />;
        
        default:
          return (
            <OverviewTab 
              data={dashboardData}
              loading={dashboardLoading}
              error={dashboardError}
            />
          );
      }
    } catch (error) {
      console.error('❌ Erreur rendu onglet:', error);
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-sm text-red-700 mb-4">
            Une erreur est survenue lors du chargement de cet onglet.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Recharger la page
          </button>
        </div>
      );
    }
  };

  const renderLoadingFallback = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );

  // ========== MAIN RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    RSU Gabon Dashboard
                  </h1>
                  <p className="text-xs text-gray-500">
                    Registre Social Unique du Gabon
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <div className="text-sm">
                  {userLoading ? (
                    <span className="text-gray-500">Chargement...</span>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">
                        {currentUser?.username || 'Admin'}
                      </span>
                      {currentUser?.email && (
                        <span className="text-gray-500 ml-2 text-xs">
                          ({currentUser.email})
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Rafraîchir les données"
              >
                <RefreshCw 
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                />
                <span className="hidden sm:inline">
                  {isRefreshing ? 'Actualisation...' : 'Actualiser'}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Error Alert */}
      {userError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ Mode dégradé activé
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                {userError}. Certaines fonctionnalités peuvent être limitées.
              </p>
            </div>
            <button
              onClick={() => setUserError(null)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Error Alert */}
      {dashboardError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">
                Erreur de chargement des données
              </p>
              <p className="text-xs text-red-700 mt-1">
                {dashboardError}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={renderLoadingFallback()}>
          {renderTabContent()}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-12">
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <p>© 2024-2025 RSU Gabon - Registre Social Unique du Gabon</p>
              <p className="text-xs mt-1">
                Financé par la Banque Mondiale - Digital Gabon Initiative
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-blue-600">Standards Top 1%</p>
              <p className="text-xs mt-1">
                Version {process.env.REACT_APP_VERSION || '2.0.0'}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}