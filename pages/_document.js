import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import axios from 'axios';
import fs from 'fs';

export default class MyDocument extends Document {
  setGoogleTags() {
    return {
      __html: `
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', '${this.props.gaId}', 'auto');
        ga('send', 'pageview');
      `,
    };
  }

  setFacebookPixel() {
    return {
      __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.props.pixelId}');
      fbq('track', 'PageView');
      `,
    };
  }

  setFacebokScript() {
    return {
      __html: `
      <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src='https://www.facebook.com/tr?id=${this.props.pixelId}&ev=PageView&noscript=1'
      />
      </noscript>
      `,
    };
  }

  render() {
    const { themeColor, gaId, pixelId, googleLogin, facebookLogin } = this.props;
    return (
      <html lang="pt-BR">
        <Head>
          {gaId && (
            <>
              <script dangerouslySetInnerHTML={this.setGoogleTags()} />
            </>
          )}
          {pixelId && (
            <>
              <script dangerouslySetInnerHTML={this.setFacebookPixel()} />
              <noscript dangerouslySetInnerHTML={this.setFacebokScript()} />
            </>
          )}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
          {themeColor && <meta name="theme-color" content={themeColor} />}
          <link rel="manifest" href="/manifest.json" />
          <style jsx global>{`
            html,
            body,
            #__next {
              overflow: hidden;
              height: 100%;
              width: 100%;
            }
            html {
              text-rendering: optimizeLegibility;
              -webkit-font-smoothing: antialiased;
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
          {facebookLogin && (
            <script
              async
              defer
              crossOrigin="anonymous"
              src="https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v5.0&appId=588242751734818&autoLogAppEvents=1"
            />
          )}
          {googleLogin && <script src="https://apis.google.com/js/platform.js" async defer />}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  const api = axios.create({
    baseURL: process.env.BASEURL_API,
    headers: { RestaurantId: process.env.RESTAURANT_ID },
  });

  const response = await api.get('restaurants');
  const { configs } = response.data;
  const restaurant = response.data;

  // manifest.json for PWA
  const manifest = JSON.stringify({
    short_name: restaurant.name,
    name: restaurant.name,
    description: restaurant.description,
    lang: 'pt-BR',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '512x512 264x264 128x128 64x64 32x32 24x24 16x16',
        type: 'image/png',
      },
    ],
    start_url: '/',
    display: 'standalone',
    theme_color: restaurant.primary_color,
    background_color: restaurant.primary_color,
    gcm_sender_id: '103953800507',
  });

  // writing file manifest.json for PWA
  fs.writeFile(`public/manifest.json`, manifest, 'utf8', err => {
    if (err) {
      console.log(err);
    }
  });

  return {
    ...initialProps,
    themeColor: response.data.primary_color,
    manifest: response.data.manifest,
    gaId: configs.google_analytics_id,
    pixelId: configs.facebook_pixel_id,
    googleLogin: configs.google_login,
    facebookLogin: configs.facebookLogin,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
