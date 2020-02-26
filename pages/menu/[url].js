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
        <meta name="description" content={category.name} />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={process.env.PUBLIC_URL + '/menu/' + category.url} />
        <meta property="og:title" content={category.name} />
        <meta property="og:site_name" content={category.restaurant.name} />
        <meta property="og:description" content="Categoria do cardápio" />
        <meta property="og:image" content={category.image.imageUrl} />
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

  if (!response.data.activated) {
    const category = {
      ...response.data,
      products: [],
    };

    return {
      category,
    };
  }

  const products = response.data.products
    .filter(product => product.activated)
    .map(product => {
      product.formattedPrice = moneyFormat(product.price);
      return product;
    });

  console.log(products);

  const category = {
    ...response.data,
    products,
  };

  return {
    category,
  };
};
