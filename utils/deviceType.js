// Тип устройства для статистики оплаты: оплата по СБП с телефона (переход в приложение банка)
// и с компьютера (QR-код) — разные сценарии, и теряются клиенты в них по-разному.
export function deviceType(
  nav = typeof navigator !== 'undefined' ? navigator : undefined
) {
  if (!nav) return undefined;

  const ua = String(nav.userAgent || '');
  // iPadOS представляется компьютером Mac, но у него сенсорный экран.
  const touchMac = /Macintosh/i.test(ua) && Number(nav.maxTouchPoints) > 1;

  if (
    /iPad|Tablet|PlayBook|Silk/i.test(ua) ||
    touchMac ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua))
  ) {
    return 'tablet';
  }

  if (
    nav.userAgentData?.mobile === true ||
    /Mobi|iPhone|iPod|Android|Windows Phone|IEMobile|Opera Mini/i.test(ua)
  ) {
    return 'mobile';
  }

  return 'desktop';
}
