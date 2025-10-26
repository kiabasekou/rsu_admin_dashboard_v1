// src/config/env.js
export const ENV = {
  apiUrl: process.env.REACT_APP_API_URL,
  isDevelopment: process.env.REACT_APP_ENV === 'development',
  isProduction: process.env.REACT_APP_ENV === 'production',
  debug: process.env.REACT_APP_DEBUG === 'true',
};

// Usage
import { ENV } from './config/env';

if (ENV.debug) {
  console.log('API URL:', ENV.apiUrl);
}