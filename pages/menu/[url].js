import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Product from '../../src/components/menu/product/Product';
import { moneyFormat } from '../../src/helpers/numberFormat';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

Category.propTypes = {
  category: PropTypes.object.isRequired,
  error: PropTypes.string,
};

export default function Category({ category, error }) {
  const classes = useStyles();
  return (
    <>
      {error ? (
        <div className={classes.container}>
          <Typography variant="h5" color="textSecondary">
            {error}
          </Typography>
        </div>
      ) : (
        <>
          <Head>
            <title>{category.name}</title>
            <meta name="description" content={category.name} />
            <meta name="keywords" content={category.keywords} />
            <meta property="og:locale" content="pt_BR" />
            <meta property="og:url" content={`${category.restaurant.url}/menu/${category.url}`} />
            <meta property="og:title" content={category.name} />
            <meta property="og:site_name" content={category.restaurant.name} />
            <meta property="og:description" content={category.description} />
            <meta property="og:image" content={category.image.imageUrl} />
          </Head>
          <Product products={category.products} categoryName={category.name} categoryUrl={category.url} />
        </>
      )}
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

  try {
    const response = await axiosInstance.get(`/categories/${query.url}`);
    const products = response.data.products.map(product => {
      product.formattedPrice = moneyFormat(product.price);
      product.formattedSpecialPrice = moneyFormat(product.special_price);
      return product;
    });

    const category = {
      ...response.data,
      products,
    };

    return {
      category,
    };
  } catch (err) {
    if (err.response.status === 404)
      return {
        error: '404 - Página não encontrada',
      };
    else
      return {
        error: 'Aconteceu um erro ao carregar a página',
      };
  }
};
