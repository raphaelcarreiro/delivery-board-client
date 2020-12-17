import React from 'react';
import axios, { AxiosResponse } from 'axios';
import Head from 'next/head';
import Product from 'src/components/menu/product/Product';
import { moneyFormat } from 'src/helpers/numberFormat';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Category as CategoryType } from 'src/types/category';
import InitialLoading from 'src/components/loading/InitialLoading';
import { useRouter } from 'next/router';
import Products from 'src/components/products/Product';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

type CategoryPageProps = {
  category?: CategoryType;
  error?: string;
};

const CategoryPage: NextPage<CategoryPageProps> = ({ category, error }) => {
  const classes = useStyles();
  const router = useRouter();

  if (router.isFallback) {
    return <InitialLoading />;
  }

  return (
    <>
      {error ? (
        <div className={classes.container}>
          <Typography variant="h5" color="textSecondary">
            {error}
          </Typography>
        </div>
      ) : (
        category && (
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
            <Products products={category.products} categoryName={category.name} categoryUrl={category.url} />
          </>
        )
      )}
    </>
  );
};

export default CategoryPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
  });

  try {
    const response = await instance.get<CategoryType[]>('/categories');
    const paths = response.data.map(category => ({
      params: {
        categoryUrl: category.url,
      },
    }));

    return {
      paths,
      fallback: true,
    };
  } catch (err) {
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      RestaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID,
    },
  });

  try {
    const response = await axiosInstance.get<CategoryType, AxiosResponse<CategoryType>>(`/categories/${params?.url}`);
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
      props: {
        category,
      },
      revalidate: 180,
    };
  } catch (err) {
    if (err.response)
      return {
        props: {
          error: err.response.status === 404 ? '404 - Página não encontrada' : 'Aconteceu um erro ao carregar a página',
        },
      };

    return {
      props: {
        error: 'Aconteceu um erro ao carregar a página',
      },
    };
  }
};
