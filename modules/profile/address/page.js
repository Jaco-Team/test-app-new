import { useEffect } from 'react';

import Meta from '@/components/meta.js';

import AddressMobile from './addressMobile';
import AddressModalMobile from './modalAddressMobile';
import GetAddressMobile from './modalGetAddressMobile';

import { useHeaderStore } from '@/components/store';

import { useRouter } from 'next/router';

export default function AddressPage({ page, this_module, city }) {
  const { push } = useRouter();

  const [matches] = useHeaderStore((state) => [state.matches]);

  useEffect(() => {
    if (!matches) {
      push(`/${city}/profile`);
    }
  }, []);

  return (
    <Meta title={page.title} description={''}>
      {matches ? (
        <>
          <AddressMobile city={city} />
          <AddressModalMobile city={city} />
          <GetAddressMobile />
        </>
      ) : null }
    </Meta>
  );
}
