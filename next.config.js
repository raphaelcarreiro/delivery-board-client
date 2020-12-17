const withPWA = require('next-pwa');

const config = {
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
  },
};

module.exports = withPWA(config);
