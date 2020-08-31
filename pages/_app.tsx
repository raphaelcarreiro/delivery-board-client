import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import App from '../src/App';
import { store } from '../src/store/redux';
import { AppProps } from 'next/app';
import '../src/styles/global.css';

const _App: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <App pageProps={pageProps} Component={Component} />
      </Provider>
    </>
  );
};

export default _App;
