const withPWA = require('next-pwa');

const config = {
  images: {
    domains: ['sg-delivery.s3.sa-east-1.amazonaws.com'],
  },
  webpack5: true,
  // reactStrictMode: true,
  'typescript.tsconfigPath': './tsconfig.json',
};

const pwaConfig = {
  ...config,
  pwa: {
    dest: 'public',
  },
};

const production = process.env.NODE_ENV === 'production';

module.exports = production ? withPWA(pwaConfig) : config;
