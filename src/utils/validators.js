/**
 * 🇬🇦 RSU Gabon - Validators
 * Standards Top 1% - Validations spécifiques Gabon
 */

/**
 * Valider téléphone gabonais
 * Format: +241 XX XX XX XX
 */
export const isValidGabonPhone = (phone) => {
  if (!phone) return true; // Champ optionnel
  const regex = /^\+241\s(05|06|07)\s\d{2}\s\d{2}\s\d{2}$/;
  return regex.test(phone);
};

/**
 * Valider coordonnées GPS Gabon
 * Latitude: -4.0 à 2.3
 * Longitude: 8.7 à 14.5
 */
export const isValidGPS = (lat, lon) => {
  if (!lat || !lon) return true; // GPS optionnel
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  return (
    latitude >= -4.0 && latitude <= 2.3 &&
    longitude >= 8.7 && longitude <= 14.5
  );
};

/**
 * Valider NIP (Numéro d'Identité Personnel)
 * Format: XX-XXXX-XXXXX-XX
 */
export const isValidNIP = (nip) => {
  if (!nip) return true;
  return /^\d{2}-\d{4}-\d{5}-\d{2}$/.test(nip);
};

/**
 * Valider RSU-ID
 * Format: RSU-GA-YYYYMMDD-XXXXXX
 */
export const isValidRSUID = (rsuid) => {
  if (!rsuid) return true;
  return /^RSU-GA-\d{8}-\d{6}$/.test(rsuid);
};

/**
 * Valider email
 */
export const isValidEmail = (email) => {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Valider âge minimum
 */
export const isMinAge = (birthDate, minAge = 18) => {
  if (!birthDate) return false;
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }
  return age >= minAge;
};