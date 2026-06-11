import { mapRouteDataToStoreSeed } from '@src/features/bootstrap';
import { loadCabinetPageData } from '@src/shared/lib/loadCabinetPageData';
import { AccountClient } from '@src/pages/account/ui/AccountClient';

type CityAccountPageProps = {
  params: Promise<{ city: string }>;
};

export default async function CityAccountPage({
  params,
}: CityAccountPageProps) {
  const { city } = await params;
  const data = await loadCabinetPageData('account', city);

  return (
    <AccountClient
      storeSeed={mapRouteDataToStoreSeed(data, { activePage: 'account' })}
    />
  );
}
