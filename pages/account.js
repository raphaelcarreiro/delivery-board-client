import React, { useEffect } from 'react';
import Head from 'next/head';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';
import { Account } from '../src/components/account/Account';

function AccountPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, []);

  return (
    <>
      <Head>
        <title>Minha conta</title>
      </Head>
      <Account />
    </>
  );
}

export default AccountPage;
