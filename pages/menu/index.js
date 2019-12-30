import React from 'react';
import Head from 'next/head';
import Menu from '../../src/components/menu/Menu';

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
