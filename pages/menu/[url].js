import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import PropTypes from 'prop-types';
import Head from 'next/head';
import PageHeader from '../../src/components/pageHeader/PageHeader';
import Product from '../../src/components/menu/product/Product';
import { moneyFormat } from '../../src/helpers/numberFormat';

const useStyles = makeStyles({
  container: {},
});

Category.propTypes = {
  category: PropTypes.object.isRequired,
};

export default function Category({ category }) {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>{category.name}</title>
      </Head>
      <PageHeader title={category.name} />
      <Product products={category.products} categoryName={category.name} />
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

  console.log(query);

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
