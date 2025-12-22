/**
 * 🇬🇦 RSU Gabon - Services Tab UPDATED
 * Standards Top 1% - UX Améliorée avec Search Components
 * Fichier: rsu_admin_dashboard_v1/src/components/Dashboard/ServicesTab.jsx
 */

import React, { useState } from 'react';
import { Activity, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import PersonSearch from '../common/PersonSearch';
import ProgramSelector from '../common/ProgramSelector';
import EligibilityChecker from '../../pages/Programs/EligibilityChecker';
import RecommendedPrograms from '../../pages/Programs/RecommendedPrograms';
import VulnerabilityDisplay from '../../pages/Services/VulnerabilityDisplay';
import servicesAPI from '../../services/api/servicesAPI';

export default function ServicesTab() {
  const [activeView, setActiveView] = useState('eligibility');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [vulnerabilityData, setVulnerabilityData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculateVulnerability = async () => {
    if (!selectedPerson) return;

    setLoading(true);
    try {
      const response = await servicesAPI.calculateVulnerability(selectedPerson.id);
      setVulnerabilityData(response);
    } catch (error) {
      console.error('Error calculating vulnerability:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'eligibility', label: 'Éligibilité Programme', icon: Target },
    { id: 'recommended', label: 'Programmes Recommandés', icon: TrendingUp },
    { id: 'vulnerability', label: 'Vulnérabilité', icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Services Intelligents</h2>
            <p className="text-gray-600">Moteurs d'éligibilité et d'évaluation de vulnérabilité</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`
                flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors
                ${activeView === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Person Selection (Common) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          1️⃣ Sélection Bénéficiaire
        </h3>
        <PersonSearch 
          onSelect={setSelectedPerson}
          selectedPerson={selectedPerson}
        />
      </div>

      {/* Program Selection (Only for Eligibility) */}
      {activeView === 'eligibility' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            2️⃣ Sélection Programme
          </h3>
          <ProgramSelector
            onSelect={setSelectedProgram}
            selectedProgram={selectedProgram}
          />
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {activeView === 'eligibility' && '3️⃣ Résultat Éligibilité'}
          {activeView === 'recommended' && '2️⃣ Programmes Recommandés'}
          {activeView === 'vulnerability' && '2️⃣ Évaluation Vulnérabilité'}
        </h3>

        {activeView === 'eligibility' && selectedPerson && selectedProgram && (
          <EligibilityChecker 
            personId={selectedPerson.id}
            programCode={selectedProgram.code}
          />
        )}

        {activeView === 'eligibility' && (!selectedPerson || !selectedProgram) && (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Sélectionnez un bénéficiaire et un programme</p>
            <p className="text-sm">pour calculer l'éligibilité</p>
          </div>
        )}

        {activeView === 'recommended' && selectedPerson && (
          <RecommendedPrograms 
            personId={selectedPerson.id}
            minScore={60.0}
          />
        )}

        {activeView === 'recommended' && !selectedPerson && (
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Sélectionnez un bénéficiaire</p>
            <p className="text-sm">pour voir les programmes recommandés</p>
          </div>
        )}

        {activeView === 'vulnerability' && (
          <div>
            <button
              onClick={handleCalculateVulnerability}
              disabled={!selectedPerson || loading}
              className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Calcul en cours...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  Calculer Vulnérabilité
                </>
              )}
            </button>

            {vulnerabilityData && (
              <VulnerabilityDisplay assessment={vulnerabilityData} />
            )}

            {!vulnerabilityData && !loading && !selectedPerson && (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Sélectionnez un bénéficiaire</p>
                <p className="text-sm">pour calculer la vulnérabilité</p>
              </div>
            )}

            {!vulnerabilityData && !loading && selectedPerson && (
              <div className="text-center py-12 text-gray-500">
                <p>Cliquez sur "Calculer Vulnérabilité" pour évaluer le bénéficiaire</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info API */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="font-semibold text-blue-800 mb-1">📡 Endpoints utilisés:</p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>✅ GET /api/v1/identity/persons/ (search)</li>
          <li>✅ GET /api/v1/programs/programs/ (active)</li>
          {activeView === 'eligibility' && (
            <li>✅ POST /api/v1/services/program-eligibility/calculate_eligibility/</li>
          )}
          {activeView === 'recommended' && (
            <li>✅ GET /api/v1/services/program-eligibility/recommended_programs/</li>
          )}
          {activeView === 'vulnerability' && (
            <li>✅ POST /api/v1/services/vulnerability-assessments/calculate/</li>
          )}
        </ul>
      </div>
    </div>
  );
}