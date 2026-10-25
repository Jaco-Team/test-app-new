export function prepareRussianPhoneInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '');

  if (digits.length < 10) {
    return value;
  }

  const subscriberDigits =
    digits.length > 10 && (digits.startsWith('7') || digits.startsWith('8'))
      ? digits.slice(1)
      : digits;

  return subscriberDigits.slice(0, 10);
}
