const withOffline = require('next-offline');

const nextConfig = {
  generateInDevMode: true,
};

exports.default = withOffline(nextConfig);
