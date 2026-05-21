import Meta from '@/components/meta.js';
import useMediaQuery from '@mui/material/useMediaQuery';

import PromokodyPC from './promokodyPC';
import PromokodyMobile from './promokodyMobile';

import { BREAKPOINTS } from '@/utils/breakpoints';

export default function PromokodyPage({ page, this_module, city }) {
  const isMobilePromokody = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);

  return (
    <Meta title={page?.title ?? ''} description={page?.description ?? ''}>
      {isMobilePromokody ? <PromokodyMobile page={page} this_module={this_module} city={city} /> : <PromokodyPC page={page} this_module={this_module} city={city} />}
    </Meta>
  );
}
