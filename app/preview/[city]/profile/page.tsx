import { mapRouteDataToStoreSeed } from '@src/features/bootstrap';
import { loadProfilePageData } from '@src/shared/lib/loadProfilePageData';
import { ProfileClient } from '@src/pages/profile/ui/ProfileClient';

type CityProfilePageProps = {
  params: Promise<{ city: string }>;
};

export default async function CityProfilePage({
  params,
}: CityProfilePageProps) {
  const { city } = await params;
  const data = await loadProfilePageData(city);

  return (
    <ProfileClient
      storeSeed={mapRouteDataToStoreSeed(data, { activePage: 'profile' })}
    />
  );
}
