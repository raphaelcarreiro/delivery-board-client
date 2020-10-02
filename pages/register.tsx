import React from 'react';
import Head from 'next/head';
import { Register } from 'src/components/register/Register';
import { GetServerSideProps, NextPage } from 'next';

type RegisterPageProps = {
  name: string;
  email: string;
};

const RegisterPage: NextPage<RegisterPageProps> = ({ name, email }) => {
  return (
    <>
      <Head>
        <title>Faça seu cadastro agora</title>
      </Head>
      <Register name={name} email={email} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<RegisterPageProps> = async ({ query }) => {
  const { email, name } = query;
  return {
    props: {
      email: email ? String(email) : '',
      name: name ? String(name) : '',
    },
  };
};

export default RegisterPage;
