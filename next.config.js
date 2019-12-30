const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

exports.default = {
  env: {
    BASEURL_API: isProd ? 'http://api.topnfe.com.br/api/client/' : 'http://localhost:8000/api/client/',
    RESTAURANT_ID: 1, // restaurant id encrypted
    SECRET: '9k6wASnUNQmqAGdbbzqGDybIj4G7OxJ94ozjvdNB6DYvF791jXOCKPL3nDbAJwZs', // secret to jwt
    TOKEN_NAME: 'delivery-client-token',
    LOCALSTORAGE_CART: 'delivery-client-cart',
  },
  webpack: config => {
    config.resolve.alias.src = path.resolve(__dirname, 'src');
    return config;
  },
};
