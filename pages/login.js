import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Login from '../src/components/login/Login';
import { isAuthenticated } from '../src/services/auth';
import { useRouter } from 'next/router';

function LoginPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(true);

  useEffect(() => {
    const _auth = isAuthenticated();
    if (_auth) {
      router.push('/');
      return;
    }
    setAuth(_auth);
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
      </Head>
      {!auth && <Login />}
    </>
  );
}

export default LoginPage;
