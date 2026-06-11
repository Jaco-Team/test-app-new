import { mapRouteDataToStoreSeed } from '@src/features/bootstrap';
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

  return <HomeClient model={model} storeSeed={mapRouteDataToStoreSeed(data)} />;
}
