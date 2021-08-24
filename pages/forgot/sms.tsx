import React from 'react';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import Forgot from 'src/components/forgot/Forgot';

type ForgotSmsPageProps = {
  phone: string | null;
};

const ForgotSmsPage: NextPage<ForgotSmsPageProps> = ({ phone }) => {
  return (
    <>
      <Head>
        <title>Redefinir senha</title>
        <meta name="description" content="Redefinição da senha" />
      </Head>
      <Forgot phoneProp={phone} />
    </>
  );
};

export default ForgotSmsPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { phone } = query;

  return {
    props: {
      phone: phone ? String(phone) : null,
    },
  };
};
