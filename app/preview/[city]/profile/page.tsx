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
      storeSeed={{
        city: data.city,
        cities: data.cities,
        cats: data.cats,
        allItems: data.all_items,
        tags: data.tags,
        links: data.links,
        freeItems: data.free_items,
        needDop: data.need_dop,
        activePage: 'profile',
        page: data.page,
      }}
    />
  );
}
