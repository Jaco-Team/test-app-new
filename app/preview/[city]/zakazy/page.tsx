import { mapRouteDataToStoreSeed } from '@src/features/bootstrap';
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
      storeSeed={mapRouteDataToStoreSeed(data, { activePage: 'zakazy' })}
    />
  );
}
