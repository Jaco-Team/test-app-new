import { afterEach, describe, expect, it, vi } from 'vitest';

import handler from '../../pages/api/cleaning/[location]/[document].js';
import {
  CLEANING_SCHEDULES,
  getCleaningSchedule,
  getCleaningSchedulePaths,
} from '../../utils/cleaningSchedules.js';

const locations = Object.keys(CLEANING_SCHEDULES);
const locationSlugs = locations.flatMap((location) => [
  location,
  location.replaceAll('-', '_'),
]);

function response() {
  const headers = new Map();
  return {
    headers,
    setHeader: vi.fn((key, value) => headers.set(key.toLowerCase(), value)),
    status: vi.fn(function setStatus(code) {
      this.statusCode = code;
      return this;
    }),
    json: vi.fn(function sendJson(value) {
      this.body = value;
      return this;
    }),
    send: vi.fn(function sendBody(value) {
      this.body = value;
      return this;
    }),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('графики уборки', () => {
  it('разрешает ровно семь известных кафе и соответствующие PDF', () => {
    expect(locations).toHaveLength(7);
    expect(getCleaningSchedulePaths()).toHaveLength(14);
    for (const location of locations) {
      const schedule = getCleaningSchedule(location, 'guest-toilet');
      expect(schedule).toMatchObject({
        location,
        documentSlug: 'guest-toilet',
        goalId: expect.stringMatching(/^open_cleaning_/),
      });
      expect(new URL(schedule.url).hostname).toBe('storage.yandexcloud.net');
      expect(schedule.url).toContain(`/${location}/guest-toilet.pdf`);
    }
    expect(getCleaningSchedule('../other', 'guest-toilet')).toBeNull();
    expect(getCleaningSchedule('kuybysheva-113', 'private')).toBeNull();
    expect(getCleaningSchedule('kuybysheva-113', 'toString')).toBeNull();
  });

  it.each(locations)(
    'ссылка с подчёркиванием открывает тот же график %s',
    (location) => {
      const alias = location.replaceAll('-', '_');
      expect(getCleaningSchedule(alias, 'guest-toilet')).toEqual(
        getCleaningSchedule(location, 'guest-toilet')
      );
      expect(getCleaningSchedulePaths()).toContainEqual({
        params: { location: alias, document: 'guest-toilet' },
      });
    }
  );

  it('каждый статический маршрут соответствует известному графику', () => {
    const paths = getCleaningSchedulePaths();
    expect(
      new Set(
        paths.map(({ params }) => `${params.location}/${params.document}`)
      ).size
    ).toBe(paths.length);
    for (const { params } of paths) {
      expect(
        getCleaningSchedule(params.location, params.document)
      ).not.toBeNull();
    }
  });

  it('возвращает 404 для неизвестного кафе или документа, не вызывая S3', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    for (const query of [
      { location: 'unknown', document: 'guest-toilet' },
      { location: 'kuybysheva-113', document: 'unknown' },
      { location: 'https://example.com', document: 'guest-toilet' },
      { location: 'unknown_47', document: 'guest-toilet' },
      { location: 'kuybysheva_113', document: 'toString' },
    ]) {
      const res = response();
      await handler({ method: 'GET', query }, res);
      expect(res.statusCode).toBe(404);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('не позволяет использовать маршрут для другого метода', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = response();

    await handler(
      {
        method: 'POST',
        query: { location: locations[0], document: 'guest-toilet' },
      },
      res
    );

    expect(res.statusCode).toBe(405);
    expect(res.headers.get('allow')).toBe('GET');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(locationSlugs)(
    'отдаёт PDF для %s с запретом кеширования',
    async (location) => {
      const bytes = new Uint8Array([37, 80, 68, 70, 45]);
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/pdf' },
        arrayBuffer: async () => bytes.buffer,
      });
      vi.stubGlobal('fetch', fetchMock);
      const res = response();

      await handler(
        { method: 'GET', query: { location, document: 'guest-toilet' } },
        res
      );

      expect(res.statusCode).toBe(200);
      expect(res.headers.get('content-type')).toBe('application/pdf');
      expect(res.headers.get('cache-control')).toContain('no-store');
      expect(res.headers.get('content-disposition')).toContain('inline;');
      expect(res.body).toEqual(Buffer.from(bytes));
      const [sourceUrl, options] = fetchMock.mock.calls[0];
      expect(sourceUrl.hostname).toBe('storage.yandexcloud.net');
      expect(sourceUrl.pathname).toContain(
        `/${getCleaningSchedule(location, 'guest-toilet').location}/guest-toilet.pdf`
      );
      expect(sourceUrl.searchParams.has('viewer_version')).toBe(true);
      expect(options.cache).toBe('no-store');
    }
  );

  it.each([
    { ok: false, headers: { get: () => 'application/pdf' } },
    { ok: true, headers: { get: () => 'text/html' } },
  ])('отклоняет отсутствующий PDF и ответ другого типа', async (reply) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply));
    const res = response();

    await handler(
      {
        method: 'GET',
        query: { location: locations[0], document: 'guest-toilet' },
      },
      res
    );

    expect(res.statusCode).toBe(502);
    expect(res.send).not.toHaveBeenCalled();
  });

  it('возвращает контролируемую ошибку при сбое S3', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    const res = response();

    await handler(
      {
        method: 'GET',
        query: { location: locations[0], document: 'guest-toilet' },
      },
      res
    );

    expect(res.statusCode).toBe(502);
    expect(res.send).not.toHaveBeenCalled();
  });
});
