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
      storeSeed={{
        city: data.city,
        cities: data.cities,
        cats: data.cats,
        allItems: data.all_items,
        freeItems: data.free_items,
        needDop: data.need_dop,
        tags: data.tags,
        links: data.links,
        activePage: 'contacts',
        page: data.page,
      }}
    />
  );
}
