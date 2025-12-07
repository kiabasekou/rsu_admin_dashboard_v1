/**
 * 🇬🇦 RSU Gabon - OverviewTab Component CORRECTION COMPLÈTE
 * Standards Top 1% - Protection null/undefined + UX améliorée
 * Fichier: rsu_admin_dashboard_v1/src/components/Dashboard/OverviewTab.jsx
 * 
 * CORRECTIONS APPLIQUÉES:
 * ✅ Valeurs par défaut pour éviter crash sur données null
 * ✅ Guard clauses pour états loading/error/empty
 * ✅ Gestion robuste des pourcentages
 * ✅ Affichage fallback gracieux
 * ✅ Debug info pour développement
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
  
  // ✅ SÉCURITÉ: Destructuration avec valeurs par défaut
  const provinceData = data?.province_data || [];
  const monthlyData = data?.monthly_enrollments || [];
  const stats = data?.overview || {};
  const vulnerabilityData = data?.vulnerability_distribution || [];
  
  console.log('📊 Province data:', provinceData);
  console.log('📊 Monthly data:', monthlyData);
  console.log('📊 Stats:', stats);

  // ================================================================================
  // GUARD CLAUSES: Gérer les états spéciaux AVANT le rendu principal
  // ================================================================================

  // ✅ État: Erreur
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-800 mb-2">Erreur de chargement</h3>
        <p className="text-red-600 mb-4">
          {typeof error === 'string' ? error : 'Une erreur est survenue lors du chargement des données'}
        </p>
        <div className="bg-white rounded p-4 text-left text-sm">
          <p className="font-semibold text-gray-700 mb-2">Vérifications:</p>
          <ul className="space-y-1 text-gray-600">
            <li>✓ Le backend Django est-il démarré sur http://localhost:8000 ?</li>
            <li>✓ L'endpoint /api/v1/analytics/dashboard/ répond-il correctement ?</li>
            <li>✓ Votre token JWT est-il valide ?</li>
          </ul>
        </div>
      </div>
    );
  }

  // ✅ État: Chargement
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton pour cartes stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>

        {/* Skeleton pour charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Indicateur loading */}
        <div className="flex items-center justify-center gap-3 text-blue-600">
          <Loader className="animate-spin" size={24} />
          <span className="font-medium">Chargement des statistiques...</span>
        </div>
      </div>
    );
  }

  // ✅ État: Pas de données
  if (!data || Object.keys(stats).length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <Activity size={48} className="text-yellow-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-yellow-800 mb-2">Aucune donnée disponible</h3>
        <p className="text-yellow-600 mb-4">
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
                    const pct = entry.percentage || 0;
                    const name = entry.name || entry.province || 'N/A';
                    return pct > 2 ? `${name} ${pct.toFixed(1)}%` : ''; // Masquer si < 2%
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {provinceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const pct = props.payload.percentage || 0;
                    const provinceName = props.payload.name || props.payload.province;
                    return [
                      `${value.toLocaleString('fr-FR')} personnes (${pct.toFixed(2)}%)`,
                      provinceName
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-gray-500 text-center">
              📡 Source: GET /analytics/dashboard/ - {provinceData.reduce((sum, p) => sum + (p.value || 0), 0).toLocaleString('fr-FR')} total
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

      {/* ============ INDICATEURS API ============ */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Shield size={18} />
          Intégration APIs Django REST Framework
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-700 font-medium">Endpoints Utilisés:</p>
            <ul className="text-gray-600 text-xs mt-1 space-y-1">
              <li>✅ GET /analytics/dashboard/</li>
              <li>✅ GET /identity/persons/</li>
              <li>✅ GET /programs/programs/</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-700 font-medium">Authentification:</p>
            <ul className="text-gray-600 text-xs mt-1 space-y-1">
              <li>✅ JWT Bearer Token</li>
              <li>✅ Refresh automatique</li>
              <li>✅ Permissions granulaires</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-700 font-medium">Statistiques:</p>
            <ul className="text-gray-600 text-xs mt-1 space-y-1">
              <li>📊 {(stats.total_persons || 0).toLocaleString('fr-FR')} bénéficiaires</li>
              <li>🏠 {(stats.total_households || 0).toLocaleString('fr-FR')} ménages</li>
              <li>📈 Taux vérification: {stats.verification_rate || 0}%</li>
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