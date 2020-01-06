import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '../src/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="pt-BR">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <style jsx global>{`
            html,
            body,
            #__next {
              overflow: hidden;
              height: 100%;
              width: 100%;
            }
            body {
              transition: all 0.5s linear;
            }
            #__next {
              position: absolute;
              top: 0;
              left: 0;
            }
            a,
            a:hover {
              text-decoration: none;
            }
            form {
              width: 100%;
            }
            ul {
              width: 100%;
            }
            @media (min-width: 1200px) {
              /* width */
              ::-webkit-scrollbar {
                width: 8px;
              }

              /* Track */
              ::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 10px;
              }

              /* Handle */
              ::-webkit-scrollbar-thumb {
                background: #c6c6c6;
                border-radius: 10px;
              }

              /* Handle on hover */
              ::-webkit-scrollbar-thumb:hover {
                background: #c6c6c6;
              }
            }
            @keyframes zoom {
              from {
                transform: scale(1.4);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            .zoom {
              animation-name: zoom;
              animation-duration: 0.3s;
              animation-iteration-count: 1;
              animation-timing-function: cubic-bezier(0.1, 0.82, 0.25, 1);
            }

            @keyframes placeHolderShimmer {
              0% {
                background-position: -468px 0;
              }
              100% {
                background-position: 468px 0;
              }
            }
            .animated-background {
              animation-duration: 1s;
              animation-fill-mode: forwards;
              animation-iteration-count: infinite;
              animation-name: placeHolderShimmer;
              animation-timing-function: linear;
              background: #f6f7f8;
              background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
              background-size: 800px 104px;
              position: relative;
            }
          `}</style>
        </Head>
        <body>
          <div id="fb-root"></div>
          <script
            async
            defer
            crossOrigin="anonymous"
            src="https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v5.0&appId=588242751734818&autoLogAppEvents=1"
          ></script>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
