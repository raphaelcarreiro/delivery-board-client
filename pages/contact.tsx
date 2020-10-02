import React from 'react';
import Head from 'next/head';
import Contact from 'src/components/contact/Contact';
import { NextPage } from 'next';

const ContactPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contato</title>
      </Head>
      <Contact />
    </>
  );
};

export default ContactPage;
