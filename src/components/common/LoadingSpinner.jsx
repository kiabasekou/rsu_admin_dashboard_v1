/**
 * 🇬🇦 RSU Gabon - LoadingSpinner Component
 * Standards Top 1% - Indicateur de chargement
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({
  size = 'medium',
  message = '',
  fullScreen = false,
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Variante pour tables
LoadingSpinner.Table = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="py-12 text-center">
      <LoadingSpinner message="Chargement des données..." />
    </td>
  </tr>
);