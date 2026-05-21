import Meta from '@/components/meta.js';
import useMediaQuery from '@mui/material/useMediaQuery';

import AccountMobile from './accountMobile';
import AccountModalMobile from './modalAccountMobile';

import { BREAKPOINTS } from '@/utils/breakpoints';

export default function AccountPage({ page, this_module, city }) {
  const isMobileAccount = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);

  return (
    <Meta title={page?.title ?? ''} description={''}>
      {isMobileAccount ? (
        <>
          <AccountMobile city={city} this_module={this_module} />
          <AccountModalMobile />
        </>
      ) : null }
    </Meta>
  );
}
