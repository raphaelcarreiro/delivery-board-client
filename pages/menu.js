import React from 'react';
import Menu from '../src/components/menu/Menu';
import Head from 'next/head';

export default function MenuPage() {
  return (
    <>
      <Head>
        <title>Cardápio</title>
      </Head>
      <Menu />
    </>
  );
}
