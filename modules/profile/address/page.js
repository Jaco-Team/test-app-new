import { useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import Meta from '@/components/meta.js';

import AddressMobile from './addressMobile';
import AddressModalMobile from './modalAddressMobile';
import GetAddressMobile from './modalGetAddressMobile';

import { BREAKPOINTS } from '@/utils/breakpoints';

import { useRouter } from 'next/router';

export default function AddressPage({ page, this_module, city }) {
  const { push } = useRouter();

  const isMobileAddress = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);

  useEffect(() => {
    if (!isMobileAddress) {
      push(`/${city}/profile`);
    }
  }, [isMobileAddress, city, push]);

  return (
    <Meta title={page?.title ?? ''} description={''}>
      {isMobileAddress ? (
        <>
          <AddressMobile city={city} />
          <AddressModalMobile city={city} />
          <GetAddressMobile />
        </>
      ) : null }
    </Meta>
  );
}
