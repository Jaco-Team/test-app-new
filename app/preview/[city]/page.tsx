import { loadHomePageData } from '@src/shared/lib/loadHomePageData';
import { mapHomePageViewModel } from '@src/pages/home/model/mapHomePageViewModel';
import { HomeClient } from '@src/pages/home/ui/HomeClient';

type CityHomePageProps = {
  params: Promise<{ city: string }>;
};

export default async function CityHomePage({ params }: CityHomePageProps) {
  const { city } = await params;
  const data = await loadHomePageData(city);
  const model = mapHomePageViewModel(data);

  return (
    <HomeClient
      model={model}
      storeSeed={{
        city: data.city,
        cities: data.cities,
        cats: data.cats,
        allItems: data.all_items,
        tags: data.tags,
        links: data.links,
        freeItems: data.free_items,
        needDop: data.need_dop,
      }}
    />
  );
}
