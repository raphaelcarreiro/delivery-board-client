import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Login from '../src/components/login/Login';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

function LoginPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(true);
  const restaurant = useSelector(state => state.restaurant) || {};

  useEffect(() => {
    if (restaurant.id) {
      const _auth = isAuthenticated();
      if (_auth) {
        router.push('/');
        return;
      }

      if (!restaurant.configs.require_login) {
        router.push('/guest-register');
        return;
      }

      setAuth(_auth);
    }
  }, [restaurant]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      {!auth && <Login />}
    </>
  );
}

export default LoginPage;
