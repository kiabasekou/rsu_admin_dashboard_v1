/**
 * 🇬🇦 RSU GABON - COMPOSANT MONTANT BÉNÉFICE ESTIMÉ
 * Standards Top 1% - Affichage Attractif du Montant
 * 
 * Affiche :
 * - Montant mensuel
 * - Durée du programme
 * - Total cumulé
 * - Calendrier de paiement estimé
 * 
 * Fichier: src/components/Dashboard/Services/EstimatedBenefitCard.jsx
 */

import React from 'react';
import { DollarSign, Calendar, TrendingUp, Info, Clock } from 'lucide-react';

export default function EstimatedBenefitCard({ eligibilityData, selectedProgram }) {
  if (!selectedProgram) return null;

  // Données du programme
  const monthlyAmount = selectedProgram.benefit_amount || 0;
  const durationMonths = selectedProgram.duration_months || 12;
  const programName = selectedProgram.name || selectedProgram.program_name;
  const programCode = selectedProgram.code || selectedProgram.program_code;

  // Calculs
  const totalAmount = monthlyAmount * durationMonths;
  const annualAmount = monthlyAmount * Math.min(12, durationMonths);

  // Format monétaire
  const formatCurrency = (amount) => {
    if (!amount) return '0 FCFA';
    return new Intl.NumberFormat('fr-GA', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calendrier de paiement estimé (exemple)
  const paymentSchedule = [
    { month: 1, status: 'À venir', delay: '7-14 jours après inscription' },
    { month: 2, status: 'À venir', delay: 'Mensuel automatique' },
    { month: 3, status: 'À venir', delay: 'Mensuel automatique' }
  ];

  // Niveau d'éligibilité
  const isHighlyEligible = eligibilityData?.recommendation_level === 'HIGHLY_RECOMMENDED';
  const isEligible = eligibilityData?.is_eligible || 
                     ['HIGHLY_RECOMMENDED', 'RECOMMENDED'].includes(eligibilityData?.recommendation_level);

  return (
    <div className={`border-2 rounded-xl overflow-hidden ${
      isHighlyEligible 
        ? 'border-green-400 shadow-lg shadow-green-100' 
        : isEligible 
          ? 'border-blue-300 shadow-md' 
          : 'border-gray-300'
    }`}>
      {/* Header avec gradient */}
      <div className={`p-6 ${
        isHighlyEligible 
          ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
          : isEligible 
            ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
            : 'bg-gradient-to-br from-gray-400 to-gray-500'
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
        <p className="text-sm opacity-90">{programName}</p>
        <p className="text-xs opacity-75 font-mono mt-1">{programCode}</p>
      </div>

      {/* Corps avec montants */}
      <div className="p-6 bg-white">
        {/* Montant mensuel */}
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

        {/* Détails financiers */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total cumulé */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-xs font-medium text-green-900">Total Cumulé</p>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              sur {durationMonths} mois
            </p>
          </div>

          {/* Montant annuel */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-medium text-purple-900">Par An</p>
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {formatCurrency(annualAmount)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              première année
            </p>
          </div>
        </div>

        {/* Calendrier de paiement */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            Calendrier de Paiement Estimé
          </h4>
          <div className="space-y-2">
            {paymentSchedule.map((payment) => (
              <div 
                key={payment.month}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Mois {payment.month}
                  </p>
                  <p className="text-xs text-gray-600">{payment.delay}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{formatCurrency(monthlyAmount)}</p>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mode de paiement */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 text-sm mb-1">
                Mode de Versement
              </p>
              <p className="text-xs text-blue-800 leading-relaxed">
                Les paiements sont effectués par <strong>virement bancaire</strong> ou 
                <strong> mobile money</strong> (Airtel Money, Moov Money) selon votre choix. 
                Le premier versement intervient généralement <strong>7 à 14 jours</strong> après 
                validation de votre dossier, puis de manière automatique chaque mois.
              </p>
            </div>
          </div>
        </div>

        {/* Note légale */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Note importante :</strong> Les montants affichés sont des estimations 
            basées sur les paramètres actuels du programme. Le montant final peut varier 
            selon la composition de votre ménage, votre situation économique, et les 
            ajustements budgétaires du programme. Les paiements sont conditionnés au 
            maintien de votre éligibilité et au respect des conditions du programme.
          </p>
        </div>

        {/* CTA si hautement éligible */}
        {isHighlyEligible && (
          <div className="mt-4">
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg">
              ✓ Finaliser mon inscription maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}