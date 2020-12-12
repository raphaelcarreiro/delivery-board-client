import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { api } from './services/api';
import { useRouter } from 'next/router';
import { mobileCheck } from './helpers/MobileCheck';
import { useDispatch } from 'react-redux';
import { setRestaurant, setRestaurantIsOpen } from './store/redux/modules/restaurant/actions';
import { setCart } from 'src/store/redux/modules/cart/actions';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { createTheme } from 'src/helpers/createTheme';
import { moneyFormat } from './helpers/numberFormat';
import { setPromotions } from './store/redux/modules/promotion/actions';
import { NextComponentType } from 'next';
import { useSelector } from './store/redux/selector';
import { LinearProgress } from '@material-ui/core';
import { initialize as reactotronInitialize } from 'src/config/ReactotronInitialize';
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
import AuthProvider from './hooks/auth';
import FirebaseProvider from './hooks/firebase';
import GoogleLoginProvider from './hooks/googleLogin';
import FacebookLoginProvider from './hooks/facebookLogin';

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
  windowWidth: number;
  isOpenMenu: boolean;
  isCartVisible: boolean;
  redirect: string | null;
  socket: SocketIOClient.Socket | null;
  readyToInstall: boolean;
  shownPlayStoreBanner: boolean;
  setRedirect(uri: string | null): void;
  handleOpenMenu(): void;
  handleCartVisibility(state: boolean): void;
  handleInstallApp(): void;
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
export const socket: SocketIOClient.Socket = io.connect(process.env.NEXT_PUBLIC_SOCKET + '/client');
let defferedPromptPwa;

const App: React.FC<AppProps> = ({ pageProps, Component }) => {
  const classes = useStyles({});
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const [readyToInstall, setReadyToInstall] = useState(false);
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

  const handleRouteChangeComplete = useCallback(() => {
    setIsProgressBarVisible(false);

    if (restaurant)
      if (restaurant.configs.google_analytics_id) {
        reactGA.set({ page: window.location.pathname });
        reactGA.pageview(window.location.pathname);
      }
  }, [restaurant]);

  const appProviderValue: AppContextData = {
    isMobile,
    windowWidth,
    isOpenMenu,
    isCartVisible,
    redirect,
    socket,
    readyToInstall,
    shownPlayStoreBanner,
    handleOpenMenu,
    handleCartVisibility,
    setRedirect: handleSetRedirect,
    handleInstallApp,
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

  useEffect(() => {
    function loadPromotions() {
      api
        .get('/promotions')
        .then(response => {
          dispatch(setPromotions(response.data));
        })
        .catch(err => {
          console.log(err);
        });
    }

    function loadRestaurant() {
      return api
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

    loadRestaurant().then(() => {
      setInitialLoading(false);
      document.body.classList.add('zoom');
    });
  }, [dispatch]);

  useEffect(() => {
    if (!restaurant) return;

    if (process.env.NEXT_PUBLIC_LOCALSTORAGE_CART) {
      let cart = localStorage.getItem(process.env.NEXT_PUBLIC_LOCALSTORAGE_CART);
      if (cart) {
        cart = JSON.parse(cart);
        dispatch(setCart(cart));
      }
    }
  }, [dispatch, restaurant]);

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
      api
        .get('/restaurant/state')
        .then(response => {
          dispatch(setRestaurantIsOpen(response.data.is_open));
        })
        .catch(err => {
          console.log(err);
        });
    }

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

  // set actions on router changes, to display loading
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
  }, [handleRouteChangeComplete, restaurant, router.events]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      setReadyToInstall(true);
      defferedPromptPwa = event;
    });
  }, []);

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
        {isProgressBarVisible && <LinearProgress color="secondary" className={classes.progressBar} />}

        <AuthProvider>
          <FirebaseProvider>
            <MessagingProvider>
              <GoogleLoginProvider>
                <FacebookLoginProvider>
                  <Sidebar handleOpenMenu={handleOpenMenu} isOpenMenu={isOpenMenu} />
                  {paths.includes(router.route) ? (
                    <OnlyMain pageProps={pageProps} component={Component} />
                  ) : checkoutPaths.includes(router.route) ? (
                    <Checkout
                      pageProps={pageProps}
                      component={Component}
                      isMobile={isMobile}
                      windowWidth={windowWidth}
                    />
                  ) : (
                    <Default
                      pageProps={pageProps}
                      component={Component}
                      isMobile={isMobile}
                      windowWidth={windowWidth}
                    />
                  )}
                </FacebookLoginProvider>
              </GoogleLoginProvider>
            </MessagingProvider>
          </FirebaseProvider>
        </AuthProvider>
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export function useApp(): AppContextData {
  const context = useContext(AppContext);

  return context;
}

export default App;
