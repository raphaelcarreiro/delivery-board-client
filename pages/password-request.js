import React from 'react';
import PasswordRequest from '../src/components/password-reset/PasswordRequest';
import Head from 'next/head';

export default function PasswordRequestPage() {
  return (
    <>
      <Head>
        <title>Solitar nova senha</title>
      </Head>
      <PasswordRequest />;
    </>
  );
}
