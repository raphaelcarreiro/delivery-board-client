import React, { createContext } from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import Header from '../src/components/layout/Header';
import { mobileCheck } from '../src/helpers/MobileCheck';
import Footer from '../src/components/layout/Footer';
import { api } from '../src/services/api';
import Loading from '../src/components/loading/Loading';

const styles = {
  container: {
    display: 'flex',
    maxWidth: 1366,
    margin: '0 auto',
    paddingTop: 15,
    minHeight: 'calc(100vh - 150px)',
    position: 'relative',
  },
  mobileContainer: {
    margin: '80px 0 0',
    padding: '0 20px',
    minHeight: 'calc(100vh - 150px)',
    position: 'relative',
    display: 'flex',
  },
};

export const menuWidth = 240;

export const AppContext = createContext({
  isMobile: false,
  windowWidth: null,
  restaurant: null,
});

class MyApp extends App {
  /*
  static async getInitialProps(ctx) {
    const appProps = await App.getInitialProps(ctx);
    return { ...appProps };
  }
  */

  state = {
    isMobile: false,
    windowWidth: 1500,
    restaurant: null,
  };

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    window.addEventListener('resize', this.handleResize);

    let restaurant;

    api()
      .get('restaurants')
      .then(response => {
        restaurant = response.data;
      })
      .finally(() => {
        this.setState({
          isMobile: mobileCheck(),
          windowWidth: window.innerWidth,
          restaurant: restaurant,
        });
      });
  }

  handleResize = () => {
    this.setState({
      isMobile: mobileCheck(),
      windowWidth: window.innerWidth,
    });
  };

  render() {
    const { Component, pageProps, classes } = this.props;
    const { isMobile, windowWidth, restaurant } = this.state;

    return (
      <React.Fragment>
        <Head>
          <title>My page</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <AppContext.Provider
            value={{
              isMobile: isMobile,
              windowWidth: windowWidth,
              restaurant: restaurant,
            }}
          >
            {!restaurant && <Loading background />}
            <Header />
            <div className={isMobile || windowWidth < 1280 ? classes.mobileContainer : classes.container}>
              <Component {...pageProps} />
            </div>
            <Footer />
          </AppContext.Provider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MyApp);
