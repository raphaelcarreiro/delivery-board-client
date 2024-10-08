import React from 'react';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import { Category } from 'src/types/category';
import { Typography } from '@material-ui/core';
import Categories from 'src/components/category/Categories';
import { Restaurant } from 'src/types/restaurant';

interface MenuPageProps {
  categories: Category[];
  restaurant?: Restaurant;
  error?: string;
}

const MenuPage: NextPage<MenuPageProps> = ({ categories, error, restaurant }) => {
  if (error)
    return (
      <>
        <Head>
          <title>Erro ao carregar o cardápio</title>
        </Head>
        <div>
          <Typography>{error}</Typography>
        </div>
      </>
    );

  const title = `${restaurant?.name} - Cardápio - ${restaurant?.description}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${restaurant?.name} - cardápio - ${restaurant?.description}`} />
      </Head>

      <Categories categories={categories} />
    </>
  );
};

export default MenuPage;

export const getServerSideProps: GetServerSideProps<MenuPageProps> = async () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      'x-restaurant-id': process.env.NEXT_PUBLIC_RESTAURANT_UUID,
    },
  });

  try {
    const response = await instance.get<Category[]>('/categories');
    const categories = response.data;

    const restaurantResponse = await instance.get<Restaurant>('/restaurants');
    const restaurant = restaurantResponse.data;

    return {
      props: {
        categories,
        restaurant,
      },
    };
  } catch (err) {
    return {
      props: {
        error: 'Aconteceu um erro ao carregar as categorias' + (err as any).message,
        categories: [],
      },
    };
  }
};
