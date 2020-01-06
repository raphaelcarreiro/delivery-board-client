const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

exports.default = {
  env: {
    BASEURL_API: isProd ? 'http://api.topnfe.com.br/api/client/' : 'http://localhost:8000/api/client/',
    URL_NODE_SERVER: isProd ? 'http://api.topnfe.com.br:3333' : 'http://localhost:3333',
    RESTAURANT_ID: 1, // restaurant id encrypted
    SECRET: 'KkAUmBJBpKLI6SMjSYSX8vqkwehE6H5a0D6mfnJiIq3UdRvkxwvtsC0cnmZpgG9Y', // secret to jwt
    TOKEN_NAME: 'delivery-client-token',
    LOCALSTORAGE_CART: 'delivery-client-cart',
  },
  webpack: config => {
    config.resolve.alias.src = path.resolve(__dirname, 'src');
    return config;
  },
};
