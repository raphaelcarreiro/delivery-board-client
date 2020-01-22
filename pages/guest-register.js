import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import GuestRegister from '../src/components/register/guest/GuestRegister';
import PropTypes from 'prop-types';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

GuestRegisterPage.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
};

function GuestRegisterPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(true);
  const restaurant = useSelector(state => state.restaurant) || {};

  useEffect(() => {
    if (restaurant.id) {
      const _auth = isAuthenticated();
      if (_auth) {
        router.push('/');
        return;
      }

      if (restaurant.configs.require_login) {
        router.push('/login');
        return;
      }
      setAuth(_auth);
    }
  }, [restaurant]);

  return (
    <>
      <Head>
        <title>Por favor se identifique</title>
      </Head>
      {!auth && <GuestRegister />}
    </>
  );
}

export default GuestRegisterPage;
