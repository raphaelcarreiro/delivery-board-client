import React from 'react';
import Head from 'next/head';
import Index from '../src/components/index/Index';
// import axios from 'axios';

function IndexPage() {
  return (
    <>
      <Head>
        <title>Delivery X</title>
      </Head>
      <Index />
    </>
  );
}

/*
IndexPage.getInitialProps = async ctx => {
  const axiosInstance = axios.create({
    baseURL: process.env.BASEURL_API,
    headers: {
      RestaurantId: process.env.RESTAURANT_ID,
    },
  });

  const response = await axiosInstance.get('/restaurants');

  return { restaurant: response.data };
};
*/

export default IndexPage;
