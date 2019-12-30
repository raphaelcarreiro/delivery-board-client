import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';
import Checkout from '../src/components/checkout/Checkout';
import { AppContext } from '../src/App';

function CheckoutPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const app = useContext(AppContext);

  useEffect(() => {
    const _auth = isAuthenticated();
    if (!_auth) {
      router.push('/login');
      app.setRedirect('/checkout');
      return;
    }
    setAuth(_auth);
  }, []);

  return (
    <>
      <Head>
        <title>Fechar pedido</title>
      </Head>
      {auth && <Checkout />}
    </>
  );
}

export default CheckoutPage;
