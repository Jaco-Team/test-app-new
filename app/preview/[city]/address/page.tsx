import { mapRouteDataToStoreSeed } from '@src/features/bootstrap';
import { loadCabinetPageData } from '@src/shared/lib/loadCabinetPageData';
import { AddressClient } from '@src/pages/address/ui/AddressClient';

type PreviewAddressPageProps = {
  params: Promise<{
    city: string;
  }>;
};

export default async function PreviewAddressPage({
  params,
}: PreviewAddressPageProps) {
  const { city } = await params;
  const data = await loadCabinetPageData('address', city);

  return (
    <AddressClient
      storeSeed={mapRouteDataToStoreSeed(data, { activePage: 'address' })}
    />
  );
}
