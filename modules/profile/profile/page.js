import Meta from '@/components/meta.js';
import useMediaQuery from '@mui/material/useMediaQuery';

import ProfilePC from './profilePC.jsx';
import ProfileMobile from './profileMobile.js';

import { BREAKPOINTS } from '@/utils/breakpoints';

export default function ProfilePage({ page, this_module, city }) {
  const isMobileProfile = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);

  return (
    <Meta title={page?.title ?? ''} description={''}>
      {isMobileProfile ? <ProfileMobile city={city} this_module={this_module}/> : <ProfilePC page={page} this_module={this_module} city={city} />}
    </Meta>
  );
}
