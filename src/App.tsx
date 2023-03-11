import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setRestaurant, setRestaurantIsOpen } from './store/redux/modules/restaurant/actions';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { createTheme } from 'src/helpers/createTheme';
import { moneyFormat } from './helpers/numberFormat';
import { setPromotions } from './store/redux/modules/promotion/actions';
import { NextComponentType } from 'next';
import { useSelector } from './store/redux/selector';
import { LinearProgress } from '@material-ui/core';
import BottomNavigator from './components/sidebar/BottomNavigator';
import InitialLoading from './components/loading/InitialLoading';
import CssBaseline from '@material-ui/core/CssBaseline';
import defaultTheme from './theme';
import io from 'socket.io-client';
import reactGA from 'react-ga';
import MessagingProvider from './providers/MessageProvider';
import AuthProvider from './providers/AuthProvider';
import FirebaseProvider from './providers/FirebaseProvider';
import GoogleLoginProvider from './providers/GoogleProvider';
import FacebookLoginProvider from './providers/FacebookProvider';
import LayoutHandler from './components/layout/LayoutHandler';
import { AppProvider, AppContextValue } from './providers/AppProvider';
import { useWindowSize } from './hooks/windowSize';
import { Restaurant, RestaurantAddress } from './types/restaurant';
import { setRestaurantAddress } from './store/redux/modules/order/actions';
import { setCustomerAddresses } from './store/redux/modules/user/actions';
import LocationProvider from './providers/LocationProvider';

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
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const [readyToInstall, setReadyToInstall] = useState(false);
  const restaurant = useSelector(state => state.restaurant);
  const [shownPlayStoreBanner, setShownPlayStoreBanner] = useState(true);
  const windowSize = useWindowSize();
  const [dialogRestaurantAddress, setDialogRestaurantAddress] = useState(false);
  const order = useSelector(state => state.order);
  const user = useSelector(state => state.user);

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
    if (!user.id) return;

    if (!order.restaurant_address) return;

    localStorage.setItem('restaurantAddressId', order.restaurant_address.id.toString());

    api
      .post('/addressDistances', { restaurantAddressId: order.restaurant_address.id })
      .then(response => {
        const customerAddresses = response.data;
        dispatch(setCustomerAddresses(customerAddresses));
      })
      .catch(err => console.error(err));
  }, [dispatch, order.restaurant_address, user.id]);

  useEffect(() => {
    api
      .get<Restaurant>('/restaurants')
      .then(response => {
        const _restaurant = response.data;
        const { configs } = _restaurant;
        let restaurantAddress: RestaurantAddress | undefined;

        if (configs.restaurant_address_selection) setDialogRestaurantAddress(true);

        const restaurantAddressId = localStorage.getItem('restaurantAddressId');

        if (restaurantAddressId) {
          restaurantAddress = _restaurant.addresses.find(address => address.id === parseInt(restaurantAddressId));
          if (!restaurantAddress) restaurantAddress = _restaurant.addresses.find(address => address.is_main);
        } else restaurantAddress = _restaurant.addresses.find(address => address.is_main);

        if (restaurantAddress) {
          dispatch(setRestaurantAddress(restaurantAddress));
          localStorage.setItem('restaurantAddressId', restaurantAddress.id.toString());
        }

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
        setInitialLoading(false);
        document.body.classList.add('zoom');
      });
  }, [dispatch]);

  useEffect(() => {
    if (!restaurant) return;
    api
      .get('/promotions')
      .then(response => {
        dispatch(setPromotions(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  }, [dispatch, restaurant]);

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

  const appProviderValue: AppContextValue = {
    isMobile: windowSize.isMobile,
    windowWidth: windowSize.width,
    windowHeight: windowSize.height,
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
    handleShowPlayStoreBanner,
    setDialogRestaurantAddress,
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
                  <BottomNavigator />
                  <LocationProvider>
                    <LayoutHandler>
                      <Component {...pageProps} />
                    </LayoutHandler>
                  </LocationProvider>
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
