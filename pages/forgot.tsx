import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Forgot from 'src/components/forgot/Forgot';

const PasswordRequestPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Redefinir senha</title>
        <meta name="description" content="Redefinição da senha" />
      </Head>
      <Forgot />;
    </>
  );
};

export default PasswordRequestPage;
