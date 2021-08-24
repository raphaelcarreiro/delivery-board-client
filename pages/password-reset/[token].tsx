import React from 'react';
import PasswordReset from 'src/components/forgot-email/PasswordReset';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

type PasswordResetPageProps = {
  token: string;
};

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ token }) => {
  return (
    <>
      <Head>
        <title>Nova senha</title>
      </Head>
      <PasswordReset token={token} />
    </>
  );
};

export default PasswordResetPage;

export const getServerSideProps: GetServerSideProps<PasswordResetPageProps> = async ({ query }) => {
  return {
    props: {
      token: query.token ? String(query.token) : '',
    },
  };
};
