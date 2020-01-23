import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';
import Account from '../src/components/account/Account';
import { useSelector } from 'react-redux';
import { AppContext } from '../src/App';

function AccountPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const user = useSelector(state => state.user);
  const app = useContext(AppContext);

  useEffect(() => {
    const _auth = isAuthenticated();
    setAuth(_auth);
    if (!_auth) {
      router.push('/login');
      app.setRedirect('/account');
    }
  }, [user.id]);

  return (
    <>
      <Head>
        <title>Minha conta</title>
      </Head>
      {auth && <Account />}
    </>
  );
}

export default AccountPage;
