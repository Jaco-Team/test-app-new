export const TOKEN_PATTERN = /^(?:[a-z2-9]{8,16}|[a-z2-7]{32,2048})$/;

export function isValidCafeFeedbackToken(token) {
  return typeof token === 'string' && TOKEN_PATTERN.test(token);
}
