import { afterEach, expect, it, vi } from 'vitest';
import * as Sentry from '@sentry/nextjs';
import handler from '../../pages/api/sentry-example-api.js';

vi.mock('@sentry/nextjs', () => ({
  logger: { info: vi.fn() },
  captureException: vi.fn(),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

function response() {
  return { status: vi.fn().mockReturnThis(), json: vi.fn(), end: vi.fn() };
}

it('в production возвращает 404 до регистрации события Sentry', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const res = response();
  handler({}, res);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.end).toHaveBeenCalledOnce();
  expect(Sentry.logger.info).not.toHaveBeenCalled();
  expect(Sentry.captureException).not.toHaveBeenCalled();
});

it('в development сохраняет демонстрационное событие и ответ 500', () => {
  vi.stubEnv('NODE_ENV', 'development');
  const res = response();
  handler({}, res);
  expect(Sentry.captureException).toHaveBeenCalledOnce();
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ ok: false, message: expect.any(String) });
});
