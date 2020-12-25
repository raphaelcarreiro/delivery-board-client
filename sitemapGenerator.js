require('dotenv').config({ path: './.env.production' });
const axios = require('axios');
const fs = require('fs');
const builder = require('xmlbuilder');

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    RestaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID,
  },
});

const sitemap = builder
  .create('urlset')
  .dec()
  .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

api
  .get('/restaurants')
  .then(response => {
    const restaurant = response.data;
    console.log(`Building ${restaurant.name} sitemap.xml`);

    if (!restaurant) {
      console.log('Restaurant not found');
      return;
    }

    sitemap
      .ele('url')
      .ele('loc')
      .txt(restaurant.url);

    sitemap
      .ele('url')
      .ele('loc')
      .txt(`${restaurant.url}/menu`);

    sitemap
      .ele('url')
      .ele('loc')
      .txt(`${restaurant.url}/checkout`);

    sitemap
      .ele('url')
      .ele('loc')
      .txt(`${restaurant.url}/login`);

    api
      .get('/categories')
      .then(response => {
        const categories = response.data;
        categories.forEach(category => {
          sitemap
            .ele('url')
            .ele('loc')
            .txt(`${restaurant.url}/menu/${category.url}`);
        });
        sitemap.end({ pretty: true });
        fs.writeFile(`public/sitemap.xml`, sitemap.toString(), 'utf8', err => {
          if (err) {
            console.log(err);
          }
        });
        console.log(`${restaurant.name} sitemap.xml created!`);
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
