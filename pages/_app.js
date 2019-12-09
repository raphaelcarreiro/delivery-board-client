import React, { createContext } from 'react';
import App from 'next/app';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import Header from '../src/components/layout/Header';
import { mobileCheck } from '../src/helpers/MobileCheck';
import Footer from '../src/components/layout/Footer';
import { api } from '../src/services/api';
import Loading from '../src/components/loading/Loading';
import Messaging from '../src/components/messaging/Messaging';
import { verifyToken } from '../src/helpers/verifyToken';
import { withRouter } from 'next/router';

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
  user: null,
  handleSetUser: () => {},
  handleLogout: () => {},
});

class MyApp extends App {
  state = {
    isMobile: false,
    windowWidth: 1500,
    restaurant: null,
    user: null,
    loading: false,
  };

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    let restaurant;

    api()
      .get('restaurants')
      .then(response => {
        restaurant = response.data;
      })
      .finally(() => {
        const payload = verifyToken();
        this.setState({
          isMobile: mobileCheck(),
          windowWidth: window.innerWidth,
          restaurant: restaurant,
          user: payload,
        });
      });

    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      isMobile: mobileCheck(),
      windowWidth: window.innerWidth,
    });
  };

  handleSetUser = user => {
    this.setState({
      user,
    });
  };

  handleLogout = () => {
    this.setState({
      loading: true,
    });

    api()
      .post('/logout')
      .then(response => {
        const { router } = this.props;
        localStorage.removeItem(process.env.localStorageTokenName);
        this.setState({
          user: null,
        });
        router.push('/');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const { Component, pageProps, classes } = this.props;
    const { isMobile, windowWidth, restaurant, user, loading } = this.state;

    return (
      <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContext.Provider
            value={{
              handleSetUser: this.handleSetUser,
              handleLogout: this.handleLogout,
              isMobile: isMobile,
              windowWidth: windowWidth,
              restaurant: restaurant,
              user: user,
            }}
          >
            {!restaurant && <Loading background />}
            {loading && <Loading background />}
            <Messaging>
              <Header />
              <div className={isMobile || windowWidth < 1280 ? classes.mobileContainer : classes.container}>
                <Component {...pageProps} />
              </div>
              <Footer />
            </Messaging>
          </AppContext.Provider>
        </ThemeProvider>
      </>
    );
  }
}

export default withStyles(styles)(withRouter(MyApp));
