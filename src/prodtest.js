// Production test script for React
import config from './config';

// This will be executed in the browser
console.log('===== PRODUCTION TEST =====');
console.log('Config values:', config);
console.log('React environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('REACT_APP_API_URL_PROD:', process.env.REACT_APP_API_URL_PROD);
console.log('REACT_APP_FORCE_PRODUCTION:', process.env.REACT_APP_FORCE_PRODUCTION);

// Create a function that can be called from App.js
export function runProductionTest() {
  return {
    isProduction: config.isProduction,
    apiUrl: config.apiUrl,
    environment: process.env.NODE_ENV,
    rawEnvValues: {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      REACT_APP_API_URL_PROD: process.env.REACT_APP_API_URL_PROD,
      REACT_APP_FORCE_PRODUCTION: process.env.REACT_APP_FORCE_PRODUCTION
    }
  };
} 