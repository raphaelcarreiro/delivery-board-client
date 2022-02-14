import React, { useEffect } from 'react';
import Head from 'next/head';
import Order from 'src/components/account/orders/order/Order';
import { useRouter } from 'next/router';
import { useAuth } from 'src/providers/AuthProvider';
import { GetServerSideProps } from 'next';
import { useApp } from 'src/providers/AppProvider';

type OrderPageProps = {
  uuid: string;
};

const OrderPage: React.FC<OrderPageProps> = ({ uuid }) => {
  const router = useRouter();
  const { checkAuth, isAuthenticated } = useAuth();
  const { setRedirect } = useApp();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      setRedirect(`/account/orders/${uuid}`);
    }
  }, [uuid, router, setRedirect, isAuthenticated, checkAuth]);

  return (
    <>
      <Head>
        <title>Meus pedidos</title>
      </Head>
      {isAuthenticated && <Order uuid={uuid} />}
    </>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps<OrderPageProps> = async ({ query }) => {
  return {
    props: {
      uuid: query.id ? String(query.id) : '',
    },
  };
};
