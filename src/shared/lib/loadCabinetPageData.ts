import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { api } from '@src/shared/api';
import { normalizeCity } from './normalizeCity';
import { cityPath } from './sitePaths';
import type { HomePageRawData } from './loadHomePageData';

export type CabinetRouteModule =
  | 'account'
  | 'profile'
  | 'address'
  | 'zakazy'
  | 'promokody';

const CABINET_PAGE_CONFIG: Record<
  CabinetRouteModule,
  { apiModule: 'profile' | 'zakazy' | 'promokody'; page: string }
> = {
  account: { apiModule: 'profile', page: 'profile' },
  profile: { apiModule: 'profile', page: 'profile' },
  address: { apiModule: 'profile', page: 'profile' },
  zakazy: { apiModule: 'zakazy', page: 'zakazy' },
  promokody: { apiModule: 'promokody', page: 'promokody' },
};

async function readCookieCity(): Promise<string> {
  const cookieStore = await cookies();
  return normalizeCity(cookieStore.get('city')?.value);
}

export async function loadCabinetPageData(
  moduleName: CabinetRouteModule,
  cityParam: string | string[] | undefined
): Promise<HomePageRawData> {
  const cityFromPath = normalizeCity(
    Array.isArray(cityParam) ? cityParam[0] : cityParam
  );
  const savedCity = await readCookieCity();
  const city = cityFromPath || savedCity || 'togliatti';
  const routeSegment = moduleName === 'profile' ? 'profile' : moduleName;
  const config = CABINET_PAGE_CONFIG[moduleName];

  if (!cityFromPath) {
    redirect(cityPath(city, routeSegment));
  }

  const data = await api(config.apiModule, {
    type: 'get_page_info',
    city_id: city,
    page: config.page,
  });

  if (!data || data?.page == null) {
    if (city !== 'togliatti') {
      redirect(cityPath('togliatti', routeSegment));
    }
    notFound();
  }

  const footer = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: 'info',
  });

  return {
    city,
    page: data.page ?? null,
    cats: Array.isArray(data.cats) ? data.cats : [],
    cities: Array.isArray(data.cities) ? data.cities : [],
    all_items: Array.isArray(data.all_items) ? data.all_items : [],
    free_items: Array.isArray(data.free_items) ? data.free_items : [],
    need_dop: data.need_dop ?? {},
    tags: Array.isArray(data.tags) ? data.tags : [],
    links: (footer?.page as Record<string, unknown>) ?? {},
    banners: [],
  };
}
