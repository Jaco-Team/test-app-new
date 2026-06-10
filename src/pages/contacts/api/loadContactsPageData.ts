import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { api } from '@src/shared/api';
import { normalizeCity } from '@src/shared/lib/normalizeCity';
import { cityPath } from '@src/shared/lib/sitePaths';
import type { HomePageRawData } from '@src/shared/lib/loadHomePageData';

async function readCookieCity(): Promise<string> {
  const cookieStore = await cookies();
  return normalizeCity(cookieStore.get('city')?.value);
}

export async function loadContactsPageData(
  cityParam: string | string[] | undefined
): Promise<HomePageRawData> {
  const cityFromPath = normalizeCity(
    Array.isArray(cityParam) ? cityParam[0] : cityParam
  );
  const savedCity = await readCookieCity();
  const city = cityFromPath || savedCity || 'togliatti';

  if (!cityFromPath) {
    redirect(cityPath(city, 'contacts'));
  }

  const data = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: 'contacts',
  });

  if (!data || data?.page == null) {
    if (city !== 'togliatti') {
      redirect(cityPath('togliatti', 'contacts'));
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
