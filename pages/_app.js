import React from 'react';
import AppNext from 'next/app';
import { Provider } from 'react-redux';
import App from '../src/App';
import { store } from '../src/store/redux';
import { withRouter } from 'next/router';

class _App extends AppNext {
  state = {
    isProgressBarVisible: false,
  };

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

export default withRouter(_App);
