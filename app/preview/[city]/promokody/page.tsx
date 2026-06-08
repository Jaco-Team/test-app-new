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
      storeSeed={{
        city: data.city,
        cities: data.cities,
        cats: data.cats,
        allItems: data.all_items,
        tags: data.tags,
        links: data.links,
        freeItems: data.free_items,
        needDop: data.need_dop,
        activePage: 'promokody',
        page: data.page,
      }}
    />
  );
}
