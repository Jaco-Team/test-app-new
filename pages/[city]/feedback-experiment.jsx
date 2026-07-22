import Head from 'next/head';

import FeedbackExperience from '@/modules/clientFeedback/FeedbackExperience';
import { roboto } from '@/ui/Font';
import { normalizeCity } from '@/utils/normalizeCity';

function envFlag(value, fallback = false) {
  if (typeof value !== 'string') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export default function FeedbackExperimentPage({ orderId, pointId, useMocks }) {
  return (
    <div className={roboto.variable}>
      <Head>
        <title>Экспериментальная форма отзыва — Жако</title>
        <meta content="noindex,nofollow" name="robots" />
      </Head>
      <FeedbackExperience
        orderId={orderId}
        pointId={pointId}
        useMocks={useMocks}
      />
    </div>
  );
}

export async function getServerSideProps({ query, res }) {
  if (!envFlag(process.env.CLIENT_FEEDBACK_EXPERIMENT_ENABLED)) {
    return { notFound: true };
  }

  const city = normalizeCity(query?.city);
  if (!city) return { notFound: true };

  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  return {
    props: {
      orderId: positiveInteger(query?.order_id, 11234),
      pointId: positiveInteger(query?.point_id, 7),
      useMocks: envFlag(process.env.CLIENT_FEEDBACK_EXPERIMENT_USE_MOCKS, true),
    },
  };
}
