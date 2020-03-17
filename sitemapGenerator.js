const axios = require('axios');
const fs = require('fs');
const builder = require('xmlbuilder');

function sitemapGenerator() {
  const sitemap = builder
    .create('urlset')
    .dec()
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  sitemap
    .ele('url')
    .ele('loc')
    .txt(`${process.env.PUBLIC_URL}`);

  sitemap
    .ele('url')
    .ele('loc')
    .txt(`${process.env.PUBLIC_URL}/menu`);

  sitemap
    .ele('url')
    .ele('loc')
    .txt(`${process.env.PUBLIC_URL}/checkout`);

  sitemap
    .ele('url')
    .ele('loc')
    .txt(`${process.env.PUBLIC_URL}/login`);

  axios
    .get(`${process.env.BASEURL_API}categories`, {
      headers: {
        RestaurantId: process.env.RESTAURANT_ID,
      },
    })
    .then(response => {
      const categories = response.data;
      categories.forEach(category => {
        sitemap
          .ele('url')
          .ele('loc')
          .txt(`${process.env.PUBLIC_URL}/menu/${category.url}`);
      });
    })
    .catch(() => {
      console.log('There was an error on create sitemap.xml');
    });

  sitemap.end({ pretty: true });
  fs.writeFile(`public/sitemap.xml`, sitemap, 'utf8', err => {
    if (err) {
      console.log(err);
    }
  });

  console.log('sitemap.xml was created');
}

module.exports = sitemapGenerator;
