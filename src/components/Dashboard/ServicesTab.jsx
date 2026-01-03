/**
 * 🇬🇦 RSU GABON - SERVICES TAB ULTIME
 * Standards Top 1% - Module Éligibilité EXCELLENCE INTERNATIONALE
 * 
 * ✅ NIVEAU 1 AMÉLIORATIONS INTÉGRÉES:
 * 1. Score Breakdown - Décomposition 4 dimensions (40/30/20/10)
 * 2. Documents Checklist - Liste visuelle ✓/✗
 * 3. Montant Estimé - Card attractive avec calculs
 * 
 * Fichier: src/components/Dashboard/ServicesTab.jsx
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PersonSearch from '../common/PersonSearch';
import servicesAPI from '../../services/api/servicesAPI';
import { 
  Activity, AlertTriangle, CheckCircle, Target,
  RefreshCw, DollarSign, Users, X, Shield, Heart, 
  Home, Briefcase, User, FileText, TrendingUp, 
  Calendar, Info, Clock, Download
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
      setVulnerabilityData(null);
      setEligibilityData(null);
    } else {
      setRecommendedPrograms([]);
      setVulnerabilityData(null);
      setEligibilityData(null);
    }
  }, [selectedPerson]);

  // ========== LOAD RECOMMENDED PROGRAMS ==========
  // Ligne ~53-58
  const loadRecommendedPrograms = async () => {
    setLoadingPrograms(true);
    console.log('🔍 Chargement programmes pour:', selectedPerson.id);
    
    try {
      const response = await servicesAPI.getRecommendedPrograms(
        selectedPerson.id,
        0 // ← Temporaire pour debug
      );
      
      console.log('📊 RÉPONSE COMPLÈTE:', response);
      console.log('📊 Type:', Array.isArray(response) ? 'Array' : typeof response);
      console.log('📊 Nombre programmes:', response?.length || 0);
      
      if (response && response.length > 0) {
        console.log('✅ Programmes trouvés:');
        response.forEach(p => {
          console.log(`  - ${p.program_code}: ${p.eligibility_score}%`);
        });
      } else {
        console.log('⚠️ Aucun programme retourné par l\'API');
      }
      
      setRecommendedPrograms(response || []);
    } catch (error) {
      console.error('❌ Erreur chargement programmes:', error);
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
      const data = await servicesAPI.calculateVulnerability(selectedPerson.id);
      setVulnerabilityData(data);
      const score = parseFloat(data?.vulnerability_score || 0).toFixed(1);
      toast.success(`Vulnérabilité calculée: ${score}/100`, { autoClose: 3000 });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Erreur inconnue';
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
      const data = await servicesAPI.calculateEligibility(
        selectedPerson.id,
        selectedProgram.code || selectedProgram.program_code
      );
      setEligibilityData(data);
      toast.success(
        `Éligibilité: ${data.is_eligible ? 'Éligible ✓' : 'Non éligible'}`,
        { autoClose: 3000 }
      );
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Erreur inconnue';
      setError(errorMsg);
      toast.error(`Erreur: ${errorMsg}`, { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER HELPERS ==========

  const formatCurrency = (amount) => {
    if (!amount) return '0 FCFA';
    return new Intl.NumberFormat('fr-GA', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      'EXTREME': 'red',
      'HIGH': 'orange',
      'MEDIUM': 'yellow',
      'LOW': 'green'
    };
    return colors[riskLevel] || 'gray';
  };

  const getRiskLevelLabel = (riskLevel) => {
    const labels = {
      'EXTREME': 'Extrême',
      'HIGH': 'Élevé',
      'MEDIUM': 'Moyen',
      'LOW': 'Faible'
    };
    return labels[riskLevel] || riskLevel;
  };

  // ========== COMPOSANT INTERNE: SCORE BREAKDOWN ==========
  const renderScoreBreakdown = () => {
    if (!eligibilityData) return null;

    const finalScore = parseFloat(eligibilityData.eligibility_score || 0);
    const vulnerabilityScore = vulnerabilityData 
      ? parseFloat(vulnerabilityData.vulnerability_score || 0)
      : (finalScore * 0.4 / 0.4);

    const hasBlockingFactors = eligibilityData.blocking_factors?.length > 0;
    const hasPositiveFactors = eligibilityData.eligibility_factors?.length > 0;
    
    const profileScore = hasBlockingFactors ? 50 : (hasPositiveFactors ? 85 : 70);
    
    const urgencyMap = {
      'HIGHLY_RECOMMENDED': 90,
      'RECOMMENDED': 70,
      'CONDITIONALLY_ELIGIBLE': 50,
      'NOT_ELIGIBLE': 20
    };
    const urgencyScore = urgencyMap[eligibilityData.recommendation_level] || 50;
    
    const hasBank = eligibilityData.eligibility_factors?.some(f => 
      f.includes('BANK') || f.includes('COMPTE')
    );
    const absorptionScore = hasBank ? 100 : 50;

    const components = [
      { label: 'Vulnérabilité', weight: 40, score: Math.min(100, vulnerabilityScore), icon: Shield, color: 'blue' },
      { label: 'Profil', weight: 30, score: profileScore, icon: User, color: 'green' },
      { label: 'Urgence', weight: 20, score: urgencyScore, icon: AlertTriangle, color: 'yellow' },
      { label: 'Absorption', weight: 10, score: absorptionScore, icon: DollarSign, color: 'purple' }
    ];

    let totalCalculated = 0;
    components.forEach(comp => {
      comp.contribution = (comp.score * comp.weight) / 100;
      totalCalculated += comp.contribution;
    });

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📊 Décomposition du Score d'Éligibilité
        </h4>

        <div className="space-y-4">
          {components.map((comp) => {
            const Icon = comp.icon;
            
            return (
              <div key={comp.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 text-${comp.color}-600`} />
                    <span className="font-medium text-gray-700">
                      {comp.label} <span className="text-gray-500">({comp.weight}%)</span>
                    </span>
                  </div>
                  <span className={`text-lg font-bold text-${comp.color}-600`}>
                    {comp.score.toFixed(0)}/100
                  </span>
                </div>

                <div className="relative">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`bg-${comp.color}-600 h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end text-xs">
                  <span className={`font-semibold text-${comp.color}-700`}>
                    → Contribution: {comp.contribution.toFixed(1)} points
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <span className="font-semibold text-gray-700">Score Total Calculé</span>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {finalScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ========== COMPOSANT INTERNE: DOCUMENTS CHECKLIST ==========
  const renderDocumentsChecklist = () => {
    if (!eligibilityData) return null;

    const standardDocuments = [
      { id: 'national_id', name: "Carte d'identité nationale (NIP)", required: true, category: 'Identité' },
      { id: 'residence', name: "Certificat de résidence", required: true, category: 'Domicile' },
      { id: 'income', name: "Attestation de revenus", required: true, category: 'Financier' },
      { id: 'bank_rib', name: "RIB ou mobile money", required: true, category: 'Financier' },
      { id: 'household', name: "Composition ménage", required: false, category: 'Famille' }
    ];

    const missingFromAPI = eligibilityData.missing_documents || [];
    
    const documentsWithStatus = standardDocuments.map(doc => {
      const isMissing = missingFromAPI.some(missing => 
        missing.toLowerCase().includes(doc.id) || 
        doc.name.toLowerCase().includes(missing.toLowerCase())
      );
      return { ...doc, status: isMissing ? 'missing' : 'provided' };
    });

    const providedDocs = documentsWithStatus.filter(d => d.status === 'provided');
    const missingDocs = documentsWithStatus.filter(d => d.status === 'missing');
    const requiredMissingDocs = missingDocs.filter(d => d.required);

    const alertLevel = requiredMissingDocs.length > 0 ? 'error' : 
                       missingDocs.length > 0 ? 'warning' : 'success';

    const alertConfig = {
      error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
      warning: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' },
      success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' }
    };

    const config = alertConfig[alertLevel];

    return (
      <div className={`border rounded-lg p-6 mt-6 ${config.bg} ${config.border}`}>
        <h4 className={`text-lg font-semibold ${config.text} flex items-center gap-2 mb-4`}>
          <FileText className="w-5 h-5" />
          Documents Requis
        </h4>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <p className="text-2xl font-bold text-green-600">{providedDocs.length}</p>
            <p className="text-xs text-gray-600">Fournis</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <p className="text-2xl font-bold text-orange-600">{missingDocs.length}</p>
            <p className="text-xs text-gray-600">Manquants</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <p className="text-2xl font-bold text-red-600">{requiredMissingDocs.length}</p>
            <p className="text-xs text-gray-600">Requis manquants</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <ul className="space-y-2">
            {documentsWithStatus.map((doc) => {
              const isProvided = doc.status === 'provided';
              
              return (
                <li 
                  key={doc.id} 
                  className={`flex items-start gap-3 p-2 rounded ${
                    isProvided ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {isProvided ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isProvided ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {doc.name}
                      {doc.required && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          Requis
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {requiredMissingDocs.length > 0 && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="font-semibold text-red-900">
              ⚠️ {requiredMissingDocs.length} document(s) obligatoire(s) manquant(s)
            </p>
          </div>
        )}
      </div>
    );
  };

  // ========== COMPOSANT INTERNE: MONTANT ESTIMÉ ==========
  const renderEstimatedBenefit = () => {
    if (!selectedProgram) return null;

    const monthlyAmount = selectedProgram.benefit_amount || 0;
    const durationMonths = selectedProgram.duration_months || 12;
    const totalAmount = monthlyAmount * durationMonths;
    const isHighlyEligible = eligibilityData?.recommendation_level === 'HIGHLY_RECOMMENDED';

    return (
      <div className={`border-2 rounded-xl overflow-hidden mt-6 ${
        isHighlyEligible ? 'border-green-400 shadow-lg' : 'border-blue-300'
      }`}>
        <div className={`p-6 ${
          isHighlyEligible 
            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
        } text-white`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              <h3 className="text-lg font-bold">Bénéfice Estimé</h3>
            </div>
            {isHighlyEligible && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                ✓ Hautement Éligible
              </span>
            )}
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="text-center mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">Montant Mensuel</p>
            <p className="text-5xl font-bold text-blue-600 mb-2">
              {formatCurrency(monthlyAmount)}
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <p className="text-sm">pendant {durationMonths} mois</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-xs font-medium text-green-900">Total Cumulé</p>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-medium text-purple-900">Par An</p>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {formatCurrency(monthlyAmount * Math.min(12, durationMonths))}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 text-sm mb-1">
                  Mode de Versement
                </p>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Paiements par virement bancaire ou mobile money. 
                  Premier versement: 7-14 jours après validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ========== RENDER: RECOMMENDED PROGRAMS ==========
  const renderRecommendedPrograms = () => {
    if (!selectedPerson) return null;

    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Programmes Recommandés
          </h3>
          {loadingPrograms && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
        </div>

        {loadingPrograms && recommendedPrograms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p>Chargement des programmes...</p>
          </div>
        ) : recommendedPrograms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Aucun programme disponible</p>
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
                className={`text-left p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                  selectedProgram?.id === program.id
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                    {program.name}
                  </h4>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded flex-shrink-0 ml-2">
                    {program.code}
                  </span>
                </div>

                {program.benefit_amount && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatCurrency(program.benefit_amount)}</span>
                  </div>
                )}
                
                {program.eligibility_score != null && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs font-medium text-green-700 mb-1">
                      Score: {parseFloat(program.eligibility_score).toFixed(1)}%
                    </p>
                    <div className="bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, parseFloat(program.eligibility_score || 0))}%` }}
                      />
                    </div>
                  </div>
                )}

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

  // ========== RENDER: ERROR ==========
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
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ========== RENDER: VULNERABILITY RESULTS ==========
  const renderVulnerabilityResults = () => {
    if (!vulnerabilityData) return null;

    const mainScore = parseFloat(vulnerabilityData.vulnerability_score || 0);
    const riskLevel = vulnerabilityData.risk_level || 'MEDIUM';
    const riskColor = getRiskLevelColor(riskLevel);

    const dimensionScores = [
      { key: 'health_vulnerability_score', label: 'Santé', icon: Heart, color: 'red' },
      { key: 'economic_vulnerability_score', label: 'Économique', icon: Briefcase, color: 'blue' },
      { key: 'social_vulnerability_score', label: 'Social', icon: Users, color: 'green' },
      { key: 'household_composition_score', label: 'Ménage', icon: Home, color: 'yellow' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-gray-200 rounded-xl p-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-3">Score de Vulnérabilité Global</p>
            <div className="relative inline-block">
              <p className="text-7xl font-bold text-blue-600">{mainScore.toFixed(1)}</p>
              <p className="text-2xl text-gray-500 mt-1">/100</p>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2">
              <Shield className={`w-6 h-6 text-${riskColor}-600`} />
              <span className={`px-4 py-2 bg-${riskColor}-100 text-${riskColor}-800 rounded-full font-semibold`}>
                Risque {getRiskLevelLabel(riskLevel)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensionScores.map((dimension) => {
            const score = parseFloat(vulnerabilityData[dimension.key] || 0);
            const Icon = dimension.icon;
            
            return (
              <div key={dimension.key} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 text-${dimension.color}-600`} />
                    <span className="font-medium text-gray-700">{dimension.label}</span>
                  </div>
                  <span className={`text-2xl font-bold text-${dimension.color}-600`}>
                    {score.toFixed(1)}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${dimension.color}-600 h-2 rounded-full`}
                    style={{ width: `${Math.min(100, score)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ========== RENDER: ELIGIBILITY RESULTS ==========
  const renderEligibilityResults = () => {
    if (!eligibilityData) return null;

    const isEligible = eligibilityData.is_eligible || 
                       ['HIGHLY_RECOMMENDED', 'RECOMMENDED'].includes(eligibilityData.recommendation_level);
    const score = parseFloat(eligibilityData.eligibility_score || 0);

    return (
      <div className="space-y-6">
        <div className={`border-2 rounded-xl p-6 ${
          isEligible ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            {isEligible ? (
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            ) : (
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-10 h-10 text-orange-600" />
              </div>
            )}
            <div>
              <h3 className={`text-2xl font-bold ${
                isEligible ? 'text-green-900' : 'text-orange-900'
              }`}>
                {isEligible ? '✓ Éligible' : 'Non Éligible'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedProgram?.name || selectedProgram?.program_name}
              </p>
            </div>
          </div>

          {score != null && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Score d'éligibilité</span>
                <span className="text-lg font-bold">{score.toFixed(1)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${isEligible ? 'bg-green-600' : 'bg-orange-600'}`}
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ✅ AMÉLIORATION 1: Score Breakdown */}
        {renderScoreBreakdown()}

        {/* ✅ AMÉLIORATION 2: Documents Checklist */}
        {renderDocumentsChecklist()}

        {/* ✅ AMÉLIORATION 3: Montant Estimé */}
        {renderEstimatedBenefit()}
      </div>
    );
  };

  // ========== MAIN RENDER ==========

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Activity className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Services</h2>
          <p className="text-sm text-gray-600">Éligibilité & Vulnérabilité</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          🔍 Rechercher un bénéficiaire
        </label>
        <PersonSearch onSelect={setSelectedPerson} selectedPerson={selectedPerson} />
        {selectedPerson && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">
              ✓ Bénéficiaire: <span className="font-bold">{selectedPerson.first_name} {selectedPerson.last_name}</span>
            </p>
            <p className="text-xs text-blue-700 mt-1">RSU ID: {selectedPerson.rsu_id}</p>
          </div>
        )}
      </div>

      {renderRecommendedPrograms()}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveView('vulnerability')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
              activeView === 'vulnerability'
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <Activity size={20} />
            <span>Vulnérabilité</span>
          </button>

          <button
            onClick={() => setActiveView('eligibility')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
              activeView === 'eligibility'
                ? 'text-green-600 border-green-600 bg-green-50'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <Target size={20} />
            <span>Éligibilité</span>
          </button>
        </div>

        <div className="p-6">
          {renderError()}

          {activeView === 'vulnerability' && (
            <div className="space-y-6">
              {!selectedPerson ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    Sélectionnez un bénéficiaire pour calculer sa vulnérabilité
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <button
                      onClick={handleCalculateVulnerability}
                      disabled={loading}
                      className={`px-8 py-4 rounded-lg flex items-center gap-3 font-semibold text-lg transition-all ${
                        loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      }`}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          Calcul en cours...
                        </>
                      ) : (
                        <>
                          <Activity className="w-6 h-6" />
                          Calculer Vulnérabilité
                        </>
                      )}
                    </button>
                  </div>
                  {renderVulnerabilityResults()}
                </>
              )}
            </div>
          )}

          {activeView === 'eligibility' && (
            <div className="space-y-6">
              {!selectedPerson ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Sélectionnez un bénéficiaire</p>
                </div>
              ) : !selectedProgram ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    Sélectionnez un programme dans la liste ci-dessus
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900">
                      Programme: <span className="font-bold">{selectedProgram.name || selectedProgram.program_name}</span>
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={handleCheckEligibility}
                      disabled={loading}
                      className={`px-8 py-4 rounded-lg flex items-center gap-3 font-semibold text-lg transition-all ${
                        loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                      }`}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          Vérification...
                        </>
                      ) : (
                        <>
                          <Target className="w-6 h-6" />
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