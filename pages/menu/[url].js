import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Product from '../../src/components/menu/product/Product';
import { moneyFormat } from '../../src/helpers/numberFormat';

Category.propTypes = {
  category: PropTypes.object.isRequired,
};

export default function Category({ category }) {
  return (
    <>
      <Head>
        <title>{category.name}</title>
      </Head>
      <Product products={category.products} categoryName={category.name} categoryUrl={category.url} />
    </>
  );
}

Category.getInitialProps = async ({ query }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.BASEURL_API,
    headers: {
      RestaurantId: process.env.RESTAURANT_ID,
    },
  });

  const response = await axiosInstance.get(`/categories/${query.url}`);

  const products = response.data.products.map(product => {
    product.formattedPrice = moneyFormat(product.price);
    return product;
  });

  const category = {
    ...response.data,
    products,
  };

  return {
    category: category,
  };
};
