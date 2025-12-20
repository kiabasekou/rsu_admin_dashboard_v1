/**
 * 🇬🇦 RSU GABON - DASHBOARD FINAL AVEC FAMILY GRAPH
 * Standards Top 1% - Navigation complète 6 onglets
 * 
 * FEATURES:
 * ✅ Analytics Tab (KPIs + Rapports)
 * ✅ Deduplication Tab (ML + Fusions)
 * ✅ Family Graph Tab (Relations + Réseaux) - NOUVEAU
 * 
 * Fichier: src/pages/Dashboard.jsx - VERSION FINALE
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, TrendingUp, RefreshCw, 
  FileText, Settings, LogOut, Network
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
import FamilyGraphTab from '../components/Dashboard/FamilyGraphTab';

// Services
import apiClient from '../services/api/apiClient';


export default function Dashboard() {
  const navigate = useNavigate();
  
  // ========== STATE ==========
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
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

  // ========== HANDLERS ==========
  
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      console.log('🔄 Rafraîchissement dashboard...');
      
      if (typeof loadDashboard === 'function') {
        await loadDashboard();
        console.log('✅ Données rafraîchies avec succès');
      } else {
        console.warn('⚠️ loadDashboard non disponible');
      }
    } catch (error) {
      console.error('❌ Erreur rafraîchissement:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    navigate('/login');
  };

  // ========== RENDER HELPERS ==========

  const renderTabContent = () => {
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
  };

  const getTabIcon = (tab) => {
    const icons = {
      overview: BarChart3,
      beneficiaries: Users,
      programs: FileText,
      analytics: TrendingUp,
      deduplication: Settings,
      'family-graph': Network
    };
    
    const Icon = icons[tab] || BarChart3;
    return <Icon className="w-5 h-5" />;
  };

  const getTabLabel = (tab) => {
    const labels = {
      overview: 'Vue d\'ensemble',
      beneficiaries: 'Bénéficiaires',
      programs: 'Programmes',
      analytics: 'Analytics',
      deduplication: 'Déduplication',
      'family-graph': 'Réseau Familial'
    };
    
    return labels[tab] || tab;
  };

  // ========== LOADING STATE ==========
  
  if (userLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
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

          {/* Tabs Navigation */}
          <div className="flex space-x-1 -mb-px">
            {['overview', 'beneficiaries', 'programs', 'analytics', 'deduplication', 'family-graph'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex items-center space-x-2 px-4 py-3 font-medium text-sm
                  border-b-2 transition-all duration-200
                  ${activeTab === tab
                    ? 'bg-white text-blue-600 border-blue-600 -mb-px'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {getTabIcon(tab)}
                <span>{getTabLabel(tab)}</span>
                
                {/* Badge AI pour Analytics & Deduplication */}
                {(tab === 'analytics' || tab === 'deduplication') && (
                  <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-bold rounded">
                    AI
                  </span>
                )}
                
                {/* Badge NEW pour Family Graph */}
                {tab === 'family-graph' && (
                  <span className="px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded">
                    NEW
                  </span>
                )}
              </button>
            ))}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </main>
    </div>
  );
}