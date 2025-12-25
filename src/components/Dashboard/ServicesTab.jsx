/**
 * 🇬🇦 RSU Gabon - Services Tab COMPLET AVEC PROGRAMMES
 * Standards Top 1% - Éligibilité & Vulnérabilité + Programmes Recommandés
 * 
 * ✅ AJOUT: Section programmes recommandés après sélection bénéficiaire
 * ✅ CORRECTION: Recherche qui filtre vraiment
 * 
 * Fichier: src/components/Dashboard/ServicesTab.jsx
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PersonSearch from '../common/PersonSearch';
import servicesAPI from '../../services/api/servicesAPI';
import apiClient from '../../services/api/apiClient';
import { 
  Activity, AlertTriangle, CheckCircle, Target,
  TrendingUp, RefreshCw, DollarSign, Users, Calendar, X
} from 'lucide-react';

export default function ServicesTab() {
  // ========== STATE ==========
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [vulnerabilityData, setVulnerabilityData] = useState(null);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('vulnerability'); 

  // ========== EFFECT: Charger programmes recommandés ==========
  useEffect(() => {
    if (selectedPerson && selectedPerson.id) {
      loadRecommendedPrograms();
    } else {
      setRecommendedPrograms([]);
    }
  }, [selectedPerson]);

  // ========== LOAD RECOMMENDED PROGRAMS ==========
  const loadRecommendedPrograms = async () => {
    setLoadingPrograms(true);
    try {
      console.log(`📊 Chargement programmes recommandés pour ${selectedPerson.id}...`);
      
      const response = await servicesAPI.getRecommendedPrograms(selectedPerson.id);
      
      console.log('✅ Programmes recommandés:', response);
      setRecommendedPrograms(response || []);
      
    } catch (error) {
      console.error('❌ Erreur chargement programmes:', error);
      // Ne pas bloquer l'interface si les programmes ne chargent pas
      setRecommendedPrograms([]);
    } finally {
      setLoadingPrograms(false);
    }
  };

  // ========== HANDLERS ==========

  const handleCalculateVulnerability = async () => {
    if (!selectedPerson || !selectedPerson.id) {
      const errorMsg = 'Veuillez sélectionner un bénéficiaire';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setVulnerabilityData(null);

    try {
      console.log(`🧮 Calcul vulnérabilité pour ${selectedPerson.id}...`);
      const data = await servicesAPI.calculateVulnerability(selectedPerson.id);
      
      console.log('✅ Vulnérabilité calculée:', data);
      setVulnerabilityData(data);
      
      toast.success(
        `Vulnérabilité calculée: ${data?.vulnerability_score || 'N/A'}`,
        { autoClose: 3000 }
      );

    } catch (error) {
      console.error('❌ Erreur calcul vulnérabilité:', error);
      const errorMsg = error.response?.data?.detail || error.message;
      setError(errorMsg);
      toast.error(`Erreur: ${errorMsg}`, { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async () => {
    if (!selectedPerson || !selectedProgram) {
      const errorMsg = 'Sélectionnez un bénéficiaire et un programme';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setEligibilityData(null);

    try {
      console.log(`📊 Vérification éligibilité: ${selectedPerson.id} -> ${selectedProgram.code}`);

      const data = await servicesAPI.calculateEligibility(
        selectedPerson.id,
        selectedProgram.code
      );

      console.log('✅ Éligibilité calculée:', data);
      setEligibilityData(data);

      toast.success(
        `Éligibilité: ${data.is_eligible ? 'Éligible' : 'Non éligible'}`,
        { autoClose: 3000 }
      );

    } catch (error) {
      console.error('❌ Erreur calcul éligibilité:', error);
      const errorMsg = error.response?.data?.detail || error.message;
      setError(errorMsg);
      toast.error(`Erreur: ${errorMsg}`, { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER HELPERS ==========

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-GA', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderRecommendedPrograms = () => {
    if (!selectedPerson) return null;

    return (
      <div className="bg-white border rounded-lg p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Programmes Recommandés
          </h3>
          {loadingPrograms && (
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
          )}
        </div>

        {loadingPrograms && recommendedPrograms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p>Chargement des programmes...</p>
          </div>
        ) : recommendedPrograms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Aucun programme disponible pour ce bénéficiaire</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPrograms.map((program) => (
              <button
                key={program.id}
                onClick={() => {
                  setSelectedProgram(program);
                  setActiveView('eligibility');
                }}
                className={`
                  text-left p-4 border-2 rounded-lg transition-all hover:shadow-md
                  ${selectedProgram?.id === program.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {program.name}
                  </h4>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {program.code}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatCurrency(program.benefit_amount || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span>{program.current_beneficiaries || 0} bénéficiaires</span>
                  </div>
                  {program.eligibility_score && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-medium text-green-700">
                        Score: {program.eligibility_score.toFixed(1)}%
                      </p>
                      <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{ width: `${program.eligibility_score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {selectedProgram?.id === program.id && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs font-semibold text-green-700 text-center">
                      ✓ Programme sélectionné
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">Erreur</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderVulnerabilityResults = () => {
    if (!vulnerabilityData) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Évaluation de Vulnérabilité
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Score de Vulnérabilité</p>
            <p className="text-6xl font-bold text-blue-600">
              {vulnerabilityData.vulnerability_score?.toFixed(1) || 'N/A'}
            </p>
            <p className="text-gray-500 mt-2">/100</p>
          </div>

          {['economic_score', 'social_score', 'housing_score', 'health_score', 'education_score'].map((key, idx) => {
            const labels = ['Économique', 'Social', 'Habitat', 'Santé', 'Éducation'];
            const colors = ['blue', 'green', 'yellow', 'red', 'purple'];
            
            return (
              <div key={key}>
                <p className="text-sm text-gray-600 mb-1">{labels[idx]}</p>
                <p className={`text-2xl font-bold text-${colors[idx]}-600`}>
                  {vulnerabilityData[key]?.toFixed(1) || '0.0'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEligibilityResults = () => {
    if (!eligibilityData) return null;

    return (
      <div className={`border rounded-lg p-6 ${
        eligibilityData.is_eligible 
          ? 'bg-green-50 border-green-200'
          : 'bg-orange-50 border-orange-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          {eligibilityData.is_eligible ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          )}
          <div>
            <h3 className={`text-lg font-bold ${
              eligibilityData.is_eligible ? 'text-green-900' : 'text-orange-900'
            }`}>
              {eligibilityData.is_eligible ? 'Éligible' : 'Non Éligible'}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedProgram?.name || 'Programme'}
            </p>
          </div>
        </div>

        {eligibilityData.eligibility_score != null && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">Score d'éligibilité</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    eligibilityData.is_eligible ? 'bg-green-600' : 'bg-orange-600'
                  }`}
                  style={{ width: `${eligibilityData.eligibility_score}%` }}
                />
              </div>
              <span className="text-lg font-bold">
                {eligibilityData.eligibility_score.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ========== MAIN RENDER ==========

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Services</h2>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
          Éligibilité & Vulnérabilité
        </span>
      </div>

      {/* Person Search */}
      <div className="bg-white border rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rechercher un bénéficiaire
        </label>
        <PersonSearch 
          onSelect={setSelectedPerson}
          selectedPerson={selectedPerson}
        />
      </div>

      {/* Programmes Recommandés */}
      {renderRecommendedPrograms()}

      {/* View Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveView('vulnerability')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
              activeView === 'vulnerability'
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <Activity size={20} />
            Vulnérabilité
          </button>

          <button
            onClick={() => setActiveView('eligibility')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
              activeView === 'eligibility'
                ? 'text-green-600 border-green-600 bg-green-50'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <Target size={20} />
            Éligibilité
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderError()}

          {activeView === 'vulnerability' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <button
                  onClick={handleCalculateVulnerability}
                  disabled={!selectedPerson || loading}
                  className={`
                    px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all
                    ${!selectedPerson || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Calcul en cours...
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5" />
                      Calculer Vulnérabilité
                    </>
                  )}
                </button>
              </div>
              {renderVulnerabilityResults()}
            </div>
          )}

          {activeView === 'eligibility' && (
            <div className="space-y-6">
              {!selectedProgram && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Sélectionnez un programme dans la liste ci-dessus
                  </p>
                </div>
              )}

              {selectedProgram && (
                <>
                  <div className="flex justify-center">
                    <button
                      onClick={handleCheckEligibility}
                      disabled={loading}
                      className={`
                        px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all
                        ${loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                        }
                      `}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Vérification en cours...
                        </>
                      ) : (
                        <>
                          <Target className="w-5 h-5" />
                          Vérifier Éligibilité
                        </>
                      )}
                    </button>
                  </div>
                  {renderEligibilityResults()}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}