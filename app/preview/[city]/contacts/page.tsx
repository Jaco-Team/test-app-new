import { mapRouteDataToStoreSeed } from '@src/features/bootstrap';
import { ContactsClient, loadContactsPageData } from '@src/pages/contacts';

type PreviewContactsPageProps = {
  params: Promise<{ city: string }>;
};

export default async function PreviewContactsPage({
  params,
}: PreviewContactsPageProps) {
  const { city } = await params;
  const data = await loadContactsPageData(city);

  return (
    <ContactsClient
      storeSeed={mapRouteDataToStoreSeed(data, { activePage: 'contacts' })}
    />
  );
}
