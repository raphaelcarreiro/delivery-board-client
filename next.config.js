// const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
//! isProd && require('dotenv').config({ path: isProd ? './.env.production' : './.env.development' });
!isProd && require('dotenv').config({ path: './.env.development' });

exports.default = {
  env: {
    BASEURL_API: process.env.BASEURL_API,
    URL_NODE_SERVER: process.env.URL_NODE_SERVER,
    RESTAURANT_ID: process.env.RESTAURANT_ID,
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
  /* webpack: config => {
    config.resolve.alias.src = path.resolve(__dirname, 'src');
    return config;
  }, */
};
