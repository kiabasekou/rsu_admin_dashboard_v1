/**
 * 🇬🇦 RSU Gabon - Card Component
 * Standards Top 1% - Carte conteneur flexible
 */
import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'normal',
  shadow = true,
  hover = false,
  ...props
}) {
  const baseClasses = 'bg-white rounded-lg';
  
  const paddingClasses = {
    none: '',
    small: 'p-3',
    normal: 'p-6',
    large: 'p-8',
  };

  const shadowClass = shadow ? 'shadow-md' : '';
  const hoverClass = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Sous-composants
Card.Header = ({ children, className = '' }) => (
  <div className={`pb-4 mb-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`pt-4 mt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);