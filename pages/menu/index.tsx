import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import axios from 'axios';
import { Category } from 'src/types/category';
import { Typography } from '@material-ui/core';
import Categories from 'src/components/category/Categories';

interface MenuPageProps {
  categories: Category[];
  error?: string;
}

const MenuPage: React.FC<MenuPageProps> = ({ categories, error }) => {
  return (
    <>
      <Head>
        <title>Cardápio</title>
        <meta name="description" content="Cardápio do restaurante" />
      </Head>
      {error ? (
        <div>
          <Typography>{error}</Typography>
        </div>
      ) : (
        <Categories categories={categories} />
      )}
    </>
  );
};

export default MenuPage;

export const getStaticProps: GetStaticProps<MenuPageProps> = async () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      RestaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID,
    },
  });

  try {
    const response = await instance.get('/categories');
    const categories = response.data;

    return {
      props: {
        categories,
      },
      revalidate: 300,
    };
  } catch (err) {
    return {
      props: {
        error: 'Aconteceu um erro ao carregar as categorias',
        categories: [],
      },
    };
  }
};
