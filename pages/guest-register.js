import React from 'react';
import Head from 'next/head';
import GuestRegister from '../src/components/register/guest/GuestRegister';
import PropTypes from 'prop-types';

GuestRegisterPage.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
};

function GuestRegisterPage() {
  return (
    <>
      <Head>
        <title>Por favor se identifique</title>
      </Head>
      <GuestRegister />
    </>
  );
}

export default GuestRegisterPage;
