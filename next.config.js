const path = require('path');

exports.default = {
  env: {
    BASEURL_API: 'http://localhost:8000/api/client/',
    RESTAURANT_ID: 1, // restaurant id encrypted
    SECRET: '9k6wASnUNQmqAGdbbzqGDybIj4G7OxJ94ozjvdNB6DYvF791jXOCKPL3nDbAJwZs', // secret to jwt
    TOKEN_NAME: 'delivery-client-token',
  },
  webpack: config => {
    config.resolve.alias.src = path.resolve(__dirname, 'src');
    return config;
  },
};
