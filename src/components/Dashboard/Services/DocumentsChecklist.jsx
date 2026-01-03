/**
 * 🇬🇦 RSU GABON - COMPOSANT DOCUMENTS CHECKLIST
 * Standards Top 1% - Liste Documents Requis
 * 
 * Affiche une checklist visuelle des documents :
 * - Documents fournis (✓ vert)
 * - Documents manquants (✗ rouge)
 * - Compteur et alertes
 * 
 * Fichier: src/components/Dashboard/Services/DocumentsChecklist.jsx
 */

import React from 'react';
import { CheckCircle, X, AlertTriangle, FileText, Download } from 'lucide-react';

export default function DocumentsChecklist({ eligibilityData, selectedPerson }) {
  if (!eligibilityData) return null;

  // Documents standards requis (peut être enrichi selon le programme)
  const standardDocuments = [
    { 
      id: 'national_id', 
      name: "Carte d'identité nationale (NIP)", 
      required: true,
      category: 'Identité'
    },
    { 
      id: 'residence', 
      name: "Certificat de résidence", 
      required: true,
      category: 'Domicile'
    },
    { 
      id: 'birth_cert', 
      name: "Acte de naissance", 
      required: false,
      category: 'État civil'
    },
    { 
      id: 'income', 
      name: "Attestation de revenus ou déclaration sur l'honneur", 
      required: true,
      category: 'Financier'
    },
    { 
      id: 'bank_rib', 
      name: "RIB ou preuve de compte bancaire/mobile money", 
      required: true,
      category: 'Financier'
    },
    { 
      id: 'household', 
      name: "Déclaration de composition du ménage", 
      required: false,
      category: 'Famille'
    },
    { 
      id: 'children_birth', 
      name: "Certificat de naissance des enfants (<18 ans)", 
      required: false,
      category: 'Famille'
    }
  ];

  // Documents manquants depuis l'API (si disponible)
  const missingFromAPI = eligibilityData.missing_documents || [];
  
  // Déterminer le statut de chaque document
  const documentsWithStatus = standardDocuments.map(doc => {
    // Vérification simple par correspondance de texte
    const isMissing = missingFromAPI.some(missing => 
      missing.toLowerCase().includes(doc.id) || 
      doc.name.toLowerCase().includes(missing.toLowerCase())
    );
    
    return {
      ...doc,
      status: isMissing ? 'missing' : 'provided'
    };
  });

  const providedDocs = documentsWithStatus.filter(d => d.status === 'provided');
  const missingDocs = documentsWithStatus.filter(d => d.status === 'missing');
  const requiredMissingDocs = missingDocs.filter(d => d.required);

  // Détermination du niveau d'alerte
  const alertLevel = requiredMissingDocs.length > 0 ? 'error' : 
                     missingDocs.length > 0 ? 'warning' : 'success';

  const alertConfig = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertTriangle,
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: AlertTriangle,
      iconColor: 'text-orange-600'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    }
  };

  const config = alertConfig[alertLevel];
  const AlertIcon = config.icon;

  // Groupement par catégorie
  const categories = [...new Set(documentsWithStatus.map(d => d.category))];

  return (
    <div className={`border rounded-lg p-6 ${config.bg} ${config.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className={`text-lg font-semibold ${config.text} flex items-center gap-2 mb-2`}>
            <FileText className="w-5 h-5" />
            Documents Requis
          </h4>
          <p className="text-sm text-gray-600">
            Pour le bénéficiaire: {selectedPerson?.first_name} {selectedPerson?.last_name}
          </p>
        </div>
        <AlertIcon className={`w-6 h-6 ${config.iconColor}`} />
      </div>

      {/* Statistiques */}
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

      {/* Liste des documents par catégorie */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryDocs = documentsWithStatus.filter(d => d.category === category);
          
          return (
            <div key={category} className="bg-white rounded-lg p-4 border border-gray-200">
              <h5 className="font-semibold text-gray-700 mb-3 text-sm">
                📁 {category}
              </h5>
              <ul className="space-y-2">
                {categoryDocs.map((doc) => {
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
          );
        })}
      </div>

      {/* Message d'alerte global */}
      {requiredMissingDocs.length > 0 && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 mb-1">
                ⚠️ Documents obligatoires manquants
              </p>
              <p className="text-sm text-red-800">
                {requiredMissingDocs.length} document{requiredMissingDocs.length > 1 ? 's' : ''} 
                {' '}obligatoire{requiredMissingDocs.length > 1 ? 's' : ''} manquant{requiredMissingDocs.length > 1 ? 's' : ''}.
                L'inscription ne pourra être finalisée sans ces documents.
              </p>
            </div>
          </div>
        </div>
      )}

      {missingDocs.length === 0 && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-900">
              ✓ Tous les documents sont en ordre !
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      {missingDocs.length > 0 && (
        <div className="mt-4 flex gap-3">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <Download className="w-4 h-4" />
            Liste documents à fournir (PDF)
          </button>
        </div>
      )}

      {/* Note explicative */}
      <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>Note :</strong> Les documents marqués "Requis" sont obligatoires pour finaliser 
          l'inscription au programme. Les autres documents sont recommandés mais optionnels. 
          Tous les documents doivent être des originaux ou des copies certifiées conformes.
        </p>
      </div>
    </div>
  );
}