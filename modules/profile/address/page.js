import Meta from '@/components/meta.js';

import AddressMobile from './addressMobile';
import AddressModalMobile from './modalAddressMobile';

import { useHeaderStore } from '@/components/store';

export default function AddressPage({ page, this_module, city }) {
  const [matches] = useHeaderStore((state) => [state.matches]);

  return (
    <Meta title={page.title} description={''}>
      {matches ? (
        <>
       <AddressMobile city={city} />
       <AddressModalMobile city={city}/>
        </>
      ) : null }
    </Meta>
  );
}
