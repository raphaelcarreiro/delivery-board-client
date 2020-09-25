import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { api } from './services/api';
import { useRouter } from 'next/router';
import { mobileCheck } from './helpers/MobileCheck';
import { useDispatch } from 'react-redux';
import { setRestaurant, setRestaurantIsOpen } from './store/redux/modules/restaurant/actions';
import { setUser, removeUser } from './store/redux/modules/user/actions';
import { verifyToken } from './helpers/verifyToken';
import { setCart } from 'src/store/redux/modules/cart/actions';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { createTheme } from 'src/helpers/createTheme';
import { moneyFormat } from './helpers/numberFormat';
import { setPromotions } from './store/redux/modules/promotion/actions';
import { NextComponentType } from 'next';
import { useSelector } from './store/redux/selector';
import { LinearProgress } from '@material-ui/core';
import { initialize as reactotronInitialize } from 'src/config/ReactotronInitialize';
import { getFirebaseMessaging, firebaseMessagingIsSupported as isSupported } from 'src/config/FirebaseConfig';
import Loading from './components/loading/Loading';
import OnlyMain from './components/layout/OnlyMain';
import Default from './components/layout/Default';
import Sidebar from './components/sidebar/Sidebar';
import InitialLoading from './components/loading/InitialLoading';
import Checkout from './components/layout/Checkout';
import CssBaseline from '@material-ui/core/CssBaseline';
import defaultTheme from './theme';
import io from 'socket.io-client';
import reactGA from 'react-ga';
import MessagingProvider from './hooks/messaging';

const useStyles = makeStyles({
  progressBar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1102,
    height: 2,
  },
});

interface AppContextData {
  isMobile: boolean;
  windowWidth: number | null;
  isOpenMenu: boolean;
  isCartVisible: boolean;
  redirect: string | null;
  socket: SocketIOClient.Socket | null;
  readyToInstall: boolean;
  fmHasToken: boolean;
  setRedirect(uri: string): void;
  handleLogout(): void;
  handleOpenMenu(): void;
  handleCartVisibility(state: boolean): void;
  handleInstallApp(): void;
  handleRequestPermissionMessaging(): void;
  shownPlayStoreBanner: boolean;
  handleShowPlayStoreBanner(): void;
}

