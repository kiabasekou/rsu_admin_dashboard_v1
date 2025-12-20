/**
 * 🇬🇦 RSU Gabon - Error Boundary
 * Standards Top 1% - Gestion erreurs lazy loading
 * Fichier: src/components/Common/ErrorBoundary.jsx
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Log vers service externe si configuré (Sentry, etc.)
    if (window.logErrorToService) {
      window.logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            {/* Icône d'erreur */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="text-red-600" size={64} />
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
              Oups ! Une erreur est survenue
            </h1>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              Nous avons rencontré un problème lors du chargement de cette page.
              Veuillez réessayer ou contacter le support si le problème persiste.
            </p>

            {/* Détails erreur (mode développement uniquement) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Détails techniques (dev only)
                </summary>
                <div className="text-xs font-mono text-red-600 overflow-auto max-h-64">
                  <p className="font-bold mb-2">Erreur :</p>
                  <p className="mb-4">{this.state.error.toString()}</p>
                  
                  {this.state.errorInfo && (
                    <>
                      <p className="font-bold mb-2">Stack trace :</p>
                      <pre className="whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                <RefreshCw size={20} />
                Recharger la page
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                <Home size={20} />
                Retour à l'accueil
              </button>
            </div>

            {/* Info support */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Code d'erreur : <span className="font-mono font-semibold">
                  {Date.now().toString(36).toUpperCase()}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Besoin d'aide ? Contactez le support technique avec ce code.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * Hook pour reset error boundary depuis un composant enfant
 */
export function useErrorHandler() {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}