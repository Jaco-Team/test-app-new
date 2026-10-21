import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('@/components/api.js', () => ({ api: vi.fn() }));
vi.mock('@/components/footer.js', () => ({ default: () => null }));
vi.mock('@/components/structuredData', () => ({ default: () => null }));
vi.mock('@/utils/structuredData', () => ({ categorySchema: () => null }));
vi.mock('next/dynamic', () => ({ default: () => () => null }));
vi.mock('@/ui/Font.js', () => ({ roboto: { variable: 'test' } }));
vi.mock('@/components/store.js', () => ({ useHomeStore: vi.fn(), useCitiesStore: vi.fn(), useHeaderStoreNew: vi.fn(), useCartStore: vi.fn() }));
import { api } from '@/components/api.js';
import { getServerSideProps } from '../../pages/[city]/menu/[category].js';

beforeEach(() => vi.clearAllMocks());
describe('канонический маршрут каталога', () => {
  it.each([
    { city: 'samara', category: 'rolly&sa=u' },
    { city: '.well-known', category: 'assetlinks.json' },
    { city: 'wordpress', category: 'xmlrpc.php' },
  ])('отдаёт 404 до API и установки cache headers: %j', async (params) => {
    const setHeader = vi.fn();
    expect(await getServerSideProps({ params, res: { setHeader } })).toEqual({ notFound: true });
    expect(api).not.toHaveBeenCalled();
    expect(setHeader).not.toHaveBeenCalled();
  });
  it.each(['samara', 'togliatti'])('загружает каталог %s по params, сохраняя прямые ссылки', async (city) => {
    api.mockImplementation(async (module, data) => {
      if (data.type === 'get_items_cat') return { main_cat: [] };
      return { page: { category_id: 1 }, cities: [], cats: [], all_items: [] };
    });
    const result = await getServerSideProps({
      params: { city, category: 'firmennye-rolly' },
      query: { city: '.well-known', category: 'assetlinks.json' },
      res: { setHeader: vi.fn() },
    });
    expect(result.props.data1).toMatchObject({ city, category: 'firmennye-rolly' });
    expect(api).toHaveBeenCalledWith('home', { type: 'get_page_info', city_id: city, page: 'firmennye-rolly' });
  });
});
