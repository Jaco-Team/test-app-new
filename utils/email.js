const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function normalizeEmail(value) {
  return String(value ?? '').trim();
}

export function isValidEmail(value) {
  const email = normalizeEmail(value);
  const [localPart = ''] = email.split('@');

  return (
    email.length <= 254 &&
    !localPart.startsWith('.') &&
    !localPart.endsWith('.') &&
    !localPart.includes('..') &&
    EMAIL_PATTERN.test(email)
  );
}
