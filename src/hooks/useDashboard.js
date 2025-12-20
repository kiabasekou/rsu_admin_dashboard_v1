/**
 * 🇬🇦 RSU GABON - useDashboard Hook FINALISÉ
 * ============================================
 * Standards Top 1% - CORRECTIONS COMPLÈTES
 * 
 * PROBLÈMES RÉSOLUS:
 * ✅ Données non passées à OverviewTab (dashboardData → data.overview)
 * ✅ Structure correcte retournée
 * ✅ Fonction loadDashboard exportée
 * 
 * Fichier: src/hooks/useDashboard.js
 * Date: 18 Décembre 2025
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';
import ENDPOINTS from '../services/api/endpoints';

export function useDashboard() {
  // ========== STATE ==========
  const [dashboardData, setDashboardData] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // ========== LOAD DASHBOARD DATA ==========
  const loadDashboard = useCallback(async () => {
    console.log('🔄 useDashboard: Chargement données dashboard...');
    setLoading(true);
    setError(null);

    try {
      // Appel API backend
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.DASHBOARD);
      
      console.log('✅ useDashboard: Données reçues:', response);
      
      // ✅ CORRECTION: Stocker TOUTE la réponse (pas juste overview)
      setDashboardData(response);
      
      // Extraire bénéficiaires s'ils existent
      if (response.recent_activity) {
        setBeneficiaries(response.recent_activity);
      }
      
      setLastUpdate(new Date());
      setLoading(false);
      
    } catch (err) {
      console.error('❌ useDashboard: Erreur chargement:', err);
      setError(err.message || 'Erreur de connexion au backend');
      setLoading(false);
      
      // ✅ Données par défaut en cas d'erreur
      setDashboardData({
        overview: {
          total_persons: 0,
          total_households: 0,
          total_enrollments: 0,
          avg_vulnerability_score: 0
        },
        province_distribution: [],
        monthly_enrollments: [],
        vulnerability_distribution: [],
        recent_activity: []
      });
    }
  }, []);

  // ========== INITIAL LOAD ==========
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ========== RETURN ==========
  return {
    dashboardData,         // ✅ Toutes les données
    beneficiaries,         // ✅ Activité récente
    loading,               // ✅ État chargement
    error,                 // ✅ État erreur
    lastUpdate,            // ✅ Timestamp dernière màj
    loadDashboard          // ✅ Fonction pour recharger
  };
}

export default useDashboard;