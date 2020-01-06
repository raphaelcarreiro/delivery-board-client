import React from 'react';
import Head from 'next/head';
import Login from '../src/components/login/Login';

function LoginPage() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Login />
    </>
  );
}

export default LoginPage;
