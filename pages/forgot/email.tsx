import React from 'react';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import PasswordRequest from 'src/components/forgot-email/PasswordRequest';

type ForgotEmailPageProps = {
  email: string | null;
};

const ForgotEmailPage: NextPage<ForgotEmailPageProps> = ({ email }) => {
  return (
    <>
      <Head>
        <title>Redefinir senha</title>
        <meta name="description" content="Redefinição da senha" />
      </Head>
      <PasswordRequest emailProp={email || undefined} />
    </>
  );
};

export default ForgotEmailPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { email } = query;

  return {
    props: {
      email: email ? String(email) : null,
    },
  };
};
