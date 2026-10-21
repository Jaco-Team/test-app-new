import { describe, expect, it, vi } from 'vitest';
import { catalogRoute } from '../../utils/catalogRoute';
vi.mock('@/components/api.js', () => ({ api: vi.fn() }));
import { api } from '@/components/api.js';
import { getServerSideProps } from '../../pages/[city]/[category].js';

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
    expect(await getServerSideProps({ params: { city, category } })).toEqual({ notFound: true });
    expect(api).not.toHaveBeenCalled();
  });
  it('предпочитает сегменты пути одноимённым query-параметрам', async () => {
    api.mockResolvedValueOnce({ page: { category_id: 1 } });
    const result = await getServerSideProps({ params: { city: 'samara', category: 'rolly' }, query: { city: 'other', category: 'bad slug' } });
    expect(result.redirect.destination).toBe('/samara/menu/rolly');
    expect(api).toHaveBeenLastCalledWith('home', { type: 'get_page_info', city_id: 'samara', page: 'rolly' });
  });
});
