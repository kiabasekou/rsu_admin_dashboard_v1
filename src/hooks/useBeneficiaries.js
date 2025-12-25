/**
 * 🇬🇦 RSU Gabon - useBeneficiaries Hook (CORRIGÉ)
 * Standards Top 1% - Gestion État Complète
 * 
 * ✅ CORRECTION MAJEURE #2: Gestion Pagination DRF
 * ❌ AVANT: setBeneficiaries(data.results || [])
 * ✅ APRÈS: const items = data?.results || (Array.isArray(data) ? data : [])
 * 
 * PROBLÈME RÉSOLU:
 * - Django REST Framework renvoie { count, next, previous, results: [...] }
 * - Le hook attendait parfois un tableau direct
 * - Erreur "map is not a function" quand data était un objet au lieu d'un tableau
 * - Lecture défensive avec fallback sur tableau vide
 */

import { useState, useCallback, useEffect } from 'react';
import beneficiariesAPI from '../services/api/beneficiariesAPI';

export function useBeneficiaries(initialFilters = {}) {
  // ==================== ÉTATS ====================
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // ==================== CHARGER BÉNÉFICIAIRES ====================
  
  /**
   * ✅ CORRECTION: Lecture défensive des données paginées
   */
  const loadBeneficiaries = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...filters,
        ...params,
      };

      const data = await beneficiariesAPI.getBeneficiaries(queryParams);

      // 🛡️ DEFENSIVE READING: Gestion des 2 formats possibles
      // Format 1 (DRF): { count: 100, results: [...] }
      // Format 2 (Direct): [...]
      const items = data?.results || (Array.isArray(data) ? data : []);
      const count = data?.count || (Array.isArray(data) ? data.length : 0);

      console.log(`✅ Bénéficiaires chargés: ${items.length}/${count}`);

      setBeneficiaries(items);
      setPagination(prev => ({
        ...prev,
        total: count,
        totalPages: Math.ceil(count / prev.pageSize),
      }));

    } catch (err) {
      setError(err);
      console.error('❌ Erreur chargement bénéficiaires:', err);
      
      // 🛡️ FALLBACK: Tableau vide en cas d'erreur
      setBeneficiaries([]);
      
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters]);

  // ==================== CRÉER BÉNÉFICIAIRE ====================
  
  const createBeneficiary = useCallback(async (data) => {
    try {
      setLoading(true);
      const newBeneficiary = await beneficiariesAPI.createBeneficiary(data);
      
      console.log('✅ Bénéficiaire créé:', newBeneficiary.id);
      
      // 🔄 REFRESH: Recharger la liste après création
      await loadBeneficiaries();
      
      return newBeneficiary;
      
    } catch (err) {
      setError(err);
      console.error('❌ Erreur createBeneficiary:', err);
      throw err;
      
    } finally {
      setLoading(false);
    }
  }, [loadBeneficiaries]);

  // ==================== MODIFIER BÉNÉFICIAIRE ====================
  
  const updateBeneficiary = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const updated = await beneficiariesAPI.updateBeneficiary(id, data);
      
      console.log('✅ Bénéficiaire modifié:', id);
      
      // 🔄 UPDATE LOCAL: Mise à jour optimiste dans la liste
      setBeneficiaries(prev =>
        prev.map(b => b.id === id ? { ...b, ...updated } : b)
      );
      
      return updated;
      
    } catch (err) {
      setError(err);
      console.error('❌ Erreur updateBeneficiary:', err);
      throw err;
      
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== SUPPRIMER BÉNÉFICIAIRE ====================
  
  const deleteBeneficiary = useCallback(async (id) => {
    try {
      setLoading(true);
      await beneficiariesAPI.deleteBeneficiary(id);
      
      console.log('✅ Bénéficiaire supprimé:', id);
      
      // 🔄 DELETE LOCAL: Retirer de la liste
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
      
      // 📊 UPDATE PAGINATION: Décrémenter le total
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        totalPages: Math.ceil(Math.max(0, prev.total - 1) / prev.pageSize)
      }));
      
    } catch (err) {
      setError(err);
      console.error('❌ Erreur deleteBeneficiary:', err);
      throw err;
      
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== VÉRIFIER BÉNÉFICIAIRE ====================
  
  const verifyBeneficiary = useCallback(async (id, notes) => {
    try {
      setLoading(true);
      await beneficiariesAPI.verifyBeneficiary(id, notes);
      
      console.log('✅ Bénéficiaire vérifié:', id);
      
      // 🔄 UPDATE LOCAL: Changer statut de vérification
      setBeneficiaries(prev =>
        prev.map(b => 
          b.id === id 
            ? { ...b, verification_status: 'VERIFIED' }
            : b
        )
      );
      
    } catch (err) {
      setError(err);
      console.error('❌ Erreur verifyBeneficiary:', err);
      throw err;
      
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== GESTION FILTRES ====================
  
  /**
   * Appliquer des filtres
   */
  const applyFilters = useCallback((newFilters) => {
    console.log('🔍 Applying filters:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset à la page 1
  }, []);

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = useCallback(() => {
    console.log('🔄 Resetting filters');
    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [initialFilters]);

  // ==================== GESTION PAGINATION ====================
  
  /**
   * Changer de page
   */
  const changePage = useCallback((page) => {
    console.log(`📄 Changing to page ${page}`);
    setPagination(prev => ({ ...prev, page }));
  }, []);

  /**
   * Changer taille de page
   */
  const changePageSize = useCallback((pageSize) => {
    console.log(`📏 Changing page size to ${pageSize}`);
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // ==================== UTILITAIRES ====================
  
  /**
   * Rafraîchir les données
   */
  const refresh = useCallback(() => {
    console.log('🔄 Refreshing beneficiaries');
    loadBeneficiaries();
  }, [loadBeneficiaries]);

  // ==================== EFFET: CHARGEMENT AUTO ====================
  
  /**
   * Charger au montage et quand filtres/pagination changent
   */
  useEffect(() => {
    loadBeneficiaries();
  }, [pagination.page, pagination.pageSize, filters]);

  // ==================== RETOUR ====================
  
  return {
    // 📊 Données
    beneficiaries,
    loading,
    error,
    pagination,
    filters,
    
    // 🔨 Actions CRUD
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    verifyBeneficiary,
    
    // 🔍 Actions filtres/pagination
    applyFilters,
    resetFilters,
    changePage,
    changePageSize,
    
    // 🔄 Actions utilitaires
    refresh,
    loadBeneficiaries,
  };
}

export default useBeneficiaries;