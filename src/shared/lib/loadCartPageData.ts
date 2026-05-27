import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { api } from '@src/shared/api';
import { normalizeCity } from './normalizeCity';
import { cityPath } from './sitePaths';
import type { HomePageRawData } from './loadHomePageData';

async function readCookieCity(): Promise<string> {
  const cookieStore = await cookies();
  return normalizeCity(cookieStore.get('city')?.value);
}

export async function loadCartPageData(
  cityParam: string | string[] | undefined
): Promise<HomePageRawData> {
  const cityFromPath = normalizeCity(
    Array.isArray(cityParam) ? cityParam[0] : cityParam
  );
  const savedCity = await readCookieCity();
  const city = cityFromPath || savedCity || 'togliatti';

  if (!cityFromPath) {
    redirect(cityPath(city, 'cart'));
  }

  const data1 = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: '',
  });

  if (!data1 || data1?.page == null) {
    if (city !== 'togliatti') {
      redirect(cityPath('togliatti', 'cart'));
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
    page: data1.page ?? null,
    cats: Array.isArray(data1.cats) ? data1.cats : [],
    cities: Array.isArray(data1.cities) ? data1.cities : [],
    all_items: Array.isArray(data1.all_items) ? data1.all_items : [],
    free_items: Array.isArray(data1.free_items) ? data1.free_items : [],
    need_dop: data1.need_dop ?? {},
    tags: Array.isArray(data1.tags) ? data1.tags : [],
    links: (footer?.page as Record<string, unknown>) ?? {},
    banners: [],
  };
}
