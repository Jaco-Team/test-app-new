import { isValidCafeFeedbackToken } from './cafeFeedbackToken.mjs';

function setFeedbackHeaders(response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('X-Frame-Options', 'DENY');
}

export function createCafeFeedbackServerSideProps(uiVariant) {
  return async function getServerSideProps(context) {
    setFeedbackHeaders(context.res);

    if (process.env.CAFE_FEEDBACK_PAGE_ENABLED !== 'true') {
      return { notFound: true };
    }

    const token = Array.isArray(context.params?.token)
      ? context.params.token[0]
      : context.params?.token;

    if (!isValidCafeFeedbackToken(token)) {
      return { notFound: true };
    }

    return {
      props: {
        token,
        uiVariant,
      },
    };
  };
}
