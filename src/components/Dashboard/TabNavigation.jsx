
/**
 * 🇬🇦 RSU Gabon - Tab Navigation CORRIGÉE
 * Standards Top 1% - Navigation complète avec Services + Family Graph
 * Fichier: rsu_admin_dashboard_v1/src/components/Dashboard/TabNavigation.jsx
 * 
 * ✅ CORRECTION: Ajout onglet Services manquant
 * ✅ AMÉLIORATION: Ajout onglet Family Graph
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  Activity,        // Services icon
  TrendingUp,
  UserX,
  Network          // Family Graph icon
} from 'lucide-react';

const TABS = [
  {
    id: 'overview',
    label: 'Vue d\'ensemble',
    icon: LayoutDashboard,
    description: 'Statistiques générales'
  },
  {
    id: 'beneficiaries',
    label: 'Bénéficiaires',
    icon: Users,
    description: 'Gestion des personnes'
  },
  {
    id: 'programs',
    label: 'Programmes',
    icon: Target,
    description: 'Programmes sociaux'
  },
  {
    id: 'services',              // ✅ AJOUTÉ
    label: 'Services',
    icon: Activity,
    description: 'Éligibilité & Vulnérabilité'
  },
  {
    id: 'analytics',
    label: 'Analytics IA',
    icon: TrendingUp,
    description: 'KPIs & Rapports avancés',
    badge: 'AI'
  },
  {
    id: 'deduplication',
    label: 'Doublons',
    icon: UserX,
    description: 'Détection anti-fraude',
    badge: 'AI'
  },
  {
    id: 'family-graph',          // ✅ AJOUTÉ
    label: 'Réseau Familial',
    icon: Network,
    description: 'Relations & Dépendances',
    badge: 'NEW'
  }
];

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-3 px-6 py-4 font-medium transition-colors
                whitespace-nowrap border-b-2 hover:bg-gray-50
                ${isActive
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 border-transparent hover:text-gray-800'
                }
              `}
            >
              <Icon size={20} />
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`
                      px-1.5 py-0.5 text-white text-[10px] font-bold rounded
                      ${tab.badge === 'AI' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                        : 'bg-green-500'
                      }
                    `}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-normal">
                  {tab.description}
                </span>
              </div>

              {/* Indicateur actif */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}