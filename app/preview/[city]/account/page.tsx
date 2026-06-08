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
      storeSeed={{
        city: data.city,
        cities: data.cities,
        cats: data.cats,
        allItems: data.all_items,
        tags: data.tags,
        links: data.links,
        freeItems: data.free_items,
        needDop: data.need_dop,
        activePage: 'account',
        page: data.page,
      }}
    />
  );
}
