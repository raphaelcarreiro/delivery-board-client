import React from 'react';
import PasswordReset from '../../src/components/password-reset/PasswordReset';
import Head from 'next/head';
import PropTypes from 'prop-types';

PasswordResetPage.propTypes = {
  token: PropTypes.string.isRequired,
};

export default function PasswordResetPage({ token }) {
  return (
    <>
      <Head>
        <title>Nova senha</title>
      </Head>
      <PasswordReset token={token} />
    </>
  );
}

PasswordResetPage.getInitialProps = async ({ query }) => {
  return {
    token: query.token,
  };
};
