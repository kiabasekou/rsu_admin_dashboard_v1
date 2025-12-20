/**
 * 🇬🇦 RSU Gabon - Login Page VERSION FINALE
 * Solution: navigate() + ProtectedRoute avec délai
 * Fichier: src/pages/Login.jsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle, CheckCircle, Shield, Globe } from 'lucide-react';
import apiClient from '../services/api/apiClient';

export default function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  
  useEffect(() => {
    checkBackendStatus();
    loadSavedCredentials();
  }, []);
  
  const checkBackendStatus = async () => {
    try {
      const response = await fetch(apiClient.baseURL.replace('/api/v1', '/api/'));
      if (response.ok) {
        setBackendStatus('online');
        console.log('✅ Backend accessible');
      } else {
        setBackendStatus('offline');
      }
    } catch (err) {
      setBackendStatus('offline');
    }
  };
  
  const loadSavedCredentials = () => {
    const savedEmail = localStorage.getItem('saved_email');
    const savedRemember = localStorage.getItem('remember_me') === 'true';
    
    if (savedEmail && savedRemember) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!formData.email || !formData.password) {
        throw new Error('Veuillez remplir tous les champs');
      }
      
      console.log('🔐 Tentative login:', formData.email);
      
      const response = await apiClient.post('/auth/token/', {
        username: formData.email,
        password: formData.password
      });
      
      console.log('📦 Réponse API:', response);
      
      const accessToken = response.access || response.token;
      const refreshToken = response.refresh || response.refresh_token;
      
      if (!accessToken) {
        throw new Error('Token manquant dans la réponse');
      }
      
      console.log('💾 Sauvegarde token:', accessToken.substring(0, 20) + '...');
      
      // Sauvegarde localStorage
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        username: formData.email
      }));
      
      // Remember me
      if (rememberMe) {
        localStorage.setItem('saved_email', formData.email);
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('saved_email');
        localStorage.removeItem('remember_me');
      }
      
      // Vérification
      const savedToken = localStorage.getItem('token');
      console.log('✅ Token vérifié dans localStorage:', savedToken ? 'PRÉSENT' : 'ABSENT');
      
      if (!savedToken) {
        throw new Error('Échec sauvegarde token');
      }
      
      console.log('✅ Login réussi - Redirection vers /dashboard');
      
      // ✅ Redirection React Router (ProtectedRoute gère le délai)
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      console.error('❌ Erreur login:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Identifiants invalides'
      );
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    setError('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full mb-4 shadow-lg">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🇬🇦 RSU Gabon
          </h1>
          <p className="text-gray-600">
            Registre Social Unique du Gabon
          </p>
        </div>
        
        <div className="mb-6">
          {backendStatus === 'checking' && (
            <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
              <Globe size={16} className="animate-spin" />
              Vérification backend...
            </div>
          )}
          
          {backendStatus === 'online' && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg p-3 justify-center">
              <CheckCircle size={16} />
              Backend connecté - Mode Production
            </div>
          )}
          
          {backendStatus === 'offline' && (
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-lg p-3 justify-center">
              <AlertCircle size={16} />
              Backend hors ligne - Mode démo
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-red-800 font-medium">
                  Erreur d'authentification
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email / Nom d'utilisateur
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
                autoComplete="username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Se souvenir de moi
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Se connecter
                </>
              )}
            </button>
            
          </form>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3 text-center">
                Accès rapide (Développement)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'Ahmed@230588')}
                  className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                  disabled={loading}
                >
                  👨‍💼 Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('enqueteur', 'test123')}
                  className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                  disabled={loading}
                >
                  📋 Enquêteur
                </button>
              </div>
            </div>
          )}
          
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Gouvernement Gabonais
          </p>
          <p className="text-xs text-gray-400 mt-2">
            v1.3 - Final Fix
          </p>
        </div>
        
      </div>
    </div>
  );
}