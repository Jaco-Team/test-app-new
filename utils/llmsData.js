import { api } from '@/components/api';
import { CITY_NAMES } from '@/utils/structuredData';

// Данные городов для /llms.txt и /llms-full.txt — те же запросы, что у страниц сайта.
export async function loadLlmsCities({ withDetails = true } = {}) {
  return Promise.all(
    Object.entries(CITY_NAMES).map(async ([slug, name]) => {
      const [catalog, home, footer, locations] = await Promise.all([
        api('home', { type: 'get_items_cat', city_id: slug }),
        withDetails
          ? api('home', { type: 'get_page_info', city_id: slug, page: '' })
          : null,
        withDetails
          ? api('contacts', { type: 'get_page_info', city_id: slug, page: 'info' })
          : null,
        withDetails
          ? api('contacts', { type: 'get_addr_zone_web', city_id: slug })
          : null,
      ]);

      return {
        slug,
        name,
        catalog,
        page: home?.page ?? null,
        links: footer?.page ?? null,
        points: locations?.points || locations?.zones || [],
      };
    })
  );
}

export function sendLlmsText(res, text) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
  );
  res.end(text);
}

export function sendLlmsUnavailable(res) {
  res.statusCode = 503;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end('llms.txt temporarily unavailable');
}
