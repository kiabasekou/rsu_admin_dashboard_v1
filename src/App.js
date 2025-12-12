/**
 * 🇬🇦 RSU Gabon - App Router avec Error Boundary
 * Standards Top 1% - Navigation Sécurisée + Gestion Erreurs
 * Fichier: src/App.js
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// ============================================================================
// LAZY LOADING DES PAGES
// ============================================================================

// Pages principales chargées à la demande
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Composants d'authentification
const ProtectedRoute = lazy(() => import('./components/Auth/ProtectedRoute'));

// ============================================================================
// APP COMPONENT
// ============================================================================

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullScreen size="xl" text="Chargement de l'application..." />}>
          <Routes>
            {/* Route publique: Login */}
            <Route path="/login" element={<Login />} />

            {/* Routes protégées */}
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<LoadingSpinner fullScreen size="lg" />}>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Suspense>
              }
            />

            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 - Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;