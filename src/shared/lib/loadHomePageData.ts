import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { api } from './previewApi';
import { normalizeCity } from './normalizeCity';

const HOME_MODULE = 'home';

export type HomePageRawData = {
  city: string;
  page: Record<string, unknown> | null;
  cats: unknown[];
  cities: unknown[];
  all_items: unknown[];
  tags: unknown[];
  links: Record<string, unknown>;
  banners: unknown[];
};

async function readCookieCity(): Promise<string> {
  const cookieStore = await cookies();
  return normalizeCity(cookieStore.get('city')?.value);
}

export async function loadHomePageData(
  cityParam: string | string[] | undefined
): Promise<HomePageRawData> {
  const cityFromPath = normalizeCity(
    Array.isArray(cityParam) ? cityParam[0] : cityParam
  );
  const savedCity = await readCookieCity();
  const city = cityFromPath || savedCity || 'togliatti';

  if (!cityFromPath) {
    redirect(`/preview/${city}`);
  }

  const data1 = await api(HOME_MODULE, {
    type: 'get_page_info',
    city_id: city,
    page: '',
  });

  if (!data1 || data1?.page == null) {
    if (city !== 'togliatti') {
      redirect('/preview/togliatti');
    }
    notFound();
  }

  const footer = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: 'info',
  });

  const bannersJson = await api(HOME_MODULE, {
    type: 'get_banners',
    city_id: city,
    token: '',
  });

  const bannerList = Array.isArray(bannersJson?.banners)
    ? bannersJson.banners.filter(
        (item: { is_active_home?: string | number }) =>
          parseInt(String(item?.is_active_home ?? 0), 10) === 1
      )
    : [];

  return {
    city,
    page: data1.page ?? null,
    cats: Array.isArray(data1.cats) ? data1.cats : [],
    cities: Array.isArray(data1.cities) ? data1.cities : [],
    all_items: Array.isArray(data1.all_items) ? data1.all_items : [],
    tags: Array.isArray(data1.tags) ? data1.tags : [],
    links: (footer?.page as Record<string, unknown>) ?? {},
    banners: bannerList,
  };
}
