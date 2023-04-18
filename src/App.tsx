import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { NextComponentType } from 'next';
import { useSelector } from './store/redux/selector';
import { LinearProgress } from '@material-ui/core';
import BottomNavigator from './components/sidebar/BottomNavigator';
import InitialLoading from './components/loading/InitialLoading';
import CssBaseline from '@material-ui/core/CssBaseline';
import reactGA from 'react-ga';
import MessagingProvider from './providers/MessageProvider';
import AuthProvider from './providers/AuthProvider';
import FirebaseProvider from './providers/FirebaseProvider';
import GoogleLoginProvider from './providers/GoogleProvider';
import FacebookLoginProvider from './providers/FacebookProvider';
import LayoutHandler from './components/layout/LayoutHandler';
import { AppProvider, AppContextValue } from './providers/AppProvider';
import { useWindowSize } from './hooks/windowSize';
import LocationProvider from './providers/LocationProvider';
import { useFetchBoardMovement } from './hooks/useFetchBoardMovement';
import { useBoardControlSocket } from './hooks/useBoardControlSocket';
import io, { Socket } from 'socket.io-client';
import { useFetchPromotions } from './hooks/useFetchPromotions';
import { useAppSocket } from './hooks/useAppSocket';
import { useFecthRestaurant } from './hooks/useFetchRestaurant';

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

export const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET + '/client');
let defferedPromptPwa;

const App: React.FC<AppProps> = ({ pageProps, Component }) => {
  const classes = useStyles({});
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  const [readyToInstall, setReadyToInstall] = useState(false);
  const restaurant = useSelector(state => state.restaurant);
  const [shownPlayStoreBanner, setShownPlayStoreBanner] = useState(true);
  const [theme, initialLoading] = useFecthRestaurant();
  const [socket] = useAppSocket();
  const [isBoardMovementLoading] = useFetchBoardMovement(router.query.session as string | undefined);
  const [isSocketBoardConnected] = useBoardControlSocket(router.query.session as string | undefined);
  const windowSize = useWindowSize();

  useFetchPromotions();

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
    isBoardMovementLoading,
    isSocketBoardConnected,
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
