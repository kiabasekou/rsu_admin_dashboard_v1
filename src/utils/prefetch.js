/**
 * 🇬🇦 RSU Gabon - Prefetch Utility
 * Standards Top 1% - Préchargement intelligent des modules
 * Fichier: src/utils/prefetch.js
 */

import { useEffect } from 'react'; // ✅ AJOUT

/**
 * Précharge un composant lazy avant qu'il soit nécessaire
 */
export function prefetchComponent(lazyComponent) {
  const component = lazyComponent._payload;
  if (component && typeof component._result === 'function') {
    component._result();
  }
}

/**
 * Précharge tous les onglets du dashboard
 */
export function prefetchDashboardTabs() {
  setTimeout(() => {
    import('../components/Dashboard/BeneficiariesTab');
    
    setTimeout(() => {
      import('../components/Dashboard/ProgramsTab');
    }, 500);
    
    setTimeout(() => {
      import('../components/Dashboard/AnalyticsTab');
    }, 1000);
    
    setTimeout(() => {
      import('../components/Dashboard/DeduplicationTab');
    }, 1500);
    
    console.log('⚡ Prefetch: Modules dashboard en cours de chargement...');
  }, 2000);
}

/**
 * Précharge sur hover (anticipation)
 */
export function createPrefetchHandler(lazyComponent) {
  let prefetched = false;
  
  return () => {
    if (!prefetched) {
      prefetchComponent(lazyComponent);
      prefetched = true;
      console.log('⚡ Prefetch: Module préchargé sur hover');
    }
  };
}

/**
 * Détecte si l'utilisateur a une connexion rapide
 */
export function shouldAggressivePrefetch() {
  if ('connection' in navigator) {
    const conn = navigator.connection;
    return conn.effectiveType === '4g' || 
           conn.effectiveType === '5g' || 
           conn.type === 'wifi';
  }
  return true;
}

/**
 * Hook React pour préchargement automatique
 */
export function usePrefetch(modules = []) {
  useEffect(() => {  // ✅ CORRIGÉ
    if (shouldAggressivePrefetch()) {
      modules.forEach((module, index) => {
        setTimeout(() => {
          module();
        }, index * 500);
      });
    }
  }, [modules]);
}

/**
 * Configuration globale du prefetch
 */
export const PREFETCH_CONFIG = {
  initialDelay: 2000,
  moduleDelay: 500,
  hoverPrefetch: true,
  priorityModules: [
    'BeneficiariesTab',
    'ProgramsTab'
  ]
};

export default {
  prefetchComponent,
  prefetchDashboardTabs,
  createPrefetchHandler,
  shouldAggressivePrefetch,
  usePrefetch,
  PREFETCH_CONFIG
};