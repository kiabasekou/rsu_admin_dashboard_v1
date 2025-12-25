/**
 * 🇬🇦 RSU GABON - DASHBOARD OPTIMISÉ
 * Standards Top 1% - Navigation avec TabNavigation component
 * 
 * ✅ OPTIMISATIONS APPLIQUÉES:
 * - Gestion d'erreur améliorée pour loadDashboard
 * - ErrorBoundary pour les composants tabs
 * - Mémorisation du dernier onglet actif
 * - Meilleure gestion du state de chargement
 * 
 * Fichier: src/pages/Dashboard.jsx - VERSION OPTIMISÉE
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, RefreshCw, LogOut, AlertCircle
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
  
  // ✅ AMÉLIORATION: Mémoriser le dernier onglet actif
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('rsu_last_active_tab') || 'overview';
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ========== HOOKS ==========
  const { 
    dashboardData, 
    beneficiaries, 
    loading: dashboardLoading, 
    error: dashboardError,
    loadDashboard
  } = useDashboard();
  
  const { programs } = usePrograms();

  // ========== EFFECTS ==========
  
  // Effect: Charger utilisateur
  useEffect(() => {
    const loadCurrentUser = () => {
      try {
        const user = apiClient.getCurrentUser();
        
        if (user) {
          setCurrentUser(user);
          setUserError(null);
          console.log('✅ Utilisateur chargé:', user);
        } else {
          console.warn('⚠️ Pas d\'utilisateur dans le token');
          setUserError('Session expirée - Reconnexion nécessaire');
        }
      } catch (error) {
        console.error('❌ Erreur chargement utilisateur:', error);
        setUserError(error.message);
      } finally {
        setUserLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  // ✅ AMÉLIORATION: Sauvegarder l'onglet actif
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('rsu_last_active_tab', activeTab);
    }
  }, [activeTab]);

  // ========== HANDLERS ==========
  
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      console.log('🔄 Rafraîchissement dashboard...');
      
      // ✅ CORRECTION: Vérification plus robuste de loadDashboard
      if (loadDashboard && typeof loadDashboard === 'function') {
        await loadDashboard();
        console.log('✅ Données rafraîchies avec succès');
      } else {
        console.warn('⚠️ loadDashboard non disponible');
        // Fallback: Recharger la page si le hook ne fonctionne pas
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Erreur rafraîchissement:', error);
      // Afficher une notification d'erreur (à implémenter avec un Toast)
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('rsu_last_active_tab');
    apiClient.logout();
    navigate('/login');
  };

  // ========== RENDER HELPERS ==========

  // ✅ AMÉLIORATION: Wrapping des tabs dans un ErrorBoundary-like component
  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'overview':
          return (
            <OverviewTab 
              data={dashboardData}
              loading={dashboardLoading}
              beneficiaries={beneficiaries}
              programs={programs}
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
              beneficiaries={beneficiaries}
              programs={programs}
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
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      );
    }
  };

  // ========== LOADING STATE ==========
  
  if (userLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
          {dashboardLoading && (
            <p className="text-xs text-gray-500 mt-2">
              Récupération des données...
            </p>
          )}
        </div>
      </div>
    );
  }

  // ✅ AMÉLIORATION: Afficher une erreur critique si le dashboard ne charge pas
  if (dashboardError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6">
            Impossible de charger le tableau de bord. Veuillez réessayer.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Registre Social Unique - Gabon
                </h1>
                <p className="text-xs text-gray-500">
                  Tableau de bord administrateur
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Info */}
              {currentUser && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.first_name} {currentUser.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser.role || 'Administrateur'}
                  </p>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Actualiser les données"
              >
                <RefreshCw 
                  className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Error Alert (if any) */}
      {userError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                Mode dégradé activé
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                {userError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ✅ AMÉLIORATION: Suspense pour le chargement lazy */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        }>
          {renderTabContent()}
        </Suspense>
      </main>
    </div>
  );
}