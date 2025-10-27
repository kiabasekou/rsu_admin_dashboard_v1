/**
 * 🇬🇦 RSU Gabon - BeneficiaryFormModal Component
 * Standards Top 1% - Formulaire 4 Étapes
 */
import React, { useState, useEffect } from 'react';
import { X, Save, ArrowLeft, ArrowRight, User, Home, MapPin, FileText } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import beneficiariesAPI from '../../services/api/beneficiariesAPI';
import { isValidGabonPhone, isValidGPS } from '../../utils/validators';
import { PROVINCES } from '../../utils/constants';

export default function BeneficiaryFormModal({ isOpen, onClose, beneficiaryId = null, onSuccess }) {
  const { success, error: showError } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    first_name: '',
    last_name: '',
    middle_name: '',
    gender: '',
    birth_date: '',
    
    // Étape 2: Ménage
    household_size: '',
    total_monthly_income: '',
    housing_type: '',
    has_electricity: false,
    has_water_access: false,
    
    // Étape 3: Géolocalisation
    province: '',
    district: '',
    neighborhood: '',
    latitude: '',
    longitude: '',
    address: '',
    
    // Étape 4: Documents & Contact
    phone_number: '',
    email: '',
    nip: '',
    id_document_type: '',
    id_document_number: '',
  });

  const steps = [
    { id: 1, title: 'Informations Personnelles', icon: User },
    { id: 2, title: 'Ménage', icon: Home },
    { id: 3, title: 'Géolocalisation', icon: MapPin },
    { id: 4, title: 'Documents & Contact', icon: FileText },
  ];

  useEffect(() => {
    if (isOpen && beneficiaryId) {
      loadBeneficiaryData();
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, beneficiaryId]);

  const loadBeneficiaryData = async () => {
    try {
      setLoading(true);
      const data = await beneficiariesAPI.getBeneficiaryById(beneficiaryId);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        middle_name: data.middle_name || '',
        gender: data.gender || '',
        birth_date: data.birth_date || '',
        household_size: data.household?.household_size || '',
        total_monthly_income: data.household?.total_monthly_income || '',
        housing_type: data.household?.housing_type || '',
        has_electricity: data.household?.has_electricity || false,
        has_water_access: data.household?.has_water_access || false,
        province: data.province || '',
        district: data.district || '',
        neighborhood: data.neighborhood || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        address: data.address || '',
        phone_number: data.phone_number || '',
        email: data.email || '',
        nip: data.nip || '',
        id_document_type: data.id_document_type || '',
        id_document_number: data.id_document_number || '',
      });
    } catch (err) {
      console.error('Erreur chargement bénéficiaire:', err);
      showError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '', last_name: '', middle_name: '', gender: '', birth_date: '',
      household_size: '', total_monthly_income: '', housing_type: '',
      has_electricity: false, has_water_access: false,
      province: '', district: '', neighborhood: '', latitude: '', longitude: '', address: '',
      phone_number: '', email: '', nip: '', id_document_type: '', id_document_number: '',
    });
    setCurrentStep(1);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = 'Prénom requis';
      if (!formData.last_name.trim()) newErrors.last_name = 'Nom requis';
      if (!formData.gender) newErrors.gender = 'Genre requis';
      if (!formData.birth_date) newErrors.birth_date = 'Date de naissance requise';
    }

    if (step === 2) {
      if (!formData.household_size || formData.household_size < 1) {
        newErrors.household_size = 'Taille ménage invalide';
      }
      if (!formData.housing_type) newErrors.housing_type = 'Type logement requis';
    }

    if (step === 3) {
      if (!formData.province) newErrors.province = 'Province requise';
      if (formData.latitude && !isValidGPS(parseFloat(formData.latitude), parseFloat(formData.longitude))) {
        newErrors.latitude = 'Coordonnées GPS invalides (hors Gabon)';
      }
    }

    if (step === 4) {
      if (formData.phone_number && !isValidGabonPhone(formData.phone_number)) {
        newErrors.phone_number = 'Format invalide (+241 XX XX XX XX)';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);

    try {
      if (beneficiaryId) {
        await beneficiariesAPI.updateBeneficiary(beneficiaryId, formData);
        success('Bénéficiaire modifié avec succès');
      } else {
        await beneficiariesAPI.createBeneficiary(formData);
        success('Bénéficiaire créé avec succès');
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      console.error('Erreur sauvegarde bénéficiaire:', err);
      showError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.first_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jean"
          />
          {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Obiang"
          />
          {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom de famille</label>
          <input
            type="text"
            value={formData.middle_name}
            onChange={(e) => handleChange('middle_name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nguema"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner...</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
            <option value="OTHER">Autre</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de naissance <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.birth_date}
            onChange={(e) => handleChange('birth_date', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.birth_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.birth_date && <p className="text-red-500 text-xs mt-1">{errors.birth_date}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille du ménage <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.household_size}
            onChange={(e) => handleChange('household_size', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.household_size ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="5"
          />
          {errors.household_size && <p className="text-red-500 text-xs mt-1">{errors.household_size}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Revenu mensuel (FCFA)</label>
          <input
            type="number"
            min="0"
            value={formData.total_monthly_income}
            onChange={(e) => handleChange('total_monthly_income', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="120000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de logement <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.housing_type}
            onChange={(e) => handleChange('housing_type', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.housing_type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner...</option>
            <option value="OWNER">Propriétaire</option>
            <option value="TENANT">Locataire</option>
            <option value="FREE">Logé gratuitement</option>
            <option value="PRECARIOUS">Précaire</option>
          </select>
          {errors.housing_type && <p className="text-red-500 text-xs mt-1">{errors.housing_type}</p>}
        </div>
      </div>

      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.has_electricity}
            onChange={(e) => handleChange('has_electricity', e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Accès à l'électricité</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.has_water_access}
            onChange={(e) => handleChange('has_water_access', e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Accès à l'eau potable</span>
        </label>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.province}
            onChange={(e) => handleChange('province', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.province ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner...</option>
            {PROVINCES.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
          {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
          <input
            type="text"
            value={formData.neighborhood}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nzeng-Ayong"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude GPS
          </label>
          <input
            type="number"
            step="0.00001"
            value={formData.latitude}
            onChange={(e) => handleChange('latitude', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.latitude ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.3901"
          />
          {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
          <p className="text-xs text-gray-500 mt-1">Gabon: -4.0 à 2.3</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude GPS
          </label>
          <input
            type="number"
            step="0.00001"
            value={formData.longitude}
            onChange={(e) => handleChange('longitude', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="9.4544"
          />
          <p className="text-xs text-gray-500 mt-1">Gabon: 8.7 à 14.5</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Adresse détaillée..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.phone_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+241 07 34 56 78"
          />
          {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="exemple@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NIP (Numéro d'Identité Personnel)</label>
          <input
            type="text"
            value={formData.nip}
            onChange={(e) => handleChange('nip', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="XX-XXXX-XXXXX-XX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de document</label>
          <select
            value={formData.id_document_type}
            onChange={(e) => handleChange('id_document_type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            <option value="CNI">Carte Nationale d'Identité</option>
            <option value="PASSPORT">Passeport</option>
            <option value="BIRTH_CERTIFICATE">Acte de naissance</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de document</label>
          <input
            type="text"
            value={formData.id_document_number}
            onChange={(e) => handleChange('id_document_number', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Numéro du document d'identité"
          />
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {beneficiaryId ? 'Modifier le Bénéficiaire' : 'Nouveau Bénéficiaire'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : currentStep > step.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <step.icon size={24} />
                  </div>
                  <span className={`text-xs text-center max-w-24 ${
                    currentStep === step.id ? 'text-blue-600 font-semibold' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="min-h-80">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1 || loading}
              icon={ArrowLeft}
            >
              Précédent
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                icon={ArrowRight}
                iconPosition="right"
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                variant="success"
                loading={loading}
                icon={Save}
              >
                {beneficiaryId ? 'Enregistrer' : 'Créer'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}