const axios = require('axios');
const fs = require('fs');
const builder = require('xmlbuilder');

function sitemapGenerator() {
  const restaurantId = process.env.RESTAURANT_ID;

  const sitemap = builder
    .create('urlset')
    .dec()
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  axios
    .get(`${process.env.BASEURL_API}restaurants`, {
      headers: {
        RestaurantId: restaurantId,
      },
    })
    .then(response => {
      const restaurant = response.data;
      if (restaurant) {
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

        axios
          .get(`${process.env.BASEURL_API}categories`, {
            headers: {
              RestaurantId: restaurantId,
            },
          })
          .then(response => {
            const categories = response.data;
            categories.forEach(category => {
              sitemap
                .ele('url')
                .ele('loc')
                .txt(`${restaurant.url}/menu/${category.url}`);

              sitemap.end({ pretty: true });
              fs.writeFile(`public/sitemap.xml`, sitemap, 'utf8', err => {
                if (err) {
                  console.log(err);
                }
              });
            });
          })
          .catch(() => {
            console.log('There was an error on create sitemap.xml');
          });
      }
    })
    .catch(() => {
      console.log('There was an error on create sitemap.xml');
    });
}

module.exports = sitemapGenerator;
