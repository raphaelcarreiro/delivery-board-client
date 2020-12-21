import React, { ReactElement } from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import axios from 'axios';
import fs from 'fs';

type DocumentProps = {
  gaId: string;
  pixelId: string;
  themeColor: string;
  googleLogin: boolean;
  facebookLogin: boolean;
  restaurantId: string;
};

export default class MyDocument extends Document<DocumentProps> {
  setGoogleTags(): { __html: string } {
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

  setFacebookPixel(): { __html: string } {
    return {
      __html: `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.props.pixelId}');
      fbq('track', 'PageView');`,
    };
  }

  setFacebokScript(): { __html: string } {
    return {
      __html: `<img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src='https://www.facebook.com/tr?id=${this.props.pixelId}&ev=PageView&noscript=1'
      />`,
    };
  }

  render(): ReactElement {
    const { themeColor, gaId, pixelId, googleLogin, facebookLogin } = this.props;
    return (
      <Html lang="pt-BR">
        <Head>
          <link rel="icon" href="/images/favicon.png" />
          <link rel="manifest" href="/manifest.json" />
          {themeColor && <meta name="theme-color" content={themeColor} />}
          {gaId && <script dangerouslySetInnerHTML={this.setGoogleTags()} />}
          {pixelId && (
            <>
              <script dangerouslySetInnerHTML={this.setFacebookPixel()}></script>
              <noscript>
                <img
                  height="1"
                  width="1"
                  style={{ display: 'none' }}
                  src={`https://www.facebook.com/tr?id=${this.props.pixelId}&ev=PageView&noscript=1`}
                />
              </noscript>
            </>
          )}
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
      </Html>
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
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: { RestaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID },
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
        src: restaurant.image.imageUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
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
    facebookLogin: configs.facebook_login,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
