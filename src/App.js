import React, { createContext, useState, useEffect } from 'react';
import { api } from './services/api';
import { useRouter } from 'next/router';
import Loading from './components/loading/Loading';
import Messaging from './components/messaging/Messaging';
import OnlyMain from './components/layout/OnlyMain';
import Default from './components/layout/Default';
import { mobileCheck } from './helpers/MobileCheck';
import { useDispatch, useSelector } from 'react-redux';
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
import { initialize as reactotronInitialize } from 'src/config/ReactotronInitialize';
import { getFirebaseMessaging, firebaseMessagingIsSupported as isSupported } from 'src/config/FirebaseConfig';
import reactGA from 'react-ga';

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
  socket: null,
  readyToInstall: false,
  fmHasToken: false,
  setRedirect: () => {},
  handleLogout: () => {},
  handleOpenMenu: () => {},
  handleCartVisibility: () => {},
  handleInstallApp: () => {},
  handleRequestPermissionMessaging: () => {},
});

export const menuWidth = 240;
let socket;
let defferedPromptPwa;

function App({ pageProps, component: Component }) {
  const user = useSelector(state => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const [readyToInstall, setReadyToInstall] = useState(false);
  const restaurant = useSelector(state => state.restaurant);
  const [fmHasToken, setFmHasToken] = useState(false);

  const appProviderValue = {
    isMobile,
    windowWidth,
    isOpenMenu,
    isCartVisible,
    redirect,
    socket,
    readyToInstall,
    fmHasToken,
    handleLogout: handleLogout,
    handleOpenMenu: handleOpenMenu,
    handleCartVisibility: handleCartVisibility,
    setRedirect: setRedirect,
    handleInstallApp: handleInstallApp,
    handleRequestPermissionMessaging: handleRequestPermissionMessaging,
  };

  // paginas que não precisam no cabeçalho e rodapé padrões
  const paths = ['/register', '/login', '/login/email', '/guest-register'];
  const checkoutPaths = ['/checkout'];

  // load restaurant data from server
  useEffect(() => {
    api()
      .get('/restaurants')
      .then(response => {
        const _restaurant = response.data;
        const { configs } = _restaurant;

        dispatch(setRestaurant(_restaurant));
        setTheme(createTheme(_restaurant.primary_color, _restaurant.secondary_color));

        if (configs.google_analytics_id) {
          reactGA.initialize(restaurant.configs.google_analytics_id);
          reactGA.set({ page: window.location.pathname });
          reactGA.pageview(window.location.pathname);
        }
      })
      .catch(() => {
        console.log('Erro ao carregar os dados do restaurante');
      })
      .finally(() => {
        setInitialLoading(false);
        document.body.classList.add('zoom');
      });
  }, []);

  useEffect(() => {
    setInitialLoading(true);
  }, []);

  useEffect(() => {
    reactotronInitialize();
  }, []);

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
  }, []);

  // set webscoket connection
  useEffect(() => {
    if (restaurant) {
      socket = io(process.env.URL_NODE_SERVER, { reconnectionAttempts: 5 });
      socket.on('handleRestaurantState', state => {
        if (state.restaurantId === restaurant.id) dispatch(setRestaurantIsOpen(state));
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [restaurant]);

  // set actions on router changes, to display loading
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
  }, []);

  /*
  handle request permission for firebase messaging if is not server,
  user has been loaded and firebase messaging is supported.
  */
  useEffect(() => {
    if (process.browser)
      if (user.id && isSupported()) {
        handleGetTokenFirebaseMessaging();
      }
  }, [user.id]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      defferedPromptPwa = e;
      setReadyToInstall(true);
    });
  }, []);

  function handleGetTokenFirebaseMessaging() {
    try {
      const firebaseMessaging = getFirebaseMessaging();
      firebaseMessaging.getToken().then(token => {
        if (token) {
          setFmHasToken(true);

          const param = {
            token: token,
            device: navigator.platform,
            type: 'client',
          };

          api()
            .post('/pushTokens', param)
            .catch(err => {
              console.log(err);
            });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  // request permission for push notification
  function handleRequestPermissionMessaging() {
    try {
      const firebaseMessaging = getFirebaseMessaging();
      firebaseMessaging
        .requestPermission()
        .then(async () => {
          const token = await firebaseMessaging.getToken();
          setFmHasToken(true);
          const param = {
            token: token,
            device: navigator.platform,
            type: 'client',
          };

          api()
            .post('/pushTokens', param)
            .catch(err => {
              console.log(err);
            });
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  function handleInstallApp() {
    defferedPromptPwa.prompt();
    defferedPromptPwa.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      defferedPromptPwa = null;
    });
  }

  function handleRouteChangeStart(url) {
    setIsProgressBarVisible(true);
  }

  function handleRouteChangeComplete() {
    setIsProgressBarVisible(false);

    /* if (restaurant.configs.google_analytics_id) {
      reactGA.set({ page: window.location.pathname });
      reactGA.pageview(window.location.pathname);
    } */
  }

  function handleRouteChangeError() {
    setIsProgressBarVisible(false);
  }

  function handleLogout() {
    setLoading(true);

    api()
      .post('/logout')
      .then(response => {
        localStorage.removeItem(process.env.TOKEN_NAME);
        dispatch(removeUser());
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

        {loading && <Loading background="rgba(250,250,250,0.5)" />}

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
  restaurant: PropTypes.object,
};

export default App;
