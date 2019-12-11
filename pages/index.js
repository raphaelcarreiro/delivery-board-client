import React from 'react';
import Head from 'next/head';
import Index from '../src/components/index/Index';
import axios from 'axios';

function IndexPage({ restaurant }) {
  return (
    <>
      <Head>
        <title>{restaurant.name}</title>
      </Head>
      <Index />
    </>
  );
}

IndexPage.getInitialProps = async () => {
  const instance = axios.create({
    baseURL: process.env.BASEURL_API,
    headers: {
      RestaurantId: process.env.RESTAURANT_ID,
    },
  });

  const response = await instance.get('/restaurants');

  return { restaurant: response.data };
};

export default IndexPage;
