import React from 'react';
import Head from 'next/head';
import LoginEmail from '../../src/components/login/LoginEmail';
import PropTypes from 'prop-types';

LoginPage.propTypes = {
  email: PropTypes.string,
  phone: PropTypes.string,
};

function LoginPage({ email, phone }) {
  return (
    <>
      <Head>
        <title>Entrar com e-mail</title>
      </Head>
      <LoginEmail emailParam={email} phoneParam={phone} />
    </>
  );
}

LoginPage.getInitialProps = ({ query }) => {
  const { email, phone } = query;
  return {
    email,
    phone,
  };
};

export default LoginPage;
