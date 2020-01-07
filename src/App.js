import React, { createContext, useState, useEffect } from 'react';
import { api } from './services/api';
import { useRouter } from 'next/router';
import Loading from './components/loading/Loading';
import Messaging from './components/messaging/Messaging';
import OnlyMain from './components/layout/OnlyMain';
import Default from './components/layout/Default';
import { mobileCheck } from './helpers/MobileCheck';
import { useDispatch } from 'react-redux';
import { setRestaurant, setRestaurantIsOpen } from './store/redux/modules/restaurant/actions';
import PropTypes from 'prop-types';
import { setUser, removeUser } from './store/redux/modules/user/actions';
import { verifyToken } from './helpers/verifyToken';
import Sidebar from './components/sidebar/Sidebar';
import InitialLoading from './components/loading/InitialLoading';
import Checkout from './components/layout/Checkout';
import { setCart } from 'src/store/redux/modules/cart/actions';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { createTheme } from 'src/helpers/createTheme';
import defaultTheme from '../src/theme';
import io from 'socket.io-client';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles({
  progressBar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 11,
    height: 2,
  },
});

export const AppContext = createContext({
  isMobile: false,
  windowWidth: null,
  isOpenMenu: false,
  isCartVisible: false,
  redirect: null,
  setRedirect: () => {},
  handleLogout: () => {},
  handleOpenMenu: () => {},
  handleCartVisibility: () => {},
});

export const menuWidth = 240;

function App({ pageProps, component: Component }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [theme, setTheme] = useState(defaultTheme);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles();

  const appProviderValue = {
    handleLogout: handleLogout,
    handleOpenMenu: handleOpenMenu,
    handleCartVisibility: handleCartVisibility,
    setRedirect: setRedirect,
    isMobile,
    windowWidth,
    isOpenMenu,
    isCartVisible,
    redirect,
  };

  // paginas que não precisam no cabeçalho e rodapé padrões
  const paths = ['/register', '/login', '/login/email'];
  const checkoutPaths = ['/checkout'];

  useEffect(() => {
    const payload = verifyToken();
    if (payload)
      dispatch(
        setUser({
          loadedFromStorage: true,
          ...payload,
        })
      );

    const cart = JSON.parse(localStorage.getItem(process.env.LOCALSTORAGE_CART));

    if (cart) dispatch(setCart(cart));

    window.addEventListener('resize', handleResize);

    setIsMobile(mobileCheck());
    setWindowWidth(window.innerWidth);

    api()
      .get('restaurants')
      .then(response => {
        const restaurant = response.data;
        dispatch(setRestaurant(response.data));
        setTheme(createTheme(restaurant.primary_color, restaurant.secondary_color));
      })
      .finally(() => {
        setInitialLoading(false);
        document.body.classList.add('zoom');
      });
  }, []);

  useEffect(() => {
    const socket = io(process.env.URL_NODE_SERVER);
    socket.on('handleRestaurantState', state => {
      dispatch(setRestaurantIsOpen(state));
    });
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
  }, []);

  function handleRouteChangeStart() {
    setIsProgressBarVisible(true);
  }

  function handleRouteChangeComplete() {
    setIsProgressBarVisible(false);
  }

  function handleRouteChangeError() {
    setIsProgressBarVisible(false);
  }

  function handleLogout() {
    setLoading(true);

    api()
      .post('/logout')
      .then(response => {
        // router.push('/');
        dispatch(removeUser());
        localStorage.removeItem(process.env.TOKEN_NAME);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleResize() {
    const _isMobile = mobileCheck();
    const width = window.innerWidth;

    setIsMobile(_isMobile);
    setWindowWidth(width);
  }

  function handleOpenMenu() {
    setIsOpenMenu(!isOpenMenu);
  }

  function handleCartVisibility(state = !isCartVisible) {
    setIsCartVisible(state);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContext.Provider value={appProviderValue}>
        {initialLoading && <InitialLoading background="#fafafa" />}

        {loading && <Loading background="#fafafa" />}

        {isProgressBarVisible && <LinearProgress color="primary" className={classes.progressBar} />}

        <Sidebar handleLogout={handleLogout} handleOpenMenu={handleOpenMenu} isOpenMenu={isOpenMenu} />

        <Messaging>
          {paths.includes(router.route) ? (
            <OnlyMain pageProps={pageProps} component={Component} />
          ) : checkoutPaths.includes(router.route) ? (
            <Checkout pageProps={pageProps} component={Component} isMobile={isMobile} windowWidth={windowWidth} />
          ) : (
            <Default pageProps={pageProps} component={Component} isMobile={isMobile} windowWidth={windowWidth} />
          )}
        </Messaging>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

App.propTypes = {
  pageProps: PropTypes.object.isRequired,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};

export default App;
