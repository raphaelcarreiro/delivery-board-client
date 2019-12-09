import React from 'react';
import Head from 'next/head';
import { Register } from '../src/components/register/Register';

function RegisterPage() {
  return (
    <>
      <Head>
        <title>Faça seu cadastro agora</title>
      </Head>
      <Register />
    </>
  );
}

export default RegisterPage;
