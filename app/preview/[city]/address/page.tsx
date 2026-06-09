import { loadCabinetPageData } from '@src/shared/lib/loadCabinetPageData';
import { AddressClient } from '@src/pages/address/ui/AddressClient';

type PreviewAddressPageProps = {
  params: Promise<{
    city: string;
  }>;
};

export default async function PreviewAddressPage({
  params,
}: PreviewAddressPageProps) {
  const { city } = await params;
  const data = await loadCabinetPageData('address', city);

  return (
    <AddressClient
      storeSeed={{
        city: data.city,
        cities: data.cities,
        links: data.links,
        cats: data.cats,
        allItems: data.all_items,
        freeItems: data.free_items,
        needDop: data.need_dop,
        tags: data.tags,
        activePage: 'address',
      }}
    />
  );
}
