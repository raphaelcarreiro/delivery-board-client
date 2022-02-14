import React, { useEffect } from 'react';
import Head from 'next/head';
import GuestRegister from 'src/components/register/guest/GuestRegister';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useSelector } from 'src/store/redux/selector';
import { useAuth } from 'src/providers/AuthProvider';

const GuestRegisterPage: NextPage = () => {
  const router = useRouter();
  const { checkAuth, isAuthenticated } = useAuth();
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    if (!restaurant) return;
    if (checkAuth()) {
      router.push('/');
      return;
    }

    if (restaurant.configs.require_login) router.push('/login');
  }, [restaurant, router, checkAuth, isAuthenticated]);

  return (
    <>
      <Head>
        <title>Por favor se identifique</title>
      </Head>
      {!isAuthenticated && <GuestRegister />}
    </>
  );
};

export default GuestRegisterPage;
