import { loadCabinetPageData } from '@src/shared/lib/loadCabinetPageData';
import { OrdersClient } from '@src/pages/orders/ui/OrdersClient';

type CityOrdersPageProps = {
  params: Promise<{ city: string }>;
};

export default async function CityOrdersPage({ params }: CityOrdersPageProps) {
  const { city } = await params;
  const data = await loadCabinetPageData('zakazy', city);

  return (
    <OrdersClient
      storeSeed={{
        city: data.city,
        cities: data.cities,
        cats: data.cats,
        allItems: data.all_items,
        tags: data.tags,
        links: data.links,
        freeItems: data.free_items,
        needDop: data.need_dop,
        activePage: 'zakazy',
        page: data.page,
      }}
    />
  );
}
