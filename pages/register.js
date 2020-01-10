import React from 'react';
import Head from 'next/head';
import { Register } from '../src/components/register/Register';
import PropTypes from 'prop-types';

RegisterPage.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
};

function RegisterPage({ name, email }) {
  return (
    <>
      <Head>
        <title>Faça seu cadastro agora</title>
      </Head>
      <Register name={name} email={email} />
    </>
  );
}

RegisterPage.getInitialProps = ({ query }) => {
  const { email, name } = query;
  return {
    email,
    name,
  };
};

export default RegisterPage;
