import { loadHomePageData } from '@src/shared/lib/loadHomePageData';
import { mapHomePageViewModel } from '@src/pages/home/model/mapHomePageViewModel';
import { HomePage } from '@src/pages/home/ui/HomePage';

export default async function CompactPreviewPage() {
  const data = await loadHomePageData('samara');
  const model = mapHomePageViewModel(data);

  return <HomePage model={model} />;
}
