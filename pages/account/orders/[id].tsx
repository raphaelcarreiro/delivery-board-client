import React, { useEffect } from 'react';
import Head from 'next/head';
import Order from 'src/components/account/orders/order/Order';
import { useRouter } from 'next/router';
import { useApp } from 'src/App';
import { useAuth } from 'src/hooks/auth';
import { GetServerSideProps } from 'next';

type OrderPageProps = {
  cryptId: string;
};

const OrderPage: React.FC<OrderPageProps> = ({ cryptId }) => {
  const router = useRouter();
  const { checkAuth, isAuthenticated } = useAuth();
  const { setRedirect } = useApp();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      setRedirect(`/account/orders/${cryptId}`);
    }
  }, [cryptId, router, setRedirect, isAuthenticated, checkAuth]);

  return (
    <>
      <Head>
        <title>Meus pedidos</title>
      </Head>
      {isAuthenticated && <Order cryptId={cryptId} />}
    </>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps<OrderPageProps> = async ({ query }) => {
  return {
    props: {
      cryptId: query.id ? String(query.id) : '',
    },
  };
};
