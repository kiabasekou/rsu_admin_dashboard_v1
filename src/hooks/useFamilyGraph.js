/**
 * 🇬🇦 RSU Gabon - useFamilyGraph Hook
 * Standards Top 1% - Gestion state Family Graph
 * Fichier: src/hooks/useFamilyGraph.js
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { familyGraphAPI } from '../services/api/familyGraphAPI';

export function useFamilyGraph() {
  // ========== STATE ==========
  const [relationships, setRelationships] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [statistics, setStatistics] = useState({
    relationships: {
      total: 0,
      verified: 0,
      fraud_flagged: 0
    },
    networks: {
      total: 0,
      active: 0,
      high_risk: 0
    },
    dependencies: {
      total: 0,
      critical: 0,
      urgent: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // ========== REFS ==========
  const hasMounted = useRef(false);

  // ========== LOAD RELATIONSHIPS ==========
  const loadRelationships = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Loading relationships with filters:', filters);
      
      const response = await familyGraphAPI.getRelationships(filters);
      
      // Gérer pagination Django ou liste directe
      const relationshipsList = response.data?.results || response.data || [];
      
      setRelationships(relationshipsList);
      console.log(`✅ Relationships loaded: ${relationshipsList.length}`);
      
      setLastUpdate(new Date());
      return relationshipsList;
      
    } catch (err) {
      console.error('❌ Error loading relationships:', err);
      setError(err.message || 'Erreur de chargement des relations');
      setRelationships([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== LOAD RELATIONSHIPS BY PERSON ==========
  const loadRelationshipsByPerson = useCallback(async (personId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`📥 Loading relationships for person: ${personId}`);
      
      const response = await familyGraphAPI.getRelationshipsByPerson(personId);
      
      const relationshipsList = response.data?.relationships || [];
      
      setRelationships(relationshipsList);
      console.log(`✅ Person relationships loaded: ${relationshipsList.length}`);
      
      return relationshipsList;
      
    } catch (err) {
      console.error('❌ Error loading person relationships:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== LOAD NETWORKS ==========
  const loadNetworks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Loading networks with filters:', filters);
      
      const response = await familyGraphAPI.getNetworks(filters);
      
      const networksList = response.data?.results || response.data || [];
      
      setNetworks(networksList);
      console.log(`✅ Networks loaded: ${networksList.length}`);
      
      setLastUpdate(new Date());
      return networksList;
      
    } catch (err) {
      console.error('❌ Error loading networks:', err);
      setError(err.message || 'Erreur de chargement des réseaux');
      setNetworks([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== LOAD DEPENDENCIES ==========
  const loadDependencies = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Loading dependencies with filters:', filters);
      
      const response = await familyGraphAPI.getDependencies(filters);
      
      const dependenciesList = response.data?.results || response.data || [];
      
      setDependencies(dependenciesList);
      console.log(`✅ Dependencies loaded: ${dependenciesList.length}`);
      
      setLastUpdate(new Date());
      return dependenciesList;
      
    } catch (err) {
      console.error('❌ Error loading dependencies:', err);
      setError(err.message || 'Erreur de chargement des dépendances');
      setDependencies([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== LOAD STATISTICS ==========
  const loadStatistics = useCallback(async () => {
    try {
      console.log('📊 Loading Family Graph statistics...');
      
      const response = await familyGraphAPI.getStatistics();
      
      if (response.data) {
        setStatistics(response.data);
        console.log('✅ Statistics loaded:', response.data);
      }
      
      return response.data;
      
    } catch (err) {
      console.error('❌ Error loading statistics:', err);
      // Garder les valeurs par défaut en cas d'erreur
      return statistics;
    }
  }, []);

  // ========== VERIFY RELATIONSHIP ==========
  const verifyRelationship = useCallback(async (relationshipId, data = {}) => {
    try {
      console.log(`✅ Verifying relationship ${relationshipId}...`);
      
      const response = await familyGraphAPI.verifyRelationship(relationshipId, {
        verification_method: 'MANUAL_REVIEW',
        verification_notes: data.notes || '',
        ...data
      });
      
      console.log('✅ Relationship verified successfully');
      
      // Recharger les relations pour refléter la vérification
      await loadRelationships();
      
      return response.data;
      
    } catch (err) {
      console.error('❌ Error verifying relationship:', err);
      setError(err.message || 'Erreur de vérification');
      throw err;
    }
  }, [loadRelationships]);

  // ========== CREATE NETWORK ==========
  const createNetwork = useCallback(async (data) => {
    try {
      console.log('🏗️ Creating network...', data);
      
      const response = await familyGraphAPI.createNetworkFromHousehold(data);
      
      console.log('✅ Network created successfully');
      
      // Recharger les réseaux
      await loadNetworks();
      
      return response.data;
      
    } catch (err) {
      console.error('❌ Error creating network:', err);
      setError(err.message || 'Erreur de création du réseau');
      throw err;
    }
  }, [loadNetworks]);

  // ========== ANALYZE HOUSEHOLD ==========
  const analyzeHousehold = useCallback(async (householdId) => {
    try {
      console.log(`🔍 Analyzing household ${householdId}...`);
      
      const response = await familyGraphAPI.analyzeHousehold(householdId);
      
      console.log('✅ Household analyzed successfully');
      
      // Recharger les dépendances
      await loadDependencies();
      
      return response.data;
      
    } catch (err) {
      console.error('❌ Error analyzing household:', err);
      setError(err.message || 'Erreur d\'analyse du ménage');
      throw err;
    }
  }, [loadDependencies]);

  // ========== REFRESH ALL DATA ==========
  const refreshAllData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Refreshing all Family Graph data...');
      
      await Promise.all([
        loadRelationships(),
        loadNetworks(),
        loadDependencies(),
        loadStatistics()
      ]);
      
      console.log('✅ All data refreshed successfully');
      
    } catch (err) {
      console.error('❌ Error refreshing data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadRelationships, loadNetworks, loadDependencies, loadStatistics]);

  // ========== INITIAL LOAD ==========
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      
      // Charger uniquement les statistiques au montage initial
      // Les composants spécifiques chargeront leurs données
      loadStatistics();
    }
  }, [loadStatistics]);

  // ========== RETURN ==========
  return {
    // State
    relationships,
    networks,
    dependencies,
    statistics,
    loading,
    error,
    lastUpdate,
    
    // Actions
    loadRelationships,
    loadRelationshipsByPerson,
    loadNetworks,
    loadDependencies,
    loadStatistics,
    verifyRelationship,
    createNetwork,
    analyzeHousehold,
    refreshAllData
  };
}

export default useFamilyGraph;