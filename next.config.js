const withPWA = require('next-pwa');

const config = {
  pwa: {
    dest: 'public',
  },
  images: {
    domains: ['sg-delivery.s3.sa-east-1.amazonaws.com'],
  },
};

const production = process.env.NODE_ENV === 'production';

module.exports = production
  ? withPWA(config)
  : {
      images: {
        domains: ['sg-delivery.s3.sa-east-1.amazonaws.com'],
      },
    };
