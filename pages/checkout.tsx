import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Checkout from 'src/components/checkout/Checkout';
import CartClosedRestaurant from 'src/components/cart/CartClosedRestaurant';
import { NextPage } from 'next';
import { useAuth } from 'src/hooks/auth';
import { useSelector } from 'src/store/redux/selector';
import { useApp } from 'src/hooks/app';

const CheckoutPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuth();
  const { setRedirect } = useApp();
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    if (!restaurant) return;

    if (!restaurant.is_open) return;

    if (!checkAuth()) {
      if (restaurant.configs.require_login) {
        router.push('/login');
        setRedirect(`/checkout`);
        return;
      }

      router.push('/guest-register');
      setRedirect(`/checkout`);
    }
  }, [restaurant, router, checkAuth, isAuthenticated, setRedirect]);

  function handleExitModal() {
    router.push('/');
  }

  return (
    <>
      <Head>
        <title>Fechar pedido</title>
      </Head>
      {!restaurant?.is_open && <CartClosedRestaurant onExited={handleExitModal} />}
      {isAuthenticated && restaurant?.is_open && <Checkout />}
    </>
  );
};

export default CheckoutPage;
