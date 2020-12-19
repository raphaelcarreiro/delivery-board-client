import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Account from 'src/components/account/Account';
import { useAuth } from 'src/hooks/auth';
import { NextPage } from 'next';
import { useApp } from 'src/hooks/app';

const AccountPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuth();
  const { setRedirect } = useApp();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      setRedirect(`/account`);
    }
  }, [isAuthenticated, checkAuth, setRedirect, router]);

  return (
    <>
      <Head>
        <title>Minha conta</title>
      </Head>
      {isAuthenticated && <Account />}
    </>
  );
};

export default AccountPage;
