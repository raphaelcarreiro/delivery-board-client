import React from 'react';
import PasswordRequest from 'src/components/password-reset/PasswordRequest';
import Head from 'next/head';
import { NextPage } from 'next';

const PasswordRequestPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Solitar nova senha</title>
      </Head>
      <PasswordRequest />;
    </>
  );
};

export default PasswordRequestPage;
