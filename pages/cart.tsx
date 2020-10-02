import React from 'react';
import Head from 'next/head';
import Cart from 'src/components/cart/Cart';
import { NextPage } from 'next';

const CartPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Carrinho</title>
      </Head>
      <Cart />
    </>
  );
};

export default CartPage;
