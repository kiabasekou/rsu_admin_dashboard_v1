/**
 * 🇬🇦 RSU GABON - OverviewTab CORRECTION FINALE
 * ===============================================
 * Standards Top 1% - FIX COMPLET
 * 
 * PROBLÈME RÉSOLU:
 * ❌ AVANT: data.province_distribution (n'existe pas)
 * ✅ APRÈS: data.province_data (correspond au backend)
 * 
 * ❌ AVANT: data.stats (n'existe pas)
 * ✅ APRÈS: data.overview (correspond au backend)
 * 
 * Fichier: src/components/Dashboard/OverviewTab.jsx
 * Date: 18 Décembre 2025
 */

import React from 'react';
import { Users, Home, Activity, TrendingUp, Globe, Shield, AlertCircle, Loader } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

export default function OverviewTab({ data, loading, error }) {
  // ✅ Logging pour debug
  console.log('📊 OverviewTab received data:', data);
  
  // ✅ CORRECTION CRITIQUE: Utiliser les VRAIES clés du backend
  const provinceData = data?.province_data || [];          // ✅ CORRIGÉ (était province_distribution)
  const monthlyData = data?.monthly_enrollments || [];     // ✅ OK
  const stats = data?.overview || {};                      // ✅ CORRIGÉ (était stats)
  const vulnerabilityData = data?.vulnerability_distribution || [];
  
  console.log('📊 Province data:', provinceData);
  console.log('📊 Monthly data:', monthlyData);
  console.log('📊 Stats:', stats);

  // ================================================================================
  // GUARD CLAUSES: Gérer les états spéciaux AVANT le rendu principal
  // ================================================================================

  // ✅ État: Chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Chargement des statistiques...</p>
          <p className="text-gray-400 text-sm mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  // ✅ État: Erreur
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-800 mb-2">Erreur de chargement</h3>
        <p className="text-red-600 mb-4">
          {typeof error === 'string' ? error : 'Impossible de charger les données du dashboard'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // ✅ État: Pas de données (DB vide)
  if (!data || (provinceData.length === 0 && monthlyData.length === 0 && Object.keys(stats).length === 0)) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <Shield size={48} className="text-yellow-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-yellow-800 mb-2">Aucune donnée disponible</h3>
        <p className="text-yellow-700 mb-4">
          Les statistiques ne sont pas encore disponibles.
        </p>
        <div className="bg-white rounded p-4 text-left text-sm">
          <p className="font-semibold text-gray-700 mb-2">Causes possibles:</p>
          <ul className="space-y-1 text-gray-600">
            <li>• La base de données est vide</li>
            <li>• Le backend n'a pas encore généré les statistiques</li>
            <li>• Erreur de configuration du endpoint analytics</li>
          </ul>
        </div>
      </div>
    );
  }

  // ================================================================================
  // RENDU PRINCIPAL: Données disponibles
  // ================================================================================

  return (
    <div className="space-y-6">
      {/* ============ CARTES STATISTIQUES ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="text-blue-600" size={24} />}
          title="Total Bénéficiaires"
          value={stats.total_persons || 0}
          change="+12% ce mois"
          bgColor="bg-blue-50"
          subtitle={`${stats.verified_persons || 0} vérifiés`}
        />
        
        <StatCard
          icon={<Home className="text-green-600" size={24} />}
          title="Ménages Enregistrés"
          value={stats.total_households || 0}
          change="+8% ce mois"
          bgColor="bg-green-50"
          subtitle={`${stats.total_assessments || 0} évaluations`}
        />
        
        <StatCard
          icon={<Activity className="text-purple-600" size={24} />}
          title="Taux Vérification"
          value={`${stats.verification_rate || 0}%`}
          change={`${stats.verified_persons || 0} / ${stats.total_persons || 0}`}
          bgColor="bg-purple-50"
          subtitle="Vérification identité"
        />
        
        <StatCard
          icon={<TrendingUp className="text-orange-600" size={24} />}
          title="Nouveaux (7j)"
          value={stats.persons_this_week || 0}
          change="Cette semaine"
          bgColor="bg-orange-50"
          subtitle={`Complétude: ${stats.avg_completeness || 0}%`}
        />
      </div>

      {/* ============ CHARTS ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Distribution Géographique */}
        {provinceData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Globe size={20} className="text-blue-600" />
              Distribution Géographique ({provinceData.length} provinces)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={provinceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => {
                    // ✅ Gestion robuste du pourcentage
                    const count = entry.count || entry.value || 0;
                    const name = entry.name || entry.province || 'N/A';
                    return count > 0 ? `${name}` : '';
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="province"
                >
                  {provinceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const provinceName = props.payload.province || props.payload.name;
                    return [
                      `${value.toLocaleString('fr-FR')} personnes`,
                      provinceName
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-gray-500 text-center">
              📡 Source: GET /analytics/dashboard/ - {provinceData.reduce((sum, p) => sum + (p.count || 0), 0).toLocaleString('fr-FR')} total
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Globe size={40} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Aucune donnée géographique</p>
            <p className="text-sm text-gray-500 mt-1">Ajoutez des bénéficiaires avec leur province</p>
          </div>
        )}

        {/* CHART 2: Tendances Mensuelles */}
        {monthlyData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-600" />
              Enrôlements Mensuels (6 mois)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString('fr-FR')} enrôlements`, 'Total']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Enrôlements"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-gray-500 text-center">
              📡 Source: GET /analytics/dashboard/ - Moyenne: {(monthlyData.reduce((sum, m) => sum + (m.count || 0), 0) / monthlyData.length).toFixed(0)}/mois
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp size={40} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Aucune donnée d'enrôlement</p>
            <p className="text-sm text-gray-500 mt-1">Les enrôlements apparaîtront ici au fil du temps</p>
          </div>
        )}
      </div>

      {/* ============ DISTRIBUTION VULNÉRABILITÉ ============ */}
      {vulnerabilityData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Activity size={20} className="text-purple-600" />
            Distribution Vulnérabilité
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={vulnerabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} (${entry.value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {vulnerabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorForRisk(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-xs text-gray-500 text-center">
            📡 Source: GET /analytics/dashboard/
          </div>
        </div>
      )}

      {/* ============ RÉSUMÉ DÉTAILLÉ ============ */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Résumé détaillé</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Personnes</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Total: {stats.total_persons?.toLocaleString('fr-FR') || 0}</li>
              <li>• Vérifiées: {stats.verified_persons?.toLocaleString('fr-FR') || 0}</li>
              <li>• Cette semaine: {stats.persons_this_week?.toLocaleString('fr-FR') || 0}</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Ménages</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Total: {stats.total_households?.toLocaleString('fr-FR') || 0}</li>
              <li>• Évaluations: {stats.total_assessments?.toLocaleString('fr-FR') || 0}</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Qualité données</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Complétude: {stats.avg_completeness || 0}%</li>
              <li>• Vérification: {stats.verification_rate || 0}%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============ DEBUG INFO (Dev only) ============ */}
      {process.env.NODE_ENV === 'development' && (
        <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <summary className="cursor-pointer text-sm font-mono text-gray-700 hover:text-blue-600 flex items-center gap-2">
            <span>🔍 Debug: Structure données API</span>
            <span className="text-xs text-gray-500">(cliquer pour voir)</span>
          </summary>
          <pre className="mt-2 text-xs overflow-auto max-h-96 bg-white p-4 rounded border border-gray-300">
            {JSON.stringify({ data, stats, provinceData, monthlyData }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

// ================================================================================
// COMPOSANTS UTILITAIRES
// ================================================================================

/**
 * Carte de statistique réutilisable
 */
function StatCard({ icon, title, value, change, bgColor, subtitle }) {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
      </p>
      <p className="text-xs text-gray-500">{change}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * Helper pour couleurs de risque de vulnérabilité
 */
function getColorForRisk(name) {
  const colors = {
    'LOW': '#10b981',      // Vert
    'MODERATE': '#f59e0b', // Orange
    'HIGH': '#ef4444',     // Rouge
    'CRITICAL': '#dc2626'  // Rouge foncé
  };
  return colors[name] || '#6b7280'; // Gris par défaut
}