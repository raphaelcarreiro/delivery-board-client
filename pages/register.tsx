import React from 'react';
import Head from 'next/head';
import Register from 'src/components/register/Register';
import { GetServerSideProps, NextPage } from 'next';

type RegisterPageProps = {
  name: string;
  email: string;
  phone: string;
};

const RegisterPage: NextPage<RegisterPageProps> = ({ name, email, phone }) => {
  return (
    <>
      <Head>
        <title>Faça seu cadastro agora</title>
      </Head>
      <Register name={name} email={email} phone={phone} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<RegisterPageProps> = async ({ query }) => {
  const { email, name, phone } = query;
  return {
    props: {
      email: email ? String(email) : '',
      name: name ? String(name) : '',
      phone: phone ? String(phone) : '',
    },
  };
};

export default RegisterPage;
