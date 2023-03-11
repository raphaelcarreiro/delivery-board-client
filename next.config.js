const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  disableDevLogs: true,
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  // ...
});

module.exports = withPWA({
  images: {
    domains: ['sg-delivery.s3.sa-east-1.amazonaws.com'],
  },
  compiler: {
    styledComponents: true,
  },
});
