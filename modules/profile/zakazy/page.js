import Meta from '@/components/meta.js';
import useMediaQuery from '@mui/material/useMediaQuery';

import OrderPC from './PC/orderPC';
import OrderMobile from './mobile/orderMobile';

import { BREAKPOINTS } from '@/utils/breakpoints';

export default function OrderPage({ page, this_module, city }) {
  const isMobileOrders = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);

  return (
    <Meta title={page?.title ?? ''} description={''}>
      {isMobileOrders ? 
        <OrderMobile this_module={this_module} city={city} /> 
          : 
        <OrderPC this_module={this_module} city={city} />
      }
    </Meta>
  );
}
