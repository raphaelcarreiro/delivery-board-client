import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Order from '../../../src/components/account/orders/Order';
import { formatId } from '../../../src/helpers/formatOrderId';

Category.propTypes = {
  order: PropTypes.object.isRequired,
};

export default function Category({ order }) {
  return (
    <>
      <Head>
        <title>{order.id}</title>
      </Head>
      <Order order={order} />
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

  const response = await axiosInstance.get(`/order/${query.id}`);

  return {
    order: {
      ...response.data,
      formattedId: formatId(response.data.id),
    },
  };
};
