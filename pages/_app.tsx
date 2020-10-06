import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import App from '../src/App';
import { store } from '../src/store/redux';
import { AppProps } from 'next/app';
import '../src/styles/global.css';
import Head from 'next/head';

const CustomApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
        <title>SGrande Delivery</title>
      </Head>
      <Provider store={store}>
        <App pageProps={pageProps} Component={Component} />
      </Provider>
    </>
  );
};

export default CustomApp;
