import React, { useEffect } from 'react';
import Head from 'next/head';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';
import Checkout from '../src/components/checkout/Checkout';

function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login?redirect=/checkout');
  }, []);

  return (
    <>
      <Head>
        <title>Fechar pedido</title>
      </Head>
      <Checkout />
    </>
  );
}

export default CheckoutPage;
