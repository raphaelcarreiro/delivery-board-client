import Head from 'next/head';
import React, { FC } from 'react';
import Board from 'src/components/board/Board';

const BoardPage: FC = () => {
  return (
    <>
      <Head>
        <title>Mesa</title>
      </Head>
      <Board />
    </>
  );
};

export default BoardPage;
