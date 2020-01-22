import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';
import Checkout from '../src/components/checkout/Checkout';
import { AppContext } from '../src/App';
import { useSelector } from 'react-redux';
import CartClosedRestaurant from 'src/components/cart/CartClosedRestaurant';

function CheckoutPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const app = useContext(AppContext);
  const user = useSelector(state => state.user);
  const restaurant = useSelector(state => state.restaurant) || {};

  useEffect(() => {
    if (restaurant.is_open) {
      const _auth = isAuthenticated();
      if (!_auth) {
        setAuth(_auth);
        if (restaurant.configs.require_login) {
          router.push('/login');
          app.setRedirect('/checkout');
          return;
        }
        router.push('/guest-register');
        app.setRedirect('/checkout');
        return;
      }
      setAuth(_auth);
    }
  }, [user, restaurant]);

  function handleExitModal() {
    router.push('/');
  }

  return (
    <>
      <Head>
        <title>Fechar pedido</title>
      </Head>
      {!restaurant.is_open && <CartClosedRestaurant onExited={handleExitModal} />}
      {auth && <Checkout />}
    </>
  );
}

export default CheckoutPage;
