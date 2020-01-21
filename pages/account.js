import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';
import Account from '../src/components/account/Account';

function AccountPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const _auth = isAuthenticated();
    if (!_auth) {
      router.push('/login?redirect=/account');
      return false;
    }
    setAuth(_auth);
  }, []);

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
