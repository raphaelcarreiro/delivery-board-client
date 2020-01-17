const dotenv = require('dotenv');
const withOffline = require('next-offline');

const isProd = process.env.NODE_ENV === 'production';
dotenv.config({ path: isProd ? './.env.production' : './.env.development' });

const nextConfig = {
  env: {
    BASEURL_API: process.env.BASEURL_API,
    URL_NODE_SERVER: process.env.URL_NODE_SERVER,
    RESTAURANT_ID: process.env.RESTAURANT_ID,
    PUBLIC_URL: process.env.PUBLIC_URL,
    SECRET: process.env.SECRET,
    TOKEN_NAME: process.env.TOKEN_NAME,
    LOCALSTORAGE_CART: process.env.LOCALSTORAGE_CART,
    FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
    FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
    FIREBASE_SENDERID: process.env.FIREBASE_SENDERID,
    FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
    FIREBASE_DATABASEURL: process.env.FIREBASE_DATABASEURL,
    FIREBASE_STORAGEBUCKET: process.env.FIREBASE_STORAGEBUCKET,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  },
};

exports.default = withOffline(nextConfig);
