import React from 'react';
import Head from 'next/head';
import Orders from '../../src/components/account/orders/Orders';

export default function OrdersPage() {
  return (
    <>
      <Head>
        <title>Meus pedidos</title>
      </Head>
      <Orders />
    </>
  );
}
