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

export const AppContext = createContext({
  isMobile: false,
  windowWidth: null,
  handleLogout: () => {},
});

export const menuWidth = 240;

function App({ pageProps, component: Component }) {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1500);
  const [loading, setLoading] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const restaurant = useSelector(state => state.restaurant);

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

    setLoading(true);

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

  return (
    <AppContext.Provider
      value={{
        handleLogout: handleLogout,
        isMobile: isMobile,
        windowWidth: windowWidth,
      }}
    >
      {loading && <Loading background />}
      {!restaurant.id && <Loading background />}

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
