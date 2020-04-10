import React from 'react';
import Head from 'next/head';
import Offer from '../src/components/promotion/Offer';
import axios from 'axios';
import { moneyFormat } from '../src/helpers/numberFormat';
import PropTypes from 'prop-types';

OffersPage.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function OffersPage({ products }) {
  return (
    <>
      <Head>
        <title>Promoções</title>
      </Head>
      <Offer products={products} />
    </>
  );
}

OffersPage.getInitialProps = async ({ query }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.BASEURL_API,
    headers: {
      RestaurantId: process.env.RESTAURANT_ID,
    },
  });

  const response = await axiosInstance.get('/products');

  const products = response.data.map(product => {
    product.formattedPrice = moneyFormat(product.price);
    product.formattedSpecialPrice = moneyFormat(product.special_price);
    return product;
  });

  return {
    products,
  };
};