interface AppProps {
  pageProps: any;
  Component: NextComponentType;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const AppContext = createContext<AppContextData>({} as AppContextData);

export const menuWidth = 260;
let socket: SocketIOClient.Socket;
let defferedPromptPwa;

const App: React.FC<AppProps> = ({ pageProps, Component }) => {
  const classes = useStyles({});
  const user = useSelector(state => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1500);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const [readyToInstall, setReadyToInstall] = useState(false);
  const [fmHasToken, setFmHasToken] = useState(false);
  const restaurant = useSelector(state => state.restaurant);
  const [shownPlayStoreBanner, setShownPlayStoreBanner] = useState(true);

  const handleCartVisibility = useCallback((state?: boolean) => {
    setIsCartVisible(oldValue => (state === undefined ? !oldValue : state));
  }, []);

  const handleOpenMenu = useCallback(() => {
    setIsOpenMenu(oldValue => !oldValue);
  }, []);

  const handleSetRedirect = useCallback((uri: string) => {
    setRedirect(uri);
  }, []);

  const handleShowPlayStoreBanner = useCallback(() => {
    setShownPlayStoreBanner(oldValue => !oldValue);
  }, []);

  const handleLogout = useCallback(() => {
    setLoading(true);

    api()
      .post('/logout')
      .then(() => {
        if (process.env.TOKEN_NAME) localStorage.removeItem(process.env.TOKEN_NAME);
        dispatch(removeUser());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  // function to pwa installation
  const handleInstallApp = useCallback(() => {
    defferedPromptPwa.prompt();
    defferedPromptPwa.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      defferedPromptPwa = null;
    });
  }, []);

  const appProviderValue: AppContextData = {
    isMobile,
    windowWidth,
    isOpenMenu,
    isCartVisible,
    redirect,
    socket,
    readyToInstall,
    fmHasToken,
    shownPlayStoreBanner,
    handleLogout,
    handleOpenMenu,
    handleCartVisibility,
    setRedirect: handleSetRedirect,
    handleInstallApp,
    handleRequestPermissionMessaging: handleRequestPermissionMessaging,
    handleShowPlayStoreBanner: handleShowPlayStoreBanner,
  };

  // paginas que não precisam no cabeçalho e rodapé padrões
  const paths = [
    '/register',
    '/login',
    '/login/email',
    '/guest-register',
    '/password-request',
    '/password-reset/[token]',
  ];
  const checkoutPaths = ['/checkout'];

  // load restaurant data from server
  useEffect(() => {
    function loadPromotions() {
      api()
        .get('/promotions')
        .then(response => {
          dispatch(setPromotions(response.data));
        });
    }

    function loadRestaurant() {
      return api()
        .get('/restaurants')
        .then(response => {
          const _restaurant = response.data;
          const { configs } = _restaurant;

          dispatch(
            setRestaurant({
              ..._restaurant,
              configs: {
                ..._restaurant.configs,
                formattedTax: moneyFormat(_restaurant.configs.tax_value),
                formattedOrderMinimumValue: moneyFormat(_restaurant.configs.order_minimum_value),
              },
            })
          );

          if (process.env.LOCALSTORAGE_CART) {
            let cart = localStorage.getItem(process.env.LOCALSTORAGE_CART);
            if (cart) {
              cart = JSON.parse(cart);
              dispatch(setCart(cart));
            }
          }

          setTheme(createTheme(_restaurant.primary_color, _restaurant.secondary_color));

          if (configs.google_analytics_id) {
            reactGA.initialize(_restaurant.configs.google_analytics_id);
            reactGA.set({ page: window.location.pathname });
            reactGA.pageview(window.location.pathname);
          }
        })
        .catch(() => {
          console.log('Erro ao carregar os dados do restaurante');
        })
        .finally(() => {
          loadPromotions();
        });
    }

    function loadUser() {
      const payload = verifyToken();
      if (payload) {
        return api()
          .get(`/users/${payload.id}`)
          .then(response => {
            dispatch(setUser(response.data));
          })
          .catch(err => {
            console.error(err.response.data.error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }

    Promise.all([loadRestaurant(), loadUser()]).then(() => {
      setInitialLoading(false);
      document.body.classList.add('zoom');
    });
  }, [dispatch]);

  useEffect(() => {
    reactotronInitialize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    setIsMobile(mobileCheck());
    setWindowWidth(window.innerWidth);
  }, [dispatch]);

  // set webscoket connection
  useEffect(() => {
    function getRestaurantState() {
      api()
        .get('/restaurant/state')
        .then(response => {
          dispatch(setRestaurantIsOpen(response.data.is_open));
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (!socket) socket = io.connect(process.env.URL_NODE_SERVER + '/client');
    if (restaurant) {
      socket.emit('register', restaurant.id);

      socket.on('handleRestaurantState', ({ state }: { state: boolean }) => {
        dispatch(setRestaurantIsOpen(state));
      });

      socket.on('reconnect', () => {
        socket.emit('register', restaurant.id);
        getRestaurantState();
      });
    }
  }, [dispatch, restaurant]);

  const handleRouteChangeComplete = useCallback(() => {
    setIsProgressBarVisible(false);

    if (restaurant)
      if (restaurant.configs.google_analytics_id) {
        reactGA.set({ page: window.location.pathname });
        reactGA.pageview(window.location.pathname);
      }
  }, [restaurant]);

  // set actions on router changes, to display loading
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
  }, [handleRouteChangeComplete, restaurant, router.events]);

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
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      defferedPromptPwa = event;
      setReadyToInstall(true);
    });
  }, []);

  function handleGetTokenFirebaseMessaging() {
    try {
      const firebaseMessaging = getFirebaseMessaging();
      firebaseMessaging
        .getToken()
        .then(token => {
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
        })
        .catch(e => {
          console.log(e);
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

  function handleRouteChangeStart() {
    setIsProgressBarVisible(true);
  }

  function handleRouteChangeError() {
    setIsProgressBarVisible(false);
  }

  function handleResize() {
    const _isMobile = mobileCheck();
    const width = window.innerWidth;

    setIsMobile(_isMobile);
    setWindowWidth(width);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContext.Provider value={appProviderValue}>
        {initialLoading && <InitialLoading />}

        {loading && <Loading background="rgba(250,250,250,0.5)" />}

        {isProgressBarVisible && <LinearProgress color="secondary" className={classes.progressBar} />}

        <Sidebar handleLogout={handleLogout} handleOpenMenu={handleOpenMenu} isOpenMenu={isOpenMenu} />

        <MessagingProvider>
          {paths.includes(router.route) ? (
            <OnlyMain pageProps={pageProps} component={Component} />
          ) : checkoutPaths.includes(router.route) ? (
            <Checkout pageProps={pageProps} component={Component} isMobile={isMobile} windowWidth={windowWidth} />
          ) : (
            <Default pageProps={pageProps} component={Component} isMobile={isMobile} windowWidth={windowWidth} />
          )}
        </MessagingProvider>
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export function useApp(): AppContextData {
  const context = useContext(AppContext);

  return context;
}

export default App;
