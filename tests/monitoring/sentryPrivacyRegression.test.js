import { describe, expect, it } from 'vitest';
import { sanitizeSentryEvent, sanitizeSentrySpan } from '../../utils/sentryPrivacy';

describe('очистка новых диагностических полей', () => {
  it('удаляет query из текста исключения Next.js и вложенных URL', () => {
    const event = sanitizeSentryEvent({
      message: 'Invariant: attempted to hard navigate to the same URL /samara?token=private https://jacofood.ru/samara?utm=private#private',
      exception: { values: [{ value: 'Error loading https://jacofood.ru/_next/app.js?token=private', stacktrace: { frames: [{ filename: 'https://jacofood.ru/app.js?token=private' }] } }] },
      extra: { failedRoute: '/samara/cart?token=private', url: '/samara?token=private', referrer: '/login?phone=private', nested: { requestUrl: '/backend/auth?token=private', token: 'private', password: 'private', hasToken: true } },
      contexts: { page: { url: '/samara?private', referrer: '/login?private' } },
    });
    expect(JSON.stringify(event)).not.toContain('private');
    expect(event.extra.nested.hasToken).toBe(true);
    expect(event.exception.values[0].stacktrace.frames[0].filename).toBe('https://jacofood.ru/app.js');
    expect(event.message).toContain('https://jacofood.ru/samara');
  });
  it('очищает streamed root span в SDK 11, включая имя и вложенные атрибуты', () => {
    const span = sanitizeSentrySpan({
      name: 'GET https://jacofood.ru/backend/cart?token=private',
      attributes: { 'http.url': 'https://jacofood.ru/cart?token=private', 'url.full': '/cart?token=private', 'http.target': '/cart?token=private', nested: { url: '/cart?private', headers: { authorization: 'private' } }, 'http.request.method': 'GET', 'sentry.op': 'http.client' },
      links: [{ attributes: { url: '/cart?token=private' } }],
    });
    expect(JSON.stringify(span)).not.toContain('private');
    expect(span.name).toBe('GET https://jacofood.ru/backend/cart');
    expect(span.attributes['http.request.method']).toBe('GET');
    expect(span.attributes['sentry.op']).toBe('http.client');
  });
  it('обрабатывает циклическую диагностику без ошибки beforeSend', () => {
    const cyclic = { url: '/cart?private' };
    cyclic.self = cyclic;
    const result = sanitizeSentryEvent({ extra: cyclic });
    expect(result.extra).toEqual({ url: '/cart', self: '[omitted]' });
  });
});
