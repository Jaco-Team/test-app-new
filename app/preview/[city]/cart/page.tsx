import { mapRouteDataToStoreSeed } from '@src/features/bootstrap';
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
      storeSeed={mapRouteDataToStoreSeed(data, { activePage: 'cart' })}
    />
  );
}
