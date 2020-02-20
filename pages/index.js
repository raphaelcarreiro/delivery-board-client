import React from 'react';
import Head from 'next/head';
import Index from '../src/components/index/Index';
import axios from 'axios';
import PropTypes from 'prop-types';

IndexPage.propTypes = {
  restaurant: PropTypes.object.isRequired,
};

function IndexPage({ restaurant }) {
  return (
    <>
      <Head>
        <title>{restaurant.name}</title>
        <meta name="keywords" content={restaurant.keywords} />
        <meta name="description" content={restaurant.description} />

        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={restaurant.url} />
        <meta property="og:title" content={restaurant.title} />
        <meta property="og:site_name" content={restaurant.name} />
        <meta property="og:description" content={restaurant.description} />
        <meta property="og:image" content={restaurant.image.imageUrl} />
      </Head>
      <Index />
    </>
  );
}

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

export default IndexPage;
