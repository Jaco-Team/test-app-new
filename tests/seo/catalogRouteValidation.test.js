import { describe, expect, it, vi } from 'vitest';
import { catalogRoute } from '../../utils/catalogRoute';
vi.mock('@/components/api.js', () => ({ api: vi.fn() }));
vi.mock('@/modules/cityTextPage', () => ({ default: () => null }));
vi.mock('@/utils/serverHeaderCategories', () => ({ loadHeaderCategories: vi.fn(async () => []) }));
import { api } from '@/components/api.js';
import { getServerSideProps } from '../../pages/[city]/[page].jsx';

const context = (city, page, query) => ({
  params: { city, page },
  query,
  req: { headers: {} },
  res: { setHeader: vi.fn() },
});

describe('граница URL каталога', () => {
  it.each(['samara', 'togliatti'])('сохраняет действующие ссылки %s', (city) => {
    expect(catalogRoute(city, 'firmennye-rolly')).toEqual({ city, category: 'firmennye-rolly' });
    expect(catalogRoute(city, 'sroki_godnosti')).toEqual({ city, category: 'sroki_godnosti' });
  });
  it.each([
    ['.well-known', 'assetlinks.json'], ['wordpress', 'xmlrpc.php'],
    ['config', 'mail.php'], ['togliatti', 'rolly&sa=u'],
    ['samara', 'bad slug'], ['samara', '../menu'], ['samara', '%2527'],
    ['samara', ['rolly']], [['samara'], 'rolly'], ['samara', 'x'.repeat(192)],
  ])('отклоняет неподходящий маршрут до обращения к API: %s/%s', async (city, category) => {
    api.mockClear();
    expect(catalogRoute(city, category)).toBeNull();
    expect(await getServerSideProps(context(city, category))).toEqual({ notFound: true });
    expect(api).not.toHaveBeenCalled();
  });
  it('предпочитает сегменты пути одноимённым query-параметрам', async () => {
    api.mockResolvedValueOnce({ page: { category_id: 1 } });
    const result = await getServerSideProps(context('samara', 'rolly', { city: 'other', page: 'bad slug' }));
    expect(result.redirect.destination).toBe('/samara/menu/rolly');
    expect(api).toHaveBeenLastCalledWith('contacts', { type: 'get_page_info', city_id: 'samara', page: 'rolly' });
  });

  it('сохраняет HTTP 404 для отсутствующей CMS-страницы', async () => {
    api.mockResolvedValueOnce({ page: null });
    expect(await getServerSideProps(context('samara', 'missing-page'))).toEqual({ notFound: true });
  });

  it('не выдаёт ошибку API за отсутствующую страницу', async () => {
    api.mockResolvedValueOnce({ st: false });
    await expect(getServerSideProps(context('samara', 'legal'))).rejects.toThrow('CMS API unavailable');
  });

  it('не превращает служебный info в пустую страницу с HTTP 200', async () => {
    api.mockClear();
    expect(await getServerSideProps(context('samara', 'info'))).toEqual({ notFound: true });
    expect(api).not.toHaveBeenCalled();
  });
});
