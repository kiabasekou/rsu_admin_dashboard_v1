/**
 * 🇬🇦 RSU Gabon - useBeneficiaries Hook
 * Standards Top 1% - Gestion État Complète
 */
import { useState, useCallback, useEffect } from 'react';
import beneficiariesAPI from '../services/api/beneficiariesAPI';

export function useBeneficiaries(initialFilters = {}) {
  // États
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

  /**
   * Charger les bénéficiaires
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

      setBeneficiaries(data.results || []);
      setPagination(prev => ({
        ...prev,
        total: data.count || 0,
        totalPages: Math.ceil((data.count || 0) / prev.pageSize),
      }));
    } catch (err) {
      setError(err);
      console.error('Erreur chargement bénéficiaires:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters]);

  /**
   * Créer un bénéficiaire
   */
  const createBeneficiary = useCallback(async (data) => {
    try {
      setLoading(true);
      const newBeneficiary = await beneficiariesAPI.createBeneficiary(data);
      
      // Refresh liste
      await loadBeneficiaries();
      
      return newBeneficiary;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadBeneficiaries]);

  /**
   * Modifier un bénéficiaire
   */
  const updateBeneficiary = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const updated = await beneficiariesAPI.updateBeneficiary(id, data);
      
      // Mettre à jour dans la liste locale
      setBeneficiaries(prev =>
        prev.map(b => b.id === id ? { ...b, ...updated } : b)
      );
      
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Supprimer un bénéficiaire
   */
  const deleteBeneficiary = useCallback(async (id) => {
    try {
      setLoading(true);
      await beneficiariesAPI.deleteBeneficiary(id);
      
      // Retirer de la liste locale
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Vérifier un bénéficiaire
   */
  const verifyBeneficiary = useCallback(async (id, notes) => {
    try {
      setLoading(true);
      await beneficiariesAPI.verifyBeneficiary(id, notes);
      
      // Mettre à jour statut local
      setBeneficiaries(prev =>
        prev.map(b => 
          b.id === id 
            ? { ...b, verification_status: 'VERIFIED' }
            : b
        )
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Appliquer des filtres
   */
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset page
  }, []);

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [initialFilters]);

  /**
   * Changer de page
   */
  const changePage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  /**
   * Changer taille de page
   */
  const changePageSize = useCallback((pageSize) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  /**
   * Rafraîchir les données
   */
  const refresh = useCallback(() => {
    loadBeneficiaries();
  }, [loadBeneficiaries]);

  /**
   * Charger au montage et quand filtres/pagination changent
   */
  useEffect(() => {
    loadBeneficiaries();
  }, [pagination.page, pagination.pageSize, filters]);

  return {
    // Données
    beneficiaries,
    loading,
    error,
    pagination,
    filters,
    
    // Actions CRUD
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    verifyBeneficiary,
    
    // Actions filtres/pagination
    applyFilters,
    resetFilters,
    changePage,
    changePageSize,
    
    // Actions utilitaires
    refresh,
    loadBeneficiaries,
  };
}