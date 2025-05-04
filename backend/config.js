/**
 * Backend configuration utility to handle environment-specific variables
 */
const path = require('path');
// Load the .env file from the root directory
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Log environment variables for debugging
console.log('ENV Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  FORCE_PRODUCTION: process.env.FORCE_PRODUCTION,
  PORT: process.env.PORT,
  PORT_PROD: process.env.PORT_PROD,
  MONGO_URI: process.env.MONGO_URI ? '(set)' : '(not set)',
  MONGO_URI_PROD: process.env.MONGO_URI_PROD ? '(set)' : '(not set)'
});

// Determine if we should use production values
const useProduction = 
  process.env.FORCE_PRODUCTION === 'true' || 
  process.env.NODE_ENV === 'production';

// Server configuration
const PORT = useProduction ? process.env.PORT_PROD : process.env.PORT;

// MongoDB configuration
let MONGO_URI = useProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI;

// Ensure the URI points to GameDistributionDB database
if (MONGO_URI) {
  // If URI doesn't specify a database or uses 'test', modify it to use GameDistributionDB
  const dbNameMatch = MONGO_URI.match(/\/([^/?]+)(\?|$)/);
  const currentDbName = dbNameMatch ? dbNameMatch[1] : null;
  
  if (!currentDbName || currentDbName === 'test') {
    // Replace the database name with GameDistributionDB
    if (MONGO_URI.includes('/?')) {
      // If URI has parameters but no explicit DB
      MONGO_URI = MONGO_URI.replace('/?', '/GameDistributionDB?');
    } else if (MONGO_URI.includes('/test?')) {
      // If URI explicitly has test DB with parameters
      MONGO_URI = MONGO_URI.replace('/test?', '/GameDistributionDB?');
    } else if (MONGO_URI.includes('/test')) {
      // If URI explicitly has test DB without parameters
      MONGO_URI = MONGO_URI.replace('/test', '/GameDistributionDB');
    } else if (!MONGO_URI.match(/\/[^/?]+(\?|$)/)) {
      // If URI has no database name before parameters
      const lastSlashIndex = MONGO_URI.lastIndexOf('/');
      MONGO_URI = MONGO_URI.substring(0, lastSlashIndex + 1) + 'GameDistributionDB' + MONGO_URI.substring(lastSlashIndex + 1);
    }
  }
}

// Mask password for safe logging (if URI exists)
const maskUri = (uri) => {
  if (!uri) return null;
  try {
    // Create a safe version for logging by masking passwords
    return uri.replace(/(mongodb:\/\/[^:]+:)([^@]+)(@.+)/, '$1****$3');
  } catch (e) {
    return '(invalid uri format)';
  }
};

// Log the actual URI being used (masked)
console.log('Using MongoDB URI:', maskUri(MONGO_URI));
console.log('Target database:', MONGO_URI ? MONGO_URI.split('/').pop().split('?')[0] : 'unknown');

// Export configuration object
module.exports = {
  port: PORT || 5001,
  mongoUri: MONGO_URI,
  isProduction: useProduction,
}; 