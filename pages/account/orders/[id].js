import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Order from '../../../src/components/account/orders/Order';
import { isAuthenticated } from '../../../src/services/auth';
import { useRouter } from 'next/router';
import { AppContext } from '../../../src/App';

OrderPage.propTypes = {
  cryptId: PropTypes.string.isRequired,
};

export default function OrderPage({ cryptId }) {
  const [auth, setAuth] = useState(false);
  const app = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    const _auth = isAuthenticated();
    setAuth(_auth);

    if (!_auth) {
      router.push('/login');
      app.setRedirect(`/account/orders/${cryptId}`);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Carregando...</title>
      </Head>
      {auth && <Order cryptId={cryptId} />}
    </>
  );
}

OrderPage.getInitialProps = async ({ query }) => {
  return {
    cryptId: query.id,
  };
};
