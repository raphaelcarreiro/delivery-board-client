import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Account from 'src/components/account/Account';
import { useAuth } from 'src/providers/AuthProvider';
import { NextPage } from 'next';
import { useApp } from 'src/providers/AppProvider';

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
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places,geometry`}
        />
      </Head>
      {isAuthenticated && <Account />}
    </>
  );
};

export default AccountPage;
