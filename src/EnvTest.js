import React from 'react';
import config from './config';

function EnvTest() {
  return (
    <div>
      <h2>Environment Test</h2>
      <pre>
        {JSON.stringify({
          apiUrl: config.apiUrl,
          isProduction: config.isProduction,
          rawEnv: {
            NODE_ENV: process.env.NODE_ENV,
            REACT_APP_API_URL: process.env.REACT_APP_API_URL,
            REACT_APP_API_URL_PROD: process.env.REACT_APP_API_URL_PROD,
            FORCE_PRODUCTION: process.env.FORCE_PRODUCTION
          }
        }, null, 2)}
      </pre>
    </div>
  );
}

export default EnvTest; 