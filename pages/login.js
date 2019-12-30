import React, { useEffect } from 'react';
import Head from 'next/head';
import Login from '../src/components/login/Login';

function LoginPage() {
  useEffect(() => {
    window.fbAsyncInit = () =>
      FB.init({
        appId: '588242751734818',
        cookie: true,
        xfbml: true,
        version: 'v5.0',
      });
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
        <script async defer src="https://connect.facebook.net/pt_BR/sdk.js" />
      </Head>
      <Login />
    </>
  );
}

export default LoginPage;
