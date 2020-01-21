const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const next = require('next');
const { parse } = require('url');
const { join } = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT, 10) || 3000;

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(sslRedirect());

    server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // handle GET request to /service-worker.js
      if (pathname === '/service-worker.js') {
        const filePath = join(__dirname, '.next', pathname);

        app.serveStatic(req, res, filePath);
      } else {
        handle(req, res, parsedUrl);
      }
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
