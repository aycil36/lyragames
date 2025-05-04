/**
 * Configuration utility to handle environment-specific variables
 */

// Determine if we should use production values
const useProduction = 
  process.env.REACT_APP_FORCE_PRODUCTION === 'true' || 
  process.env.NODE_ENV === 'production' ||
  process.env.FORCE_PRODUCTION === 'true';

// API configuration
const API_URL = useProduction 
  ? process.env.REACT_APP_API_URL_PROD 
  : process.env.REACT_APP_API_URL;

// For debugging purposes - this will appear in the browser console
console.log('Frontend config:', {
  environment: process.env.NODE_ENV,
  useProduction,
  apiUrl: API_URL,
  envVariables: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_API_URL_PROD: process.env.REACT_APP_API_URL_PROD,
    FORCE_PRODUCTION: process.env.FORCE_PRODUCTION,
    REACT_APP_FORCE_PRODUCTION: process.env.REACT_APP_FORCE_PRODUCTION
  }
});

// Export configuration object
const config = {
  apiUrl: API_URL,
  isProduction: useProduction,
};

export default config; 