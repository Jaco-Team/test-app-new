// Таймер повторной отправки кода берётся из retry_after ответа /auth
// (sendsmsrp / create_profile): по умолчанию бэкенд ставит 90 сек. (SITE_AUTH_SMS_BACKOFF_SECONDS).
export const DEFAULT_SMS_RESEND_SECONDS = 89;

export function smsResendSeconds(json) {
  const retryAfter = Number(json?.retry_after);

  if (!Number.isInteger(retryAfter) || retryAfter <= 0) {
    return DEFAULT_SMS_RESEND_SECONDS;
  }

  return retryAfter;
}
