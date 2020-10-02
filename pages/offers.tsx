import React from 'react';
import Head from 'next/head';
import Offer from 'src/components/promotion/Offer';
import axios, { AxiosResponse } from 'axios';
import { moneyFormat } from 'src/helpers/numberFormat';
import { Product } from 'src/types/product';
import { GetServerSideProps } from 'next';

type OffersPageProps = {
  products: Product[];
};

const OffersPage: React.FC<OffersPageProps> = ({ products }) => {
  return (
    <>
      <Head>
        <title>Ofertas</title>
      </Head>
      <Offer products={products} />
    </>
  );
};

export default OffersPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      RestaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID,
    },
  });

  const response: AxiosResponse<Product[]> = await axiosInstance.get('/products');

  const products = response.data.map(product => {
    product.formattedPrice = moneyFormat(product.price);
    product.formattedSpecialPrice = moneyFormat(product.special_price);
    return product;
  });

  return {
    props: {
      products,
    },
  };
};
