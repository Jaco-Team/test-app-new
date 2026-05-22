import { loadHomePageData } from '@src/shared/lib/loadHomePageData';
import { mapHomePageViewModel } from '@src/pages/home/model/mapHomePageViewModel';
import { PreviewHomeClient } from '@src/pages/home/ui/PreviewHomeClient';

type PreviewCityPageProps = {
  params: Promise<{ city: string }>;
};

export default async function PreviewCityPage({
  params,
}: PreviewCityPageProps) {
  const { city } = await params;
  const data = await loadHomePageData(city);
  const model = mapHomePageViewModel(data);

  return (
    <PreviewHomeClient
      model={model}
      storeSeed={{
        city: data.city,
        cities: data.cities,
        cats: data.cats,
        allItems: data.all_items,
        tags: data.tags,
      }}
    />
  );
}
