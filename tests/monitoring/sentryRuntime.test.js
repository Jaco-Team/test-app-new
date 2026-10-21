import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const sdk = vi.hoisted(() => ({ init: vi.fn(), captureRouterTransitionStart: vi.fn() }));
vi.mock('@sentry/nextjs', () => sdk);
const dsn = `https://${'a'.repeat(32)}@sentry.jacochef.ru/4`;
const runtimes = [
  ['browser', () => import('../../instrumentation-client.js')],
  ['nodejs', () => import('../../sentry.server.config.js')],
  ['edge', () => import('../../sentry.edge.config.js')],
];
beforeEach(() => { vi.resetModules(); sdk.init.mockClear(); vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('SENTRY_DSN', ''); vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', dsn); });
afterEach(() => vi.unstubAllEnvs());
describe.each(runtimes)('SDK %s', (name, load) => {
  it('отправляет все ошибки и 10% трассировок в правильный проект', async () => {
    await load(); const options=sdk.init.mock.calls[0][0];
    expect(options).toMatchObject({ enabled: true, dsn, environment: 'production', sampleRate: 1, tracesSampleRate: 0.1, dataCollection: { httpBodies: [], userInfo: false } });
    expect(options.beforeSendLog({ message: 'sensitive log' })).toBeNull();
    expect(options).not.toHaveProperty('enableLogs');
    expect(options).not.toHaveProperty('sendDefaultPii');
  });
  it('не отправляет события в прежний облачный Sentry', async () => {
    vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', `https://${'a'.repeat(32)}@o1.ingest.sentry.io/4`);
    await load(); expect(sdk.init.mock.calls[0][0].enabled).toBe(false);
  });
  it('позволяет отключить сбор явно', async () => {
    vi.stubEnv(name === 'browser' ? 'NEXT_PUBLIC_SENTRY_ENABLED' : 'SENTRY_ENABLED', 'false');
    await load(); expect(sdk.init.mock.calls[0][0].enabled).toBe(false);
  });
});
