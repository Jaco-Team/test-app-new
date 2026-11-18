import { describe, expect, it } from 'vitest';
import { deviceType } from '../../utils/deviceType';

describe('тип устройства для статистики оплаты', () => {
  it.each([
    [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      {},
      'mobile',
    ],
    [
      'Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36',
      {},
      'mobile',
    ],
    [
      'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 Chrome/130.0 Safari/537.36',
      {},
      'tablet',
    ],
    [
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      {},
      'tablet',
    ],
    // iPadOS представляется компьютером Mac, но у него сенсорный экран.
    [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
      { maxTouchPoints: 5 },
      'tablet',
    ],
    [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
      { maxTouchPoints: 0 },
      'desktop',
    ],
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36',
      {},
      'desktop',
    ],
    ['', { userAgentData: { mobile: true } }, 'mobile'],
  ])('%s → %s', (userAgent, extra, expected) => {
    expect(deviceType({ userAgent, ...extra })).toBe(expected);
  });

  it('без браузера тип не определяется', () => {
    expect(deviceType(null)).toBeUndefined();
  });
});
