import { afterEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isSiteSentryDsn, SENTRY_URL } from '../../utils/sentryEndpoint.mjs';
import { createSentryBuildOptions } from '../../utils/sentryBuild.mjs';
import { sanitizeSentryEvent, sanitizeSentryBreadcrumb, SENTRY_DATA_COLLECTION } from '../../utils/sentryPrivacy';

const dsn = `https://${'a'.repeat(32)}@sentry.jacochef.ru/4`;
const release = `jacofood-web@${'b'.repeat(40)}`;
const env = { NEXT_PUBLIC_SENTRY_DSN: dsn, SENTRY_RELEASE: release, SENTRY_AUTH_TOKEN: 'synthetic-test-token', SENTRY_UPLOAD_SOURCEMAPS: 'true' };
const invalidDsns = ['', `https://${'a'.repeat(32)}@o1.ingest.sentry.io/4`, dsn.replace('/4', '/3'), dsn.replace('sentry.jacochef.ru', 'sentry.jacochef.ru.evil.test'), dsn.replace('https:', 'http:'), dsn+'?token=secret', dsn+'#hash', dsn.replace('@', ':password@'), dsn.replace('jacochef.ru', 'jacochef.ru:8443')];

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('self-hosted Sentry сайта', () => {
  it('принимает только DSN нового проекта', () => expect(isSiteSentryDsn(dsn)).toBe(true));
  it.each(invalidDsns)('отклоняет неподходящий DSN %s', value => expect(isSiteSentryDsn(value)).toBe(false));
  it('локальная сборка не создаёт releases и не загружает карты', () => {
    const options = createSentryBuildOptions({ SENTRY_AUTH_TOKEN: 'old-cloud-token' });
    expect(options.url).toBe(SENTRY_URL);
    expect(options.authToken).toBeUndefined();
    expect(options.telemetry).toBe(false);
    expect(options.sourcemaps.disable).toBe(true);
    expect(options.release.create).toBe(false);
    expect(options.release.finalize).toBe(false);
  });
  it('production upload привязан к собственному серверу, проекту и полному коммиту', () => {
    const options = createSentryBuildOptions(env);
    expect(options).toMatchObject({ url: SENTRY_URL, org: 'sentry', project: 'jacofood-web', authToken: 'synthetic-test-token', sourcemaps: { disable: false, deleteSourcemapsAfterUpload: true }, release: { name: release, create: true, finalize: true, setCommits: false } });
  });
  it.each([
    ['SENTRY_AUTH_TOKEN', '', 'SENTRY_UPLOAD_TOKEN_REQUIRED'],
    ['SENTRY_RELEASE', 'main', 'SENTRY_COMMIT_RELEASE_REQUIRED'],
    ['NEXT_PUBLIC_SENTRY_DSN', invalidDsns[1], 'SENTRY_SITE_DSN_REQUIRED'],
  ])('production upload отказывается от неверного %s', (key, value, error) => {
    expect(() => createSentryBuildOptions({ ...env, [key]: value })).toThrow(error);
  });
});

describe('данные событий Sentry', () => {
  it('SDK не собирает пользователей, заголовки, cookie и содержимое запросов', () => {
    expect(SENTRY_DATA_COLLECTION).toMatchObject({ userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false });
  });
  it('очищает чувствительные данные, сохраняя маршрут и технические метки', () => {
    const event = sanitizeSentryEvent({ user: { email: 'private@example.test' }, request: { url: 'https://jacofood.ru/togliatti?token=private#return', headers: { Authorization: 'private' }, data: 'password=private', cookies: 'private', query_string: 'private' }, tags: { runtime: 'browser' }, contexts: { page: { url: '/profile?token=private', referrer: '/login?phone=private' } }, extra: { pageUrl: '/cart?token=private', requestUrl: '/backend/auth?token=private', requestMeta: { hasToken: true } }, breadcrumbs: [{ category: 'console', message: 'private' }, { category: 'fetch', data: { url: '/backend/auth?token=private', method: 'POST', body: 'private' } }], spans: [{ data: { 'http.url': '/backend/auth?token=private' } }] });
    expect(JSON.stringify(event)).not.toContain('private');
    expect(event.request.url).toBe('https://jacofood.ru/togliatti');
    expect(event.tags.runtime).toBe('browser');
    expect(event.extra.requestMeta.hasToken).toBe(true);
    expect(event.breadcrumbs).toHaveLength(1);
    expect(event.spans[0].data['http.url']).toBe('/backend/auth');
  });
  it('не отправляет содержимое console breadcrumbs', () => expect(sanitizeSentryBreadcrumb({ category: 'console', message: 'user input' })).toBeNull());
});

describe('публичный snapshot CI', () => {
  const helper = fileURLToPath(new URL('../../.github/scripts/jaco-site/prepare-public-build.py', import.meta.url));
  function validate(value) {
    const config = {
      NEXT_PUBLIC_SITE_API_BASE_URL: 'https://jacofood.ru/backend/', NEXT_PUBLIC_CAFE_REVIEW_API_URL: 'https://jacofood.ru/backend/cafe_review',
      NEXT_PUBLIC_RECOMMENDATIONS_ENABLED: 'false', NEXT_PUBLIC_SBP_ENABLED: 'false', NEXT_PUBLIC_SENTRY_CUSTOM_MONITORING_ENABLED: 'true', NEXT_PUBLIC_SENTRY_DSN: value,
      NEXT_PUBLIC_VK_IMG: 'https://mainimg.jacofood.ru/', NEXT_PUBLIC_YANDEX_IMG: 'https://mainimg.jacofood.ru/', NEXT_PUBLIC_YANDEX_STORAGE: 'https://topimg.jacofood.ru/',
      NEXT_PUBLIC_YANDEX_TOKEN_FIREBASE: '', NEXT_PUBLIC_YANDEX_TOKEN_MAP: 'synthetic-map-key', NEXT_PUBLIC_YANDEX_TOKEN_SUGGEST: 'synthetic-suggest-key', NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY: 'synthetic-captcha-key',
    };
    const code = 'import importlib.util,json,sys; s=importlib.util.spec_from_file_location("helper",sys.argv[1]); m=importlib.util.module_from_spec(s);s.loader.exec_module(m); m.validate_public_config(json.load(sys.stdin)); print("valid")';
    return execFileSync('python3', ['-B', '-c', code, helper], { input: JSON.stringify(config), encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim();
  }
  it('разрешает DSN self-hosted проекта в существующей схеме OpenBao', () => expect(validate(dsn)).toBe('valid'));
  it.each(invalidDsns.slice(1))('отклоняет чужой DSN %s', value => expect(() => validate(value)).toThrow());
});
