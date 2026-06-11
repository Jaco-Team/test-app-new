import { mapRouteDataToStoreSeed } from '@src/features/bootstrap';
import { loadCabinetPageData } from '@src/shared/lib/loadCabinetPageData';
import { PromosClient } from '@src/pages/promos/ui/PromosClient';

type CityPromosPageProps = {
  params: Promise<{ city: string }>;
};

export default async function CityPromosPage({ params }: CityPromosPageProps) {
  const { city } = await params;
  const data = await loadCabinetPageData('promokody', city);

  return (
    <PromosClient
      storeSeed={mapRouteDataToStoreSeed(data, { activePage: 'promokody' })}
    />
  );
}
