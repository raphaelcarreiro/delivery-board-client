const withPWA = require('next-pwa');

const config = {
  pwa: {
    dest: 'public',
  },
};

const production = process.env.NODE_ENV === 'production';

module.exports = production ? withPWA(config) : {};
