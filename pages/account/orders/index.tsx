import React, { useEffect } from 'react';
import Head from 'next/head';
import Orders from 'src/components/account/orders/Orders';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/auth';
import { useApp } from 'src/App';

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuth();
  const { setRedirect } = useApp();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      setRedirect(`/account/orders`);
    }
  }, [router, isAuthenticated, checkAuth, setRedirect]);

  return (
    <>
      <Head>
        <title>Meus pedidos</title>
      </Head>
      {isAuthenticated && <Orders />}
    </>
  );
};

export default OrdersPage;
