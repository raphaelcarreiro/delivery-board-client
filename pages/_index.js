import React from 'react';
import Head from 'next/head';
import Menu from '../src/components/menu/Menu';

function IndexPage() {
  return (
    <>
      <Head>
        <title>Cardápio</title>
      </Head>
      <Menu />
    </>
  );
}

export default IndexPage;
