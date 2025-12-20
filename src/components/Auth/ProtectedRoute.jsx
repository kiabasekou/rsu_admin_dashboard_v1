/**
 * 🇬🇦 RSU Gabon - Protected Route CORRIGÉ
 * Fix: Attendre localStorage avant vérification
 * Fichier: src/components/ProtectedRoute.jsx
 */

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // ✅ FIX: Attendre un tick pour laisser localStorage se synchroniser
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      console.log('🔍 ProtectedRoute - Token:', token ? '✅ TROUVÉ' : '❌ MANQUANT');
      
      setIsAuthenticated(!!token);
      setIsChecking(false);
    };

    // Petite pause pour garantir que localStorage est à jour
    setTimeout(checkAuth, 50);
  }, []);

  // Afficher rien pendant la vérification
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger si pas de token
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute - Redirection vers /login');
    return <Navigate to="/login" replace />;
  }

  // Token trouvé, afficher la page
  console.log('✅ ProtectedRoute - Accès autorisé');
  return children;
};

export default ProtectedRoute;