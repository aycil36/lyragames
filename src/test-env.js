// Test script for environment variables
require('dotenv').config();
const path = require('path');

console.log('Current directory:', process.cwd());
console.log('Environment file path:', path.resolve(process.cwd(), '.env'));
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('REACT_APP_API_URL_PROD:', process.env.REACT_APP_API_URL_PROD);
console.log('FORCE_PRODUCTION:', process.env.FORCE_PRODUCTION);

// Create a mock of our config module logic
const useProduction = 
  process.env.FORCE_PRODUCTION === 'true' || 
  process.env.NODE_ENV === 'production';

const API_URL = useProduction 
  ? process.env.REACT_APP_API_URL_PROD 
  : process.env.REACT_APP_API_URL;

console.log('\nCalculated values:');
console.log('useProduction:', useProduction);
console.log('API_URL:', API_URL); 