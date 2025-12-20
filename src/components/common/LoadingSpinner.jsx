/**
 * 🇬🇦 RSU Gabon - Loading Spinner Réutilisable
 * Standards Top 1% - Composant de chargement
 * Fichier: src/components/Common/LoadingSpinner.jsx
 */

import React from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';

/**
 * Composant Loading Spinner avec plusieurs variantes
 * 
 * @param {string} size - 'sm', 'md', 'lg', 'xl'
 * @param {string} variant - 'spinner', 'pulse', 'dots'
 * @param {string} text - Texte à afficher
 * @param {boolean} fullScreen - Centrer en plein écran
 */
export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner',
  text = 'Chargement...',
  fullScreen = false 
}) {
  const sizes = {
    sm: 24,
    md: 48,
    lg: 64,
    xl: 96
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClass}>
      <div className="text-center">
        {variant === 'spinner' && (
          <RefreshCw 
            className="animate-spin text-blue-600 mx-auto mb-4" 
            size={sizes[size]} 
          />
        )}

        {variant === 'pulse' && (
          <Loader2 
            className="animate-pulse text-blue-600 mx-auto mb-4" 
            size={sizes[size]} 
          />
        )}

        {variant === 'dots' && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {text && (
          <>
            <p className="text-gray-700 font-medium">{text}</p>
            <p className="text-gray-400 text-sm mt-2">Veuillez patienter</p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Composant skeleton pour pré-chargement de contenu
 */
export function SkeletonLoader({ count = 3, height = 'h-20' }) {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`bg-gray-200 rounded-lg ${height}`} />
      ))}
    </div>
  );
}

/**
 * Composant inline spinner (petit, dans le texte)
 */
export function InlineSpinner({ className = '' }) {
  return (
    <RefreshCw 
      className={`animate-spin inline-block ${className}`} 
      size={16} 
    />
  );
}