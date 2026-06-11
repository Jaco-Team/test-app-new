import type { HomePageRawData } from '@src/shared/lib/loadHomePageData';
import type { StoreBootstrapProps } from '../model/types';

type MapRouteDataToStoreSeedOptions = Pick<StoreBootstrapProps, 'activePage'>;

export function mapRouteDataToStoreSeed(
  data: HomePageRawData,
  options?: Partial<MapRouteDataToStoreSeedOptions>
): StoreBootstrapProps {
  return {
    city: data.city,
    cities: data.cities,
    cats: data.cats,
    allItems: data.all_items,
    tags: data.tags,
    links: data.links,
    freeItems: data.free_items,
    needDop: data.need_dop,
    page: data.page,
    ...(options?.activePage ? { activePage: options.activePage } : {}),
  };
}
