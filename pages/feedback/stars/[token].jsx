import Head from 'next/head';

import CafeFeedbackFlow from '@/modules/cafeFeedback/CafeFeedbackFlow';
import { createCafeFeedbackServerSideProps } from '@/modules/cafeFeedback/cafeFeedbackPage';

export default function CafeFeedbackStarsPage({ token, uiVariant }) {
  return (
    <>
      <Head>
        <title>Оценка чистоты кафе — Жако</title>
        <meta content="noindex,nofollow" name="robots" />
      </Head>
      <CafeFeedbackFlow token={token} uiVariant={uiVariant} />
    </>
  );
}

export const getServerSideProps = createCafeFeedbackServerSideProps('stars');
