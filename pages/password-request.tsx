import React from 'react';
import PasswordRequest from 'src/components/password-reset/PasswordRequest';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';

type PasswordRequestPageProps = {
  user?: string;
};

const PasswordRequestPage: NextPage<PasswordRequestPageProps> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Solitar nova senha</title>
      </Head>
      <PasswordRequest user={user} />;
    </>
  );
};

export default PasswordRequestPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { user } = query;

  return {
    props: {
      user: user ? String(user) : '',
    },
  };
};
