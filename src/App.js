import React, { createContext, useState, useEffect } from 'react';
import { api } from './services/api';
import { useRouter } from 'next/router';
import Loading from './components/loading/Loading';
import Messaging from './components/messaging/Messaging';
import OnlyMain from './components/layout/OnlyMain';
import Default from './components/layout/Default';
import { mobileCheck } from './helpers/MobileCheck';
import { useDispatch, useSelector } from 'react-redux';
import { setRestaurant } from './store/redux/modules/restaurant/actions';
import PropTypes from 'prop-types';
import { setUser, removeUser } from './store/redux/modules/user/actions';
import { verifyToken } from './helpers/verifyToken';
import Sidebar from './components/sidebar/Sidebar';

export const AppContext = createContext({
  isMobile: false,
  windowWidth: null,
  isOpenMenu: false,
  handleLogout: () => {},
  handleOpenMenu: () => {},
});

export const menuWidth = 240;

function App({ pageProps, component: Component }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1500);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const appProviderValue = {
    handleLogout: handleLogout,
    handleOpenMenu: handleOpenMenu,
    isMobile,
    windowWidth,
    isOpenMenu,
  };

  // paginas que não precisam no cabeçalho e rodapé padrões
  const paths = ['/register', '/login'];

  useEffect(() => {
    const payload = verifyToken();
    if (payload)
      dispatch(
        setUser({
          loadedFromStorage: true,
          ...payload,
        })
      );

    window.addEventListener('resize', handleResize);

    setIsMobile(mobileCheck());
    setWindowWidth(window.innerWidth);

    api()
      .get('restaurants')
      .then(response => {
        dispatch(setRestaurant(response.data));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleLogout() {
    setLoading(true);

    api()
      .post('/logout')
      .then(response => {
        localStorage.removeItem(process.env.TOKEN_NAME);
        dispatch(removeUser());
        router.push('/');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleResize() {
    setIsMobile(mobileCheck());
    setWindowWidth(window.innerWidth);
  }

  function handleOpenMenu() {
    setIsOpenMenu(!isOpenMenu);
  }

  return (
    <AppContext.Provider value={appProviderValue}>
      {loading && <Loading background="#fafafa" />}

      <Sidebar handleLogout={handleLogout} handleOpenMenu={handleOpenMenu} isOpenMenu={isOpenMenu} />
      <Messaging>
        {paths.includes(router.route) ? (
          <OnlyMain pageProps={pageProps} component={Component} />
        ) : (
          <Default pageProps={pageProps} component={Component} isMobile={isMobile} windowWidth={windowWidth} />
        )}
      </Messaging>
    </AppContext.Provider>
  );
}

App.propTypes = {
  pageProps: PropTypes.object.isRequired,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};

export default App;
