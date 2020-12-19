import React, { useState, useEffect, useCallback } from 'react';
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
import Sidebar from './components/sidebar/Sidebar';
import InitialLoading from './components/loading/InitialLoading';
import CssBaseline from '@material-ui/core/CssBaseline';
import defaultTheme from './theme';
import io from 'socket.io-client';
import reactGA from 'react-ga';
import MessagingProvider from './hooks/messaging';
import AuthProvider from './hooks/auth';
import FirebaseProvider from './hooks/firebase';
import GoogleLoginProvider from './hooks/googleLogin';
import FacebookLoginProvider from './hooks/facebookLogin';
import LayoutHandler from './components/layout/LayoutHandler';
import { AppProvider, AppContextValue } from './hooks/app';

const useStyles = makeStyles({
  progressBar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1102,
    height: 2,
  },
});
interface AppProps {
  pageProps: any;
  Component: NextComponentType;
}

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
  const cart = useSelector(state => state.cart);

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

  useEffect(() => {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (const registration of registrations) {
        if (registration.scope.includes('service-worker')) registration.unregister();
      }
    });
  }, []);

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

  const appProviderValue: AppContextValue = {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider value={appProviderValue}>
        {initialLoading && <InitialLoading />}
        {isProgressBarVisible && <LinearProgress color="secondary" className={classes.progressBar} />}

        <AuthProvider>
          <FirebaseProvider>
            <MessagingProvider>
              <GoogleLoginProvider>
                <FacebookLoginProvider>
                  <Sidebar handleOpenMenu={handleOpenMenu} isOpenMenu={isOpenMenu} />
                  <LayoutHandler>
                    <Component {...pageProps} />
                  </LayoutHandler>
                </FacebookLoginProvider>
              </GoogleLoginProvider>
            </MessagingProvider>
          </FirebaseProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
