import React from 'react';
import Head from 'next/head';
import LoginEmail from '../../src/components/login/LoginEmail';

function LoginPage() {
  return (
    <>
      <Head>
        <title>Entrar com e-mail</title>
      </Head>
      <LoginEmail />
    </>
  );
}

export default LoginPage;
