import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import App from '../src/App';
import { store } from '../src/store/redux';
import PropTypes from 'prop-types';
// import AppNext from 'next/app';

_App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default function _App({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <App pageProps={pageProps} component={Component} />
      </Provider>
    </>
  );
}
