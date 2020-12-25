const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT, 10) || 3000;

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(sslRedirect());

    server.all('*', (req, res) => {
      return handle(req, res);
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
