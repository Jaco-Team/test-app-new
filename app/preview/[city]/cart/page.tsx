import { loadCartPageData } from '@src/shared/lib/loadCartPageData';
import { CartClient } from '@src/pages/cart/ui/CartClient';

type CityCartPageProps = {
  params: Promise<{ city: string }>;
};

export default async function CityCartPage({ params }: CityCartPageProps) {
  const { city } = await params;
  const data = await loadCartPageData(city);

  return (
    <CartClient
      storeSeed={{
        city: data.city,
        cities: data.cities,
        cats: data.cats,
        allItems: data.all_items,
        tags: data.tags,
        links: data.links,
        freeItems: data.free_items,
        needDop: data.need_dop,
        activePage: 'cart',
        page: data.page,
      }}
    />
  );
}
