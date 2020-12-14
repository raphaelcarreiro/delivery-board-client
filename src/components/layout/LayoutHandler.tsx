import { useRouter } from 'next/router';
import React from 'react';
import CheckoutLayout from './CheckoutLayout';
import DefaultLayout from './DefaultLayout';
import AuthLayout from './AuthLayout';
import IndexLayout from './IndexLayout';

const authPaths = [
  '/register',
  '/login',
  '/login/email',
  '/guest-register',
  '/password-request',
  '/password-reset/[token]',
];

const checkoutPaths = ['/checkout'];

const indexPath = ['/'];

const LayoutHandler: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <>
      {authPaths.includes(router.route) ? (
        <AuthLayout>{children}</AuthLayout>
      ) : checkoutPaths.includes(router.route) ? (
        <CheckoutLayout>{children}</CheckoutLayout>
      ) : indexPath.includes(router.route) ? (
        <IndexLayout>{children}</IndexLayout>
      ) : (
        <DefaultLayout>{children}</DefaultLayout>
      )}
    </>
  );
};

export default LayoutHandler;
