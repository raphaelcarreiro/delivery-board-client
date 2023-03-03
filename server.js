const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const next = require('next');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';

const port = parseInt(process.env.PORT, 10) || 3000;

const hostname = 'localhost';

const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(sslRedirect());

    server.all('*', (req, res) => {
      const url = parse(req.url, true);

      return handle(req, res, url);
    });

    server.listen(port, error => {
      if (error) throw error;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
