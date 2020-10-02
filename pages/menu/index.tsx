import React from 'react';
import Head from 'next/head';
import Menu from 'src/components/menu/Menu';

const MenuPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Cardápio</title>
        <meta name="description" content="Cardápio do restaurante" />
      </Head>
      <Menu />
    </>
  );
};

export default MenuPage;
