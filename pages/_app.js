import React from 'react';
import AppNext from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import { Provider } from 'react-redux';
import App from '../src/App';
import { store } from '../src/store/redux';

class _App extends AppNext {
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
      <Provider store={store}>
        <App pageProps={pageProps} component={Component} />
      </Provider>
    );
  }
}

export default _App;
