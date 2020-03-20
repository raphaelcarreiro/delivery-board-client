import React from 'react';
import Head from 'next/head';
import Contact from '../src/components/contact/Contact';

function ContactPage() {
  return (
    <>
      <Head>
        <title>Contato</title>
      </Head>
      <Contact />
    </>
  );
}

export default ContactPage;
