import React, { useEffect } from 'react';
import Head from 'next/head';
import Login from 'src/components/login/Login';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useSelector } from 'src/store/redux/selector';
import { useAuth } from 'src/hooks/auth';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { checkAuth, isAuthenticated } = useAuth();
  const restaurant = useSelector(state => state.restaurant);

  useEffect(() => {
    if (!restaurant) return;
    if (checkAuth()) {
      // router.push('/');
      return;
    }

    if (!restaurant.configs.require_login) router.push('/guest-register');
  }, [restaurant, router, checkAuth, isAuthenticated]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      {!isAuthenticated && <Login />}
    </>
  );
};

export default LoginPage;
