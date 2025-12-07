/**
 * 🇬🇦 RSU Gabon - Login Component CORRECTION COMPLÈTE
 * Standards Top 1% - Fix double submit + meilleure UX
 * Fichier: rsu_admin_dashboard_v1/src/pages/Login.jsx
 * 
 * CORRECTIONS APPLIQUÉES:
 * ✅ Fix double submit (preventDefault + loading guard)
 * ✅ Credentials vides par défaut (pas de hardcode)
 * ✅ Gestion erreur améliorée
 * ✅ Loading state robuste
 * ✅ Auto-complete browser natif
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',  // ✅ Vide par défaut
    password: ''   // ✅ Vide par défaut
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();  // ✅ CRITIQUE: Empêcher comportement par défaut du form
    
    // ✅ CRITIQUE: Empêcher re-soumission pendant traitement
    if (loading) {
      console.log('⚠️ Soumission déjà en cours, requête ignorée');
      return;
    }

    // Validation côté client
    if (!credentials.username || !credentials.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      // ✅ URL hardcodée (fix .env non lu en dev)
      const loginUrl = 'http://localhost:8000/api/v1/auth/token/';
      
      console.log('🔐 Tentative login:', loginUrl);
      console.log('👤 Username:', credentials.username);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Identifiants invalides');
      }

      const data = await response.json();
      
      console.log('✅ Login réussi');

      // Stocker tokens
      localStorage.setItem('access_token', data.access);
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }

      // Stocker info utilisateur si disponible
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirection
      navigate('/dashboard');
      
    } catch (err) {
      console.error('❌ Erreur login:', err);
      setError(err.message);
    } finally {
      // ✅ CRITIQUE: Toujours réinitialiser loading, même en cas d'erreur
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <Shield size={48} className="text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          RSU Gabon
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Registre Social Unifié - Administration
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="username"
              disabled={loading}
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="current-password"
              disabled={loading}
              placeholder="Entrez votre mot de passe"
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        {/* Info credentials test */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="mb-1">Credentials de test:</p>
          <p className="font-mono bg-gray-100 px-3 py-2 rounded">
            admin / admin123
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>© 2025 République Gabonaise</p>
          <p>Registre Social Unifié - Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}