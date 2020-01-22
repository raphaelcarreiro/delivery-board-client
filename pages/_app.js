import React from 'react';
import AppNext from 'next/app';
import { Provider } from 'react-redux';
import App from '../src/App';
import { store } from '../src/store/redux';
// import axios from 'axios';

class _App extends AppNext {
  /* static async getInitialProps(appContext) {
    const appProps = await AppNext.getInitialProps(appContext);

    if (!process.browser) {
      const api = axios.create({
        baseURL: process.env.BASEURL_API,
        headers: { RestaurantId: process.env.RESTAURANT_ID },
      });

      const response = await api.get('restaurants');
      return {
        ...appProps,
        restaurant: response.data,
      };
    }

    return { ...appProps };
  } */

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Provider store={store}>
          <App pageProps={pageProps} component={Component} />
        </Provider>
      </>
    );
  }
}

export default _App;
